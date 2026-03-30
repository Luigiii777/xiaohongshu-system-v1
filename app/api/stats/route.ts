import { NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/db';
import { MonthlyStats, VehicleModelStats, TopNote, OverallStats } from '@/lib/types';

export async function GET() {
  try {
    // 1. 总体统计
    const { data: totalData, error: totalError } = await supabase
      .from(TABLES.POSTS)
      .select('id, vehicle_model, uploaded_at');

    if (totalError) {
      throw totalError;
    }

    const totalPosts = totalData?.length || 0;
    const uniqueVehicleModels = new Set(totalData?.map(d => d.vehicle_model) || []).size;

    // 计算本月和上月数据
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthPosts = totalData?.filter(d => d.uploaded_at && new Date(d.uploaded_at) >= thisMonthStart).length || 0;
    const lastMonthPosts = totalData?.filter(d => d.uploaded_at && new Date(d.uploaded_at) >= lastMonthStart && new Date(d.uploaded_at) <= lastMonthEnd).length || 0;

    const overallStats: OverallStats = {
      totalPosts,
      totalVehicleModels: uniqueVehicleModels,
      thisMonthPosts,
      lastMonthPosts,
    };

    // 2. 月度统计 (按发布时间)
    const { data: monthlyData, error: monthlyError } = await supabase
      .from(TABLES.POSTS)
      .select('published_at')
      .not('published_at', 'is', null);

    if (monthlyError) {
      throw monthlyError;
    }

    const monthlyMap = new Map<string, number>();
    monthlyData?.forEach(item => {
      if (item.published_at) {
        const date = new Date(item.published_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
      }
    });

    const monthlyStats: MonthlyStats[] = Array.from(monthlyMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // 3. 车型分布统计
    const { data: vehicleData, error: vehicleError } = await supabase
      .from(TABLES.POSTS)
      .select('vehicle_model');

    if (vehicleError) {
      throw vehicleError;
    }

    const vehicleMap = new Map<string, number>();
    vehicleData?.forEach(item => {
      vehicleMap.set(item.vehicle_model, (vehicleMap.get(item.vehicle_model) || 0) + 1);
    });

    const vehicleModelStats: VehicleModelStats[] = Array.from(vehicleMap.entries())
      .map(([vehicleModel, count]) => ({ vehicleModel, count }))
      .sort((a, b) => b.count - a.count);

    // 4. TOP 20 点赞笔记
    const { data: topNotesData, error: topNotesError } = await supabase
      .from(TABLES.POSTS)
      .select('*')
      .order('likes_count', { ascending: false })
      .limit(20);

    if (topNotesError) {
      throw topNotesError;
    }

    const topNotes: TopNote[] = (topNotesData || []).map(note => ({
      noteId: note.note_id,
      noteTitle: note.note_title || '',
      vehicleModel: note.vehicle_model,
      likesCount: note.likes_count || 0,
      favoritesCount: note.favorites_count || 0,
      commentsCount: note.comments_count || 0,
      sharesCount: note.shares_count || 0,
      publishedAt: note.published_at || '',
      authorNickname: note.author_nickname || '',
    }));

    return NextResponse.json({
      success: true,
      data: {
        overall: overallStats,
        monthly: monthlyStats,
        vehicleModels: vehicleModelStats,
        topNotes,
      },
    });
  } catch (error) {
    console.error('统计查询错误:', error);
    return NextResponse.json(
      { error: '统计查询失败' },
      { status: 500 }
    );
  }
}