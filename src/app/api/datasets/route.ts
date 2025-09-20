import { NextRequest, NextResponse } from 'next/server';
import { Dataset, QueryType } from '@/lib/contracts';

// Mock data store (in production, this would be a database)
const mockDatasets: Dataset[] = [
  {
    id: '1',
    cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    owner: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
    title: 'Financial Transactions Dataset',
    description: 'Anonymized financial transaction data with demographic insights. Perfect for fraud detection and spending pattern analysis.',
    category: 'Finance',
    schemaHash: '0x1234567890abcdef',
    size: 2469606195, // ~2.3 GB
    price: '0.05',
    allowedQueries: [QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.ML_TRAINING],
    pdpParams: {
      challengeInterval: 3600, // 1 hour
      proofTimeout: 300, // 5 minutes
      slashingAmount: '0.1',
      requiredProofs: 24
    },
    verified: true,
    createdAt: Date.now() - 172800000, // 2 days ago
    lastProofAt: Date.now() - 3600000, // 1 hour ago
    totalQueries: 1247,
    revenue: '62.35'
  },
  {
    id: '2',
    cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    owner: '0x8ba1f109551bD432803012645Hac136c1c5e0',
    title: 'Healthcare Research Data',
    description: 'De-identified patient data for medical research and drug discovery. Includes lab results, treatment outcomes, and demographic data.',
    category: 'Healthcare',
    schemaHash: '0xabcdef1234567890',
    size: 6120000000, // ~5.7 GB
    price: '0.12',
    allowedQueries: [QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.ML_TRAINING, QueryType.CORRELATION],
    pdpParams: {
      challengeInterval: 1800, // 30 minutes
      proofTimeout: 300,
      slashingAmount: '0.2',
      requiredProofs: 48
    },
    verified: true,
    createdAt: Date.now() - 604800000, // 1 week ago
    lastProofAt: Date.now() - 1800000, // 30 minutes ago
    totalQueries: 892,
    revenue: '107.04'
  },
  {
    id: '3',
    cid: 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
    owner: '0x9f4f2726179a224501d762422c946590d91',
    title: 'E-commerce Behavior Analytics',
    description: 'Customer behavior patterns, purchase history, and recommendation engine training data from major e-commerce platforms.',
    category: 'E-commerce',
    schemaHash: '0x567890abcdef1234',
    size: 1932735284, // ~1.8 GB
    price: '0.08',
    allowedQueries: [QueryType.AGGREGATION, QueryType.ANALYTICS, QueryType.COHORT],
    pdpParams: {
      challengeInterval: 7200, // 2 hours
      proofTimeout: 300,
      slashingAmount: '0.15',
      requiredProofs: 12
    },
    verified: false,
    createdAt: Date.now() - 259200000, // 3 days ago
    lastProofAt: Date.now() - 7200000, // 2 hours ago
    totalQueries: 2156,
    revenue: '172.48'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredDatasets = [...mockDatasets];

    // Apply filters
    if (category && category !== 'All') {
      filteredDatasets = filteredDatasets.filter(dataset => 
        dataset.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDatasets = filteredDatasets.filter(dataset =>
        dataset.title.toLowerCase().includes(searchLower) ||
        dataset.description.toLowerCase().includes(searchLower) ||
        dataset.category.toLowerCase().includes(searchLower)
      );
    }

    if (verified === 'true') {
      filteredDatasets = filteredDatasets.filter(dataset => dataset.verified);
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
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch datasets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'cid', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new dataset
    const newDataset: Dataset = {
      id: (mockDatasets.length + 1).toString(),
      cid: body.cid,
      owner: body.owner || '0x0000000000000000000000000000000000000000',
      title: body.title,
      description: body.description,
      category: body.category,
      schemaHash: body.schemaHash || '0x0000000000000000',
      size: body.size || 0,
      price: body.price,
      allowedQueries: body.allowedQueries || [QueryType.AGGREGATION],
      pdpParams: body.pdpParams || {
        challengeInterval: 3600,
        proofTimeout: 300,
        slashingAmount: '0.1',
        requiredProofs: 24
      },
      verified: false,
      createdAt: Date.now(),
      lastProofAt: Date.now(),
      totalQueries: 0,
      revenue: '0'
    };

    // In production, this would save to database and register with smart contract
    mockDatasets.push(newDataset);

    return NextResponse.json({
      success: true,
      data: newDataset
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating dataset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create dataset' },
      { status: 500 }
    );
  }
}
