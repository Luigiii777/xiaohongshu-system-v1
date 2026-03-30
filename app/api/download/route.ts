import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/db';
import { QueryFilters } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const sortBy = searchParams.get('sortBy') as QueryFilters['sortBy'];
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc';

    // 获取筛选参数
    const filters: QueryFilters = {
      vehicleModel: searchParams.get('vehicleModel') || undefined,
      noteType: searchParams.get('noteType') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      ipAddress: searchParams.get('ipAddress') || undefined,
      authorNickname: searchParams.get('authorNickname') || undefined,
      sortBy: sortBy || 'publishedAt',
      sortOrder: sortOrder || 'desc',
      topN: searchParams.get('topN') ? parseInt(searchParams.get('topN') || '0', 10) : undefined,
    };

    // 构建查询
    let query = supabase.from(TABLES.POSTS).select('*');

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
    const sortFieldMap = {
      likes: 'likes_count',
      favorites: 'favorites_count',
      comments: 'comments_count',
      shares: 'shares_count',
      publishedAt: 'published_at',
    };

    const sortField = sortFieldMap[filters.sortBy];
    query = query.order(sortField, { ascending: filters.sortOrder === 'asc' });

    // 应用TOP N限制（下载时默认限制5000条）
    const limit = filters.topN || 5000;
    query = query.limit(limit);

    // 执行查询
    const { data, error } = await query;

    if (error) {
      console.error('下载查询错误:', error);
      return NextResponse.json(
        { error: '查询失败: ' + error.message },
        { status: 500 }
      );
    }

    // 转换为原始格式
    const exportData = (data || []).map(item => ({
      车型: item.vehicle_model,
      笔记ID: item.note_id,
      笔记链接: item.note_url,
      笔记类型: item.note_type,
      笔记标题: item.note_title,
      笔记内容: item.note_content,
      点赞量: item.likes_count,
      收藏量: item.favorites_count,
      评论量: item.comments_count,
      分享量: item.shares_count,
      发布时间: item.published_at,
      更新时间: item.updated_at,
      IP地址: item.ip_address,
      博主ID: item.author_id,
      博主链接: item.author_url,
      博主昵称: item.author_nickname,
      图片数量: item.image_count,
      笔记封面链接: item.cover_url,
      笔记图片链接: item.images_url,
      笔记视频时长: item.video_duration,
      笔记视频链接: item.video_url,
      上传时间: item.uploaded_at,
      上传者: item.uploaded_by,
    }));

    // 生成文件名
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `小红书数据_${timestamp}.json`;

    // 返回JSON文件
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error('下载处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}