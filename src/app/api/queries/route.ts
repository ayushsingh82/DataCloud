import { NextRequest, NextResponse } from 'next/server';
import { QueryOrder, QueryType, OrderStatus } from '@/lib/contracts';
import {
  getQueries,
  getQueryById,
  addQuery,
  updateQueryStatus,
  getDatasetById,
} from '@/lib/store';

// ---------------------------------------------------------------------------
// GET /api/queries
// Supports query params: datasetId, buyer, status, id, limit, offset
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const datasetId = searchParams.get('datasetId');
    const buyer = searchParams.get('buyer');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single-order lookup by id
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

    // Apply filters
    if (datasetId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.datasetId === datasetId,
      );
    }

    if (buyer) {
      filteredOrders = filteredOrders.filter(
        (order) => order.buyer.toLowerCase() === buyer.toLowerCase(),
      );
    }

    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status,
      );
    }

    // Sort by creation time (newest first)
    filteredOrders.sort((a, b) => b.createdAt - a.createdAt);

    // Apply pagination
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
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
// Creates a new query order or transitions an existing order's status.
//
// Body for new order:  { datasetId, queryType, parameters, buyer, price? }
// Body for transition: { orderId, action: "execute" | "complete" | "fail" | "refund" }
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ---- Status transition for an existing order --------------------------
    if (body.orderId && body.action) {
      return handleStatusTransition(body.orderId, body.action);
    }

    // ---- Create a new order -----------------------------------------------

    // Validate required fields
    const requiredFields = ['datasetId', 'queryType', 'parameters', 'buyer'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate query type
    if (!Object.values(QueryType).includes(body.queryType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid query type' },
        { status: 400 },
      );
    }

    // Validate dataset exists
    const dataset = getDatasetById(body.datasetId);
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: 'Dataset not found' },
        { status: 404 },
      );
    }

    // Check the query type is allowed for this dataset
    if (!dataset.allowedQueries.includes(body.queryType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Query type "${body.queryType}" is not allowed for this dataset`,
        },
        { status: 400 },
      );
    }

    // Calculate price based on query type and dataset
    let basePrice = parseFloat(dataset.price);
    switch (body.queryType as QueryType) {
      case QueryType.AGGREGATION:
        // base price * 1
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

    const price = body.price || basePrice.toFixed(4);

    // Create new query order via the store
    const newOrder = addQuery({
      datasetId: body.datasetId,
      buyer: body.buyer,
      queryType: body.queryType,
      parameters: body.parameters,
      price,
    });

    // Simulate async execution (pending -> executing -> completed)
    simulateExecution(newOrder.id);

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

/** Handle explicit status transitions via POST { orderId, action }. */
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
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 },
    );
  }

  if (!transition.from.includes(order.status)) {
    return NextResponse.json(
      {
        success: false,
        error: `Cannot ${action} an order with status "${order.status}"`,
      },
      { status: 409 },
    );
  }

  const extra: Partial<Pick<QueryOrder, 'executedAt' | 'resultCid' | 'attestation'>> = {};
  if (transition.to === OrderStatus.COMPLETED) {
    extra.executedAt = Date.now();
    extra.resultCid = `QmResult${Date.now()}`;
    extra.attestation = {
      datasetId: order.datasetId,
      queryHash: `0xquery${Date.now()}`,
      resultHash: `0xresult${Date.now()}`,
      workerId: `worker-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
      timestamp: Date.now(),
      signature: `0xsig${Date.now()}`,
    };
  }

  const updated = updateQueryStatus(orderId, transition.to, extra);

  return NextResponse.json({ success: true, data: updated });
}

/**
 * Simulate asynchronous query execution.
 * Transitions: pending -> executing (after ~5 s) -> completed (after 30-90 s).
 */
function simulateExecution(orderId: string) {
  setTimeout(() => {
    const order = getQueryById(orderId);
    if (order && order.status === OrderStatus.PENDING) {
      updateQueryStatus(orderId, OrderStatus.EXECUTING);

      setTimeout(() => {
        const current = getQueryById(orderId);
        if (current && current.status === OrderStatus.EXECUTING) {
          updateQueryStatus(orderId, OrderStatus.COMPLETED, {
            executedAt: Date.now(),
            resultCid: `QmResult${Date.now()}`,
            attestation: {
              datasetId: current.datasetId,
              queryHash: `0xquery${Date.now()}`,
              resultHash: `0xresult${Date.now()}`,
              workerId: `worker-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
              timestamp: Date.now(),
              signature: `0xsig${Date.now()}`,
            },
          });
        }
      }, Math.random() * 60000 + 30000); // 30-90 seconds
    }
  }, 5000); // Start execution after 5 seconds
}
