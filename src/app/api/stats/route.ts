import { NextRequest, NextResponse } from 'next/server';
import {
  getDatasets,
  getQueries,
  getDatasetCount,
  getQueryCount,
  getVerifiedDatasetCount,
  getOrderCountByStatus,
  getTotalVolume,
  getTotalRevenue,
  getAveragePrice,
  getCategoryBreakdown,
  getActivityLog,
} from '@/lib/store';
import { areContractsConfigured } from '@/lib/contracts';
import { isLighthouseConfigured } from '@/lib/filecoin-service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// ---------------------------------------------------------------------------
// GET /api/stats
// Returns dashboard statistics computed from the SQLite store.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
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

  try {
    // ---- Aggregate numbers (computed from SQLite) --------------------------

    const totalDatasets = getDatasetCount();
    const totalQueries = getQueryCount();
    const verifiedDatasets = getVerifiedDatasetCount();
    const ordersByStatus = getOrderCountByStatus();
    const totalVolume = getTotalVolume();
    const totalRevenue = getTotalRevenue();
    const averagePrice = getAveragePrice();
    const categories = getCategoryBreakdown();

    // ---- Recent activity from the activity_log table -----------------------

    const activityRows = getActivityLog(20);

    // Also build a richer activity list by merging datasets and queries data
    // for backward compatibility with the previous stats format
    const datasets = getDatasets();
    const queries = getQueries();

    interface ActivityItem {
      type: 'dataset_created' | 'query_created' | 'query_completed';
      id: string;
      title: string;
      timestamp: number;
      details: string;
    }

    const activity: ActivityItem[] = [];

    for (const d of datasets) {
      activity.push({
        type: 'dataset_created',
        id: d.id,
        title: d.title,
        timestamp: d.createdAt,
        details: `New dataset listed in ${d.category} (${d.price} tFIL)`,
      });
    }

    for (const q of queries) {
      activity.push({
        type: 'query_created',
        id: q.id,
        title: `Query #${q.id}`,
        timestamp: q.createdAt,
        details: `${q.queryType} query on dataset #${q.datasetId} (${q.price} tFIL)`,
      });
      if (q.executedAt) {
        activity.push({
          type: 'query_completed',
          id: q.id,
          title: `Query #${q.id}`,
          timestamp: q.executedAt,
          details: `Query completed with result CID ${q.resultCid}`,
        });
      }
    }

    // Sort newest first, limit to 20
    activity.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivity = activity.slice(0, 20);

    // ---- Response ----------------------------------------------------------

    return NextResponse.json({
      success: true,
      data: {
        totalDatasets,
        totalQueries,
        verifiedDatasets,
        totalVolume: totalVolume.toFixed(4),
        totalRevenue: totalRevenue.toFixed(2),
        averagePrice: averagePrice.toFixed(4),
        ordersByStatus,
        categories,
        recentActivity,
        activityLog: activityRows,
        integration: {
          lighthouse: isLighthouseConfigured(),
          contracts: areContractsConfigured(),
        },
      },
    });
  } catch (error) {
    console.error('Error computing stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute stats' },
      { status: 500 },
    );
  }
}
