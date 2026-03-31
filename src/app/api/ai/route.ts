import { NextRequest, NextResponse } from 'next/server';
import { isAIConfigured, generateInsights, naturalLanguageToQuery } from '@/lib/ai-service';
import { getQueryById, getDatasetById } from '@/lib/store';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// ---------------------------------------------------------------------------
// POST /api/ai
// Actions: "insights" | "nl-query"
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests.' },
      { status: 429 },
    );
  }

  if (!isAIConfigured()) {
    return NextResponse.json(
      { success: false, error: 'AI service is not configured. Set AI_API_URL in .env.' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const action = body.action as string;

  // ---- insights: interpret a completed query's results --------------------
  if (action === 'insights') {
    const orderId = body.orderId as string;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId' },
        { status: 400 },
      );
    }

    const order = getQueryById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Query order not found' },
        { status: 404 },
      );
    }
    if (!order.result) {
      return NextResponse.json(
        { success: false, error: 'Query has no results yet' },
        { status: 400 },
      );
    }

    const dataset = getDatasetById(order.datasetId);
    const title = dataset?.title || 'Unknown Dataset';

    try {
      const insights = await generateInsights(
        order.queryType,
        order.parameters,
        order.result,
        title,
      );
      return NextResponse.json({ success: true, data: { insights } });
    } catch (err) {
      console.error('AI insights error:', err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 },
      );
    }
  }

  // ---- nl-query: natural language → structured query ---------------------
  if (action === 'nl-query') {
    const question = body.question as string;
    const datasetId = body.datasetId as string;
    if (!question || !datasetId) {
      return NextResponse.json(
        { success: false, error: 'Missing question or datasetId' },
        { status: 400 },
      );
    }

    const dataset = getDatasetById(datasetId);
    if (!dataset) {
      return NextResponse.json(
        { success: false, error: 'Dataset not found' },
        { status: 404 },
      );
    }

    // Get column names from stored data
    const { getDataRows } = await import('@/lib/store');
    const rows = getDataRows(datasetId);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    try {
      const structured = await naturalLanguageToQuery(
        question,
        columns,
        dataset.allowedQueries,
      );
      return NextResponse.json({ success: true, data: structured });
    } catch (err) {
      console.error('AI nl-query error:', err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { success: false, error: `Unknown action: ${action}. Use "insights" or "nl-query".` },
    { status: 400 },
  );
}
