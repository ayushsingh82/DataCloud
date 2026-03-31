import { NextRequest, NextResponse } from 'next/server';
import { QueryType } from '@/lib/contracts';
import {
  getDatasets,
  getDatasetById,
  addDataset,
  deleteDataset,
  updateDataset,
  insertDataRows,
} from '@/lib/store';
import { uploadToLighthouse, isLighthouseConfigured } from '@/lib/filecoin-service';
import { parseDataFile, clearDataCache } from '@/lib/dataset-data';
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
// GET /api/datasets
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const blocked = rateLimitGuard(request);
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
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

    if (id) {
      const dataset = getDatasetById(id);
      if (!dataset) {
        return NextResponse.json(
          { success: false, error: 'Dataset not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: dataset });
    }

    let filteredDatasets = getDatasets();

    if (category && category !== 'All') {
      filteredDatasets = filteredDatasets.filter(
        (dataset) => dataset.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDatasets = filteredDatasets.filter(
        (dataset) =>
          dataset.title.toLowerCase().includes(searchLower) ||
          dataset.description.toLowerCase().includes(searchLower) ||
          dataset.category.toLowerCase().includes(searchLower),
      );
    }

    if (verified === 'true') {
      filteredDatasets = filteredDatasets.filter((dataset) => dataset.verified);
    } else if (verified === 'false') {
      filteredDatasets = filteredDatasets.filter((dataset) => !dataset.verified);
    }

    const total = filteredDatasets.length;
    const paginatedDatasets = filteredDatasets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedDatasets,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
      integration: {
        lighthouse: isLighthouseConfigured(),
        contracts: !!(process.env.DATASET_REGISTRY_ADDRESS && process.env.QUERY_MARKET_ADDRESS),
      },
    });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch datasets' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/datasets
// Accepts multipart/form-data with a file upload, or JSON for metadata-only.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const blocked = rateLimitGuard(request);
  if (blocked) return blocked;

  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      return handleFileUpload(request);
    }
    return handleJsonCreate(request);
  } catch (error) {
    console.error('Error creating dataset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create dataset' },
      { status: 500 },
    );
  }
}

/**
 * Handle file upload: parse CSV/JSON, upload to Pinata IPFS, register on-chain
 */
async function handleFileUpload(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const price = formData.get('price') as string;
  const owner = formData.get('owner') as string;
  const allowedQueriesRaw = formData.get('allowedQueries') as string;

  // Validate required fields
  if (!file) {
    return NextResponse.json(
      { success: false, error: 'File is required. Upload a CSV or JSON dataset file.' },
      { status: 400 },
    );
  }
  if (!title || title.trim().length < 3) {
    return NextResponse.json(
      { success: false, error: 'Title must be at least 3 characters' },
      { status: 400 },
    );
  }
  if (!description) {
    return NextResponse.json(
      { success: false, error: 'Description is required' },
      { status: 400 },
    );
  }
  if (!category) {
    return NextResponse.json(
      { success: false, error: 'Category is required' },
      { status: 400 },
    );
  }
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return NextResponse.json(
      { success: false, error: 'Price must be a positive number' },
      { status: 400 },
    );
  }

  const allowedQueries: QueryType[] = allowedQueriesRaw
    ? JSON.parse(allowedQueriesRaw)
    : [QueryType.AGGREGATION];

  // Validate file type
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.csv') && !fileName.endsWith('.json')) {
    return NextResponse.json(
      { success: false, error: 'Only CSV and JSON files are supported' },
      { status: 400 },
    );
  }

  // Read and parse the file
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileContent = fileBuffer.toString('utf-8');

  let dataRows: Record<string, string | number>[];
  try {
    dataRows = parseDataFile(fileContent, file.name);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Failed to parse file: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (dataRows.length === 0) {
    return NextResponse.json(
      { success: false, error: 'File contains no data rows' },
      { status: 400 },
    );
  }

  // Upload to IPFS via Pinata
  let cid = '';
  if (isLighthouseConfigured()) {
    try {
      const uploadResult = await uploadToLighthouse(fileBuffer, file.name);
      cid = uploadResult.cid;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: `Pinata upload failed: ${(err as Error).message}` },
        { status: 502 },
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: 'PINATA_JWT is not configured. Cannot upload files without Pinata.' },
      { status: 503 },
    );
  }

  // Extract column names from the parsed data
  const columns = Object.keys(dataRows[0] || {});

  // Store dataset metadata in SQLite
  const format = fileName.endsWith('.json') ? 'json' : 'csv';
  const newDataset = addDataset({
    cid,
    owner: owner || '0x0000000000000000000000000000000000000000',
    title: title.trim(),
    description: description.trim(),
    category,
    schemaHash: '',
    size: file.size,
    price,
    allowedQueries,
    pdpParams: {
      challengeInterval: 3600,
      proofTimeout: 300,
      slashingAmount: '0.1',
      requiredProofs: 24,
    },
    records: dataRows.length,
    format,
    columns,
  });

  // Store the actual data rows for query computation
  insertDataRows(Number(newDataset.id), dataRows);
  clearDataCache(newDataset.id);

  // On-chain info comes from the frontend (registered via connected wallet)
  const txHash = formData.get('txHash') as string || '';
  const onChainId = formData.get('onChainId') as string || '';
  if (txHash || onChainId) {
    updateDataset(newDataset.id, { txHash, onChainId } as never);
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        ...newDataset,
        records: dataRows.length,
        format,
        txHash,
        onChainId,
      },
      upload: {
        cid,
        lighthouse: true,
        onChain: !!txHash,
        txHash: txHash || undefined,
        onChainId: onChainId || undefined,
        rowsParsed: dataRows.length,
        columns: Object.keys(dataRows[0] || {}),
      },
    },
    { status: 201 },
  );
}

