// TypeScript 类型定义

export interface XiaohongshuPost {
  id?: number;
  vehicleModel: string;
  noteId: string;
  noteUrl?: string;
  noteType?: string;
  noteTitle?: string;
  noteContent?: string;
  likesCount?: number;
  favoritesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  publishedAt?: string;
  updatedAt?: string;
  ipAddress?: string;
  authorId?: string;
  authorUrl?: string;
  authorNickname?: string;
  imageCount?: number;
  coverUrl?: string;
  imagesUrl?: string;
  videoDuration?: string;
  videoUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
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
  noteId: string;
  noteTitle: string;
  vehicleModel: string;
  likesCount: number;
  favoritesCount: number;
  commentsCount: number;
  sharesCount: number;
  publishedAt: string;
  authorNickname: string;
}

export interface OverallStats {
  totalPosts: number;
  totalVehicleModels: number;
  thisMonthPosts: number;
  lastMonthPosts: number;
}