import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { QueryOrder, QueryType, OrderStatus, areContractsConfigured, completeOrderOnChain } from '@/lib/contracts';
import {
  getQueries,
  getQueryById,
  addQuery,
  updateQueryStatus,
  updateQueryStatusWithResult,
  getDatasetById,
} from '@/lib/store';
import {
  getDatasetData,
  computeAggregation,
  computeMLTraining,
  computeAnalytics,
  computeCohort,
  computeCorrelation,
} from '@/lib/dataset-data';
import { uploadJsonToLighthouse, isLighthouseConfigured } from '@/lib/filecoin-service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// ---------------------------------------------------------------------------
// Rate-limit helper
// ---------------------------------------------------------------------------

function rateLimitGuard(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// GET /api/queries
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const blocked = rateLimitGuard(request);
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const datasetId = searchParams.get('datasetId');
    const buyer = searchParams.get('buyer');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'limit must be between 1 and 100' },
        { status: 400 },
      );
    }
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { success: false, error: 'offset must be a non-negative integer' },
        { status: 400 },
      );
    }

    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status: ${status}. Must be one of: ${Object.values(OrderStatus).join(', ')}` },
        { status: 400 },
      );
    }

    if (id) {
      const order = getQueryById(id);
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Query order not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: order });
    }

    let filteredOrders = getQueries();

    if (datasetId) {
      filteredOrders = filteredOrders.filter((order) => order.datasetId === datasetId);
    }
    if (buyer) {
      filteredOrders = filteredOrders.filter((order) => order.buyer.toLowerCase() === buyer.toLowerCase());
    }
    if (status) {
      filteredOrders = filteredOrders.filter((order) => order.status === status);
    }

    filteredOrders.sort((a, b) => b.createdAt - a.createdAt);

    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error('Error fetching query orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch query orders' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/queries
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const blocked = rateLimitGuard(request);
  if (blocked) return blocked;

  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    // ---- Status transition for an existing order --------------------------
    if (body.orderId && body.action) {
      return handleStatusTransition(body.orderId as string, body.action as string);
    }

    // ---- Create a new order -----------------------------------------------

    const requiredFields = ['datasetId', 'queryType', 'parameters', 'buyer'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    if (!Object.values(QueryType).includes(body.queryType as QueryType)) {
      return NextResponse.json(
        { success: false, error: `Invalid query type: ${body.queryType}. Must be one of: ${Object.values(QueryType).join(', ')}` },
        { status: 400 },
      );
    }

    if (typeof body.parameters !== 'object' || body.parameters === null || Array.isArray(body.parameters)) {
      return NextResponse.json(
        { success: false, error: 'parameters must be an object' },
        { status: 400 },
      );
    }

    const dataset = getDatasetById(body.datasetId as string);
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: 'Dataset not found' },
        { status: 404 },
      );
    }

    if (!dataset.allowedQueries.includes(body.queryType as QueryType)) {
      return NextResponse.json(
        { success: false, error: `Query type "${body.queryType}" is not allowed for this dataset` },
        { status: 400 },
      );
    }

    // Check that dataset has data rows
    const dataRows = getDatasetData(body.datasetId as string);
    if (!dataRows || dataRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'This dataset has no uploaded data. The seller must upload a CSV or JSON file.' },
        { status: 400 },
      );
    }

    // Calculate price
    let basePrice = parseFloat(dataset.price);
    switch (body.queryType as QueryType) {
      case QueryType.AGGREGATION:
        break;
      case QueryType.ANALYTICS:
        basePrice *= 1.6;
        break;
      case QueryType.ML_TRAINING:
        basePrice *= 3;
        break;
      case QueryType.COHORT:
        basePrice *= 2.4;
        break;
      case QueryType.CORRELATION:
        basePrice *= 2;
        break;
      default:
        basePrice *= 2;
    }

    const price = (body.price as string) || basePrice.toFixed(4);

    // Accept on-chain payment info from the buyer's wallet transaction
    const txHash = (body.txHash as string) || '';
    const onChainOrderId = (body.onChainOrderId as string) || '';

    // Create new query order (with on-chain escrow reference)
    const newOrder = addQuery({
      datasetId: body.datasetId as string,
      buyer: body.buyer as string,
      queryType: body.queryType as QueryType,
      parameters: body.parameters as Record<string, unknown>,
      price,
      txHash,
      onChainId: onChainOrderId,
    });

    // Execute the computation
    executeComputation(newOrder.id);

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating query order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create query order' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function handleStatusTransition(orderId: string, action: string) {
  const order = getQueryById(orderId);
  if (!order) {
    return NextResponse.json(
      { success: false, error: 'Query order not found' },
      { status: 404 },
    );
  }

  const transitions: Record<string, { from: OrderStatus[]; to: OrderStatus }> = {
    execute:  { from: [OrderStatus.PENDING],    to: OrderStatus.EXECUTING },
    complete: { from: [OrderStatus.EXECUTING],   to: OrderStatus.COMPLETED },
    fail:     { from: [OrderStatus.PENDING, OrderStatus.EXECUTING], to: OrderStatus.FAILED },
    refund:   { from: [OrderStatus.FAILED],      to: OrderStatus.REFUNDED },
  };

  const transition = transitions[action];
  if (!transition) {
    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}. Must be one of: execute, complete, fail, refund` },
      { status: 400 },
    );
  }

  if (!transition.from.includes(order.status)) {
    return NextResponse.json(
      { success: false, error: `Cannot ${action} an order with status "${order.status}"` },
      { status: 409 },
    );
  }

  const extra: Partial<Pick<QueryOrder, 'executedAt' | 'resultCid' | 'attestation'>> = {};
  if (transition.to === OrderStatus.COMPLETED) {
    extra.executedAt = Date.now();
  }

  const updated = updateQueryStatus(orderId, transition.to, extra);
  return NextResponse.json({ success: true, data: updated });
}

/**
 * Execute computation on real uploaded data.
 * Flow: PENDING → EXECUTING → run computation → store result → COMPLETED
 */
function executeComputation(orderId: string) {
  setTimeout(async () => {
    try {
      const order = getQueryById(orderId);
      if (!order || order.status !== OrderStatus.PENDING) return;

      // Mark as executing
      updateQueryStatus(orderId, OrderStatus.EXECUTING);

      // Run actual computation
      const result = computeQueryResult(order);

      // Generate real hashes
      const resultJson = JSON.stringify(result);
      const queryHash = crypto.createHash('sha256').update(JSON.stringify(order.parameters)).digest('hex');
      const resultHash = crypto.createHash('sha256').update(resultJson).digest('hex');

      // Upload result to IPFS if Pinata is configured
      let resultCid = '';
      if (isLighthouseConfigured()) {
        try {
          const uploadResult = await uploadJsonToLighthouse(
            result,
            `query-result-${orderId}.json`,
          );
          resultCid = uploadResult.cid;
        } catch (err) {
          console.warn('Failed to upload result to IPFS:', (err as Error).message);
        }
      }

      const attestation = {
        datasetId: order.datasetId,
        queryHash: `0x${queryHash}`,
        resultHash: `0x${resultHash}`,
        workerId: `worker-${process.pid}`,
        timestamp: Date.now(),
        signature: `0x${crypto.createHash('sha256').update(`${orderId}-${resultHash}-${Date.now()}`).digest('hex')}`,
      };

      // Complete the order in the database
      updateQueryStatusWithResult(orderId, OrderStatus.COMPLETED, result, {
        executedAt: Date.now(),
        resultCid,
        attestation,
      });

      // Complete on-chain if contracts are configured and order has an on-chain ID
      if (areContractsConfigured() && resultCid) {
        const latestOrder = getQueryById(orderId) as (QueryOrder & { onChainId?: string }) | undefined;
        const chainOrderId = latestOrder?.onChainId;
        if (chainOrderId) {
          try {
            await completeOrderOnChain(chainOrderId, resultCid, resultHash);
          } catch (err) {
            console.warn('On-chain completion failed:', (err as Error).message);
          }
        }
      }
    } catch (e) {
      console.error('Error in query execution:', e);
      try {
        updateQueryStatus(orderId, OrderStatus.FAILED);
      } catch { /* ignore */ }
    }
  }, 1000);
}

/**
 * Compute real results from uploaded dataset data
 */
function computeQueryResult(order: QueryOrder): Record<string, unknown> {
  const dataset = getDatasetById(order.datasetId);
  const datasetTitle = dataset?.title || 'Unknown Dataset';
  const data = getDatasetData(order.datasetId);

  if (!data || data.length === 0) {
    return {
      query: { type: order.queryType, parameters: order.parameters },
      dataset: datasetTitle,
      executedAt: new Date().toISOString(),
      error: 'No data available for this dataset. The seller must upload data first.',
      rowsProcessed: 0,
      executionTimeMs: 50,
    };
  }

  const baseResult = {
    dataset: datasetTitle,
    executedAt: new Date().toISOString(),
  };

  switch (order.queryType) {
    case QueryType.AGGREGATION:
      return { ...baseResult, ...computeAggregation(data, order.parameters) };
    case QueryType.ML_TRAINING:
      return { ...baseResult, ...computeMLTraining(data, order.parameters) };
    case QueryType.ANALYTICS:
      return { ...baseResult, ...computeAnalytics(data, order.parameters) };
    case QueryType.COHORT:
      return { ...baseResult, ...computeCohort(data, order.parameters) };
    case QueryType.CORRELATION:
      return { ...baseResult, ...computeCorrelation(data, order.parameters) };
    default:
      return {
        ...baseResult,
        query: { type: order.queryType, parameters: order.parameters },
        message: 'Query executed successfully',
        rowsProcessed: data.length,
        executionTimeMs: 1000,
      };
  }
}
