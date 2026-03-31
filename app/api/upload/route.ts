import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/db';
import { UploadedFileData, XiaohongshuPost } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const vehicleModel = formData.get('vehicleModel') as string;

    if (!file) {
      return NextResponse.json(
        { error: '未找到上传的文件' },
        { status: 400 }
      );
    }

    if (!vehicleModel) {
      return NextResponse.json(
        { error: '未指定车型' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const text = await file.text();
    let jsonData: UploadedFileData;

    try {
      jsonData = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        { error: 'JSON文件格式错误' },
        { status: 400 }
      );
    }

    // 提取所有数据条目
    const postsToInsert: XiaohongshuPost[] = [];

    // 遍历所有Sheet
    for (const sheetName in jsonData.内容) {
      const sheetData = jsonData.内容[sheetName];

      if (sheetData && sheetData.数据) {
        for (const item of sheetData.数据) {
          postsToInsert.push({
            vehicle_model: vehicleModel,
            note_id: item.笔记ID,
            note_url: item.笔记链接,
            note_type: item.笔记类型,
            note_title: item.笔记标题,
            note_content: item.笔记内容,
            likes_count: item.点赞量 || 0,
            favorites_count: item.收藏量 || 0,
            comments_count: item.评论量 || 0,
            shares_count: item.分享量 || 0,
            published_at: item.发布时间,
            updated_at: item.更新时间,
            ip_address: item.IP地址,
            author_id: item.博主ID,
            author_url: item.博主链接,
            author_nickname: item.博主昵称,
            image_count: item.图片数量 || 0,
            cover_url: item.笔记封面链接,
            images_url: item.笔记图片链接,
            video_duration: item.笔记视频时长,
            video_url: item.笔记视频链接,
            uploaded_at: new Date().toISOString(),
            uploaded_by: 'system',
          });
        }
      }
    }

    if (postsToInsert.length === 0) {
      return NextResponse.json(
        { error: '文件中没有有效数据' },
        { status: 400 }
      );
    }

    // 批量插入到数据库
    // Supabase 会自动处理唯一性约束冲突（note_id已存在时跳过）
    const { data, error } = await supabase
      .from(TABLES.POSTS)
      .upsert(postsToInsert, {
        onConflict: 'note_id',
        ignoreDuplicates: false, // 保留已存在的记录
      })
      .select();

    if (error) {
      console.error('数据库插入错误:', error);
      return NextResponse.json(
        { error: '数据库插入失败: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `成功上传 ${postsToInsert.length} 条数据`,
      total: postsToInsert.length,
      inserted: data?.length || 0,
    });
  } catch (error) {
    console.error('上传处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}