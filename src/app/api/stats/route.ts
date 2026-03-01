import { NextResponse } from 'next/server';
import { OrderStatus } from '@/lib/contracts';
import { getDatasets, getQueries } from '@/lib/store';

// ---------------------------------------------------------------------------
// GET /api/stats
// Returns dashboard statistics computed from the in-memory store.
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const datasets = getDatasets();
    const queries = getQueries();

    // ---- Aggregate numbers -------------------------------------------------

    const totalDatasets = datasets.length;
    const totalQueries = queries.length;
    const verifiedDatasets = datasets.filter((d) => d.verified).length;

    // Total volume = sum of completed order prices
    const completedOrders = queries.filter(
      (q) => q.status === OrderStatus.COMPLETED,
    );
    const totalVolume = completedOrders.reduce(
      (sum, q) => sum + parseFloat(q.price),
      0,
    );

    // Average dataset price
    const averagePrice =
      datasets.length > 0
        ? datasets.reduce((sum, d) => sum + parseFloat(d.price), 0) /
          datasets.length
        : 0;

    // Total revenue across all datasets
    const totalRevenue = datasets.reduce(
      (sum, d) => sum + parseFloat(d.revenue),
      0,
    );

    // Orders by status
    const ordersByStatus = {
      pending: queries.filter((q) => q.status === OrderStatus.PENDING).length,
      executing: queries.filter((q) => q.status === OrderStatus.EXECUTING).length,
      completed: completedOrders.length,
      failed: queries.filter((q) => q.status === OrderStatus.FAILED).length,
      refunded: queries.filter((q) => q.status === OrderStatus.REFUNDED).length,
    };

    // ---- Recent activity ---------------------------------------------------
    // Merge datasets and queries into a single timeline, newest first.

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
        details: `New dataset listed in ${d.category} (${d.price} FIL)`,
      });
    }

    for (const q of queries) {
      activity.push({
        type: 'query_created',
        id: q.id,
        title: `Query #${q.id}`,
        timestamp: q.createdAt,
        details: `${q.queryType} query on dataset #${q.datasetId} (${q.price} FIL)`,
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

    // ---- Category breakdown ------------------------------------------------

    const categoryMap: Record<string, { count: number; totalQueries: number; revenue: number }> = {};
    for (const d of datasets) {
      if (!categoryMap[d.category]) {
        categoryMap[d.category] = { count: 0, totalQueries: 0, revenue: 0 };
      }
      categoryMap[d.category].count += 1;
      categoryMap[d.category].totalQueries += d.totalQueries;
      categoryMap[d.category].revenue += parseFloat(d.revenue);
    }

    const categories = Object.entries(categoryMap).map(([name, stats]) => ({
      name,
      ...stats,
      revenue: stats.revenue.toFixed(2),
    }));

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
