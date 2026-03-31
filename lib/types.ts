// TypeScript 类型定义

export interface XiaohongshuPost {
  id?: number;
  vehicle_model: string;
  note_id: string;
  note_url?: string;
  note_type?: string;
  note_title?: string;
  note_content?: string;
  likes_count?: number;
  favorites_count?: number;
  comments_count?: number;
  shares_count?: number;
  published_at?: string;
  updated_at?: string;
  ip_address?: string;
  author_id?: string;
  author_url?: string;
  author_nickname?: string;
  image_count?: number;
  cover_url?: string;
  images_url?: string;
  video_duration?: string;
  video_url?: string;
  uploaded_at?: string;
  uploaded_by?: string;
}

// JSON文件格式
export interface UploadedFileData {
  车型: string;
  总Sheet数: number;
  内容: {
    [sheetName: string]: {
      数据条数: number;
      数据: Array<{
        笔记ID: string;
        笔记链接?: string;
        笔记类型?: string;
        笔记标题?: string;
        笔记内容?: string;
        点赞量?: number;
        收藏量?: number;
        评论量?: number;
        分享量?: number;
        发布时间?: string;
        更新时间?: string;
        IP地址?: string;
        博主ID?: string;
        博主链接?: string;
        博主昵称?: string;
        图片数量?: number;
        笔记封面链接?: string;
        笔记图片链接?: string;
        笔记视频时长?: string;
        笔记视频链接?: string;
      }>;
    };
  };
}

// 查询筛选条件
export interface QueryFilters {
  vehicleModel?: string;
  noteType?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
  authorNickname?: string;
  sortBy?: 'likes' | 'favorites' | 'comments' | 'shares' | 'publishedAt';
  sortOrder?: 'asc' | 'desc';
  topN?: number;
  page?: number;
  pageSize?: number;
}

// 统计数据
export interface MonthlyStats {
  month: string;
  count: number;
}

export interface VehicleModelStats {
  vehicleModel: string;
  count: number;
}

export interface TopNote {
  note_id: string;
  note_title: string;
  vehicle_model: string;
  likes_count: number;
  favorites_count: number;
  comments_count: number;
  shares_count: number;
  published_at: string;
  author_nickname: string;
}

export interface OverallStats {
  totalPosts: number;
  totalVehicleModels: number;
  thisMonthPosts: number;
  lastMonthPosts: number;
}