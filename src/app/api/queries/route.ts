import { NextRequest, NextResponse } from 'next/server';
import { QueryOrder, QueryType, OrderStatus } from '@/lib/contracts';

// Mock data store for query orders
const mockOrders: QueryOrder[] = [
  {
    id: '1',
    datasetId: '1',
    buyer: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    queryType: QueryType.AGGREGATION,
    parameters: {
      function: 'AVG',
      column: 'transaction_amount',
      groupBy: 'age_group'
    },
    price: '0.05',
    status: OrderStatus.COMPLETED,
    createdAt: Date.now() - 3600000, // 1 hour ago
    executedAt: Date.now() - 3300000, // 55 minutes ago
    resultCid: 'QmResult1234567890abcdef',
    attestation: {
      datasetId: '1',
      queryHash: '0xquery123',
      resultHash: '0xresult123',
      workerId: 'worker-001',
      timestamp: Date.now() - 3300000,
      signature: '0xsignature123'
    }
  },
  {
    id: '2',
    datasetId: '2',
    buyer: '0x742d35Cc6634C0532925a3b8D0c7b3a7D5d4c6f8',
    queryType: QueryType.ML_TRAINING,
    parameters: {
      modelType: 'logistic_regression',
      targetVariable: 'treatment_success',
      features: ['age', 'gender', 'medical_history', 'lab_values']
    },
    price: '0.18',
    status: OrderStatus.EXECUTING,
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: '3',
    datasetId: '3',
    buyer: '0x8ba1f109551bD432803012645Hac136c1c5e0',
    queryType: QueryType.COHORT,
    parameters: {
      cohortDefinition: 'first_purchase',
      timePeriod: 'monthly',
      metric: 'retention_rate'
    },
    price: '0.12',
    status: OrderStatus.PENDING,
    createdAt: Date.now() - 600000, // 10 minutes ago
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const datasetId = searchParams.get('datasetId');
    const buyer = searchParams.get('buyer');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredOrders = [...mockOrders];

    // Apply filters
    if (datasetId) {
      filteredOrders = filteredOrders.filter(order => order.datasetId === datasetId);
    }

    if (buyer) {
      filteredOrders = filteredOrders.filter(order => 
        order.buyer.toLowerCase() === buyer.toLowerCase()
      );
    }

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
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
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching query orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch query orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['datasetId', 'queryType', 'parameters', 'buyer'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate query type
    if (!Object.values(QueryType).includes(body.queryType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid query type' },
        { status: 400 }
      );
    }

    // Calculate price based on query type and dataset
    // In production, this would fetch the dataset and calculate actual price
    let basePrice = 0.05;
    switch (body.queryType) {
      case QueryType.AGGREGATION:
        basePrice = 0.03;
        break;
      case QueryType.ANALYTICS:
        basePrice = 0.08;
        break;
      case QueryType.ML_TRAINING:
        basePrice = 0.15;
        break;
      case QueryType.COHORT:
        basePrice = 0.12;
        break;
      default:
        basePrice = 0.10;
    }

    // Create new query order
    const newOrder: QueryOrder = {
      id: (mockOrders.length + 1).toString(),
      datasetId: body.datasetId,
      buyer: body.buyer,
      queryType: body.queryType,
      parameters: body.parameters,
      price: body.price || basePrice.toString(),
      status: OrderStatus.PENDING,
      createdAt: Date.now()
    };

    // In production, this would:
    // 1. Validate the buyer has sufficient funds
    // 2. Escrow the payment
    // 3. Submit to the query execution queue
    // 4. Register with smart contract
    mockOrders.push(newOrder);

    // Simulate query execution (in production, this would be handled by workers)
    setTimeout(() => {
      const order = mockOrders.find(o => o.id === newOrder.id);
      if (order) {
        order.status = OrderStatus.EXECUTING;
        
        // Simulate completion after some time
        setTimeout(() => {
          order.status = OrderStatus.COMPLETED;
          order.executedAt = Date.now();
          order.resultCid = `QmResult${Date.now()}`;
          order.attestation = {
            datasetId: order.datasetId,
            queryHash: `0xquery${Date.now()}`,
            resultHash: `0xresult${Date.now()}`,
            workerId: `worker-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
            timestamp: Date.now(),
            signature: `0xsig${Date.now()}`
          };
        }, Math.random() * 60000 + 30000); // 30-90 seconds
      }
    }, 5000); // Start execution after 5 seconds

    return NextResponse.json({
      success: true,
      data: newOrder
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating query order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create query order' },
      { status: 500 }
    );
  }
}