/**
 * Handle JSON body create (metadata only, no file — for backward compatibility)
 */
async function handleJsonCreate(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const requiredFields = ['title', 'description', 'category', 'price'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { success: false, error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }

  if (typeof body.title !== 'string' || body.title.trim().length < 3) {
    return NextResponse.json(
      { success: false, error: 'Title must be at least 3 characters' },
      { status: 400 },
    );
  }

  const priceNum = parseFloat(body.price as string);
  if (isNaN(priceNum) || priceNum <= 0) {
    return NextResponse.json(
      { success: false, error: 'Price must be a positive number' },
      { status: 400 },
    );
  }

  if (body.allowedQueries) {
    if (!Array.isArray(body.allowedQueries)) {
      return NextResponse.json(
        { success: false, error: 'allowedQueries must be an array' },
        { status: 400 },
      );
    }
    const validTypes = Object.values(QueryType) as string[];
    for (const qt of body.allowedQueries as string[]) {
      if (!validTypes.includes(qt)) {
        return NextResponse.json(
          { success: false, error: `Invalid query type: ${qt}` },
          { status: 400 },
        );
      }
    }
  }

  const newDataset = addDataset({
    cid: (body.cid as string) || '',
    owner: (body.owner as string) || '0x0000000000000000000000000000000000000000',
    title: (body.title as string).trim(),
    description: (body.description as string).trim(),
    category: body.category as string,
    schemaHash: (body.schemaHash as string) || '',
    size: (body.size as number) || 0,
    price: body.price as string,
    allowedQueries: (body.allowedQueries as QueryType[]) || [QueryType.AGGREGATION],
    pdpParams: (body.pdpParams as { challengeInterval: number; proofTimeout: number; slashingAmount: string; requiredProofs: number }) || {
      challengeInterval: 3600,
      proofTimeout: 300,
      slashingAmount: '0.1',
      requiredProofs: 24,
    },
  });

  return NextResponse.json(
    { success: true, data: newDataset },
    { status: 201 },
  );
}

// ---------------------------------------------------------------------------
// PATCH /api/datasets?id=<id> — update on-chain info
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  const blocked = rateLimitGuard(request);
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const dataset = getDatasetById(id);
    if (!dataset) {
      return NextResponse.json({ success: false, error: 'Dataset not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.txHash) updates.txHash = body.txHash;
    if (body.onChainId) updates.onChainId = body.onChainId;

    if (Object.keys(updates).length > 0) {
      updateDataset(id, updates as never);
    }

    return NextResponse.json({ success: true, data: { ...dataset, ...updates } });
  } catch (error) {
    console.error('Error updating dataset:', error);
    return NextResponse.json({ success: false, error: 'Failed to update dataset' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/datasets?id=<id>
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  const blocked = rateLimitGuard(request);
  if (blocked) return blocked;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required query param: id' },
        { status: 400 },
      );
    }

    const removed = deleteDataset(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Dataset not found' },
        { status: 404 },
      );
    }

    clearDataCache(id);

    return NextResponse.json({ success: true, message: 'Dataset deleted' });
  } catch (error) {
    console.error('Error deleting dataset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete dataset' },
      { status: 500 },
    );
  }
}
