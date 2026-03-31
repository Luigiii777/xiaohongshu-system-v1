import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 获取筛选参数
    const sortBy = (searchParams.get('sortBy') as QueryFilters['sortBy']) || 'publishedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const filters: QueryFilters = {
      vehicleModel: searchParams.get('vehicleModel') || undefined,
      noteType: searchParams.get('noteType') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      ipAddress: searchParams.get('ipAddress') || undefined,
      authorNickname: searchParams.get('authorNickname') || undefined,
      topN: searchParams.get('topN') ? parseInt(searchParams.get('topN') || '0', 10) : undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '20', 10),
    };

    // 构建查询
    let query = supabase.from(TABLES.POSTS).select('*', { count: 'exact' });

    // 应用筛选条件
    if (filters.vehicleModel && filters.vehicleModel !== '全部') {
      query = query.eq('vehicle_model', filters.vehicleModel);
    }

    if (filters.noteType && filters.noteType !== '全部') {
      query = query.eq('note_type', filters.noteType);
    }

    if (filters.startDate) {
      query = query.gte('published_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('published_at', filters.endDate);
    }

    if (filters.ipAddress && filters.ipAddress !== '全部') {
      query = query.eq('ip_address', filters.ipAddress);
    }

    if (filters.authorNickname) {
      query = query.ilike('author_nickname', `%${filters.authorNickname}%`);
    }

    // 确定排序字段
    const sortFieldMap: Record<NonNullable<QueryFilters['sortBy']>, string> = {
      likes: 'likes_count',
      favorites: 'favorites_count',
      comments: 'comments_count',
      shares: 'shares_count',
      publishedAt: 'published_at',
    };

    const sortField = sortFieldMap[sortBy!];
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // 应用TOP N限制
    const limit = filters.topN || filters.pageSize;
    const offset = (filters.page - 1) * filters.pageSize;

    query = query.range(offset, offset + limit - 1);

    // 执行查询
    const { data, error, count } = await query;

    if (error) {
      console.error('查询错误:', error);
      return NextResponse.json(
        { error: '查询失败: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.ceil((count || 0) / filters.pageSize),
    });
  } catch (error) {
    console.error('查询处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}