import { NextRequest, NextResponse } from 'next/server';
import { Dataset, QueryType } from '@/lib/contracts';
import {
  getDatasets,
  getDatasetById,
  addDataset,
  deleteDataset,
} from '@/lib/store';

// ---------------------------------------------------------------------------
// GET /api/datasets
// Supports query params: category, search, verified, id, limit, offset
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single-dataset lookup by id
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

    // Apply filters
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

    // Apply pagination
    const total = filteredDatasets.length;
    const paginatedDatasets = filteredDatasets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedDatasets,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
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
// Creates a new dataset in the store.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate title length
    if (typeof body.title !== 'string' || body.title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 3 characters' },
        { status: 400 },
      );
    }

    // Validate price is a positive number
    const priceNum = parseFloat(body.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number' },
        { status: 400 },
      );
    }

    // Validate allowedQueries if provided
    if (body.allowedQueries) {
      const validTypes = Object.values(QueryType) as string[];
      for (const qt of body.allowedQueries) {
        if (!validTypes.includes(qt)) {
          return NextResponse.json(
            { success: false, error: `Invalid query type: ${qt}` },
            { status: 400 },
          );
        }
      }
    }

    // Create new dataset via the store
    const newDataset: Dataset = addDataset({
      cid: body.cid, // optional -- store will generate if missing
      owner: body.owner || '0x0000000000000000000000000000000000000000',
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category,
      schemaHash: body.schemaHash || '0x0000000000000000',
      size: body.size || 0,
      price: body.price,
      allowedQueries: body.allowedQueries || [QueryType.AGGREGATION],
      pdpParams: body.pdpParams || {
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
  } catch (error) {
    console.error('Error creating dataset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create dataset' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/datasets?id=<id>
// Removes a dataset from the store.
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
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

    return NextResponse.json({ success: true, message: 'Dataset deleted' });
  } catch (error) {
    console.error('Error deleting dataset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete dataset' },
      { status: 500 },
    );
  }
}
