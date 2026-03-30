-- 小红书内容数据库表结构

-- 创建主表
CREATE TABLE IF NOT EXISTS xiaohongshu_posts (
  id SERIAL PRIMARY KEY,
  vehicle_model VARCHAR(50) NOT NULL,           -- 车型
  note_id VARCHAR(64) UNIQUE NOT NULL,          -- 笔记ID (唯一)
  note_url TEXT,                                -- 笔记链接
  note_type VARCHAR(20),                        -- 笔记类型 (图文/视频)
  note_title TEXT,                              -- 笔记标题
  note_content TEXT,                            -- 笔记内容
  likes_count INTEGER DEFAULT 0,                -- 点赞量
  favorites_count INTEGER DEFAULT 0,            -- 收藏量
  comments_count INTEGER DEFAULT 0,             -- 评论量
  shares_count INTEGER DEFAULT 0,               -- 分享量
  published_at TIMESTAMP,                       -- 发布时间
  updated_at TIMESTAMP,                         -- 更新时间
  ip_address VARCHAR(50),                       -- IP地址
  author_id VARCHAR(64),                        -- 博主ID
  author_url TEXT,                              -- 博主链接
  author_nickname VARCHAR(100),                 -- 博主昵称
  image_count INTEGER DEFAULT 0,                -- 图片数量
  cover_url TEXT,                               -- 笔记封面链接
  images_url TEXT,                              -- 笔记图片链接
  video_duration VARCHAR(20),                   -- 笔记视频时长
  video_url TEXT,                               -- 笔记视频链接
  uploaded_at TIMESTAMP DEFAULT NOW(),          -- 上传时间
  uploaded_by VARCHAR(100) DEFAULT 'system'     -- 上传者
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_vehicle_model ON xiaohongshu_posts(vehicle_model);
CREATE INDEX IF NOT EXISTS idx_published_at ON xiaohongshu_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_count ON xiaohongshu_posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_count ON xiaohongshu_posts(favorites_count DESC);
CREATE INDEX IF NOT EXISTS idx_comments_count ON xiaohongshu_posts(comments_count DESC);
CREATE INDEX IF NOT EXISTS idx_shares_count ON xiaohongshu_posts(shares_count DESC);
CREATE INDEX IF NOT EXISTS idx_note_type ON xiaohongshu_posts(note_type);
CREATE INDEX IF NOT EXISTS idx_author_nickname ON xiaohongshu_posts(author_nickname);
CREATE INDEX IF NOT EXISTS idx_ip_address ON xiaohongshu_posts(ip_address);

-- 注释
COMMENT ON TABLE xiaohongshu_posts IS '小红书帖子内容表';
COMMENT ON COLUMN xiaohongshu_posts.vehicle_model IS '车型名称';
COMMENT ON COLUMN xiaohongshu_posts.note_id IS '小红书笔记唯一ID';
COMMENT ON COLUMN xiaohongshu_posts.note_type IS '笔记类型：图文或视频';
COMMENT ON COLUMN xiaohongshu_posts.likes_count IS '点赞数量';
COMMENT ON COLUMN xiaohongshu_posts.published_at IS '笔记发布时间';
COMMENT ON COLUMN xiaohongshu_posts.uploaded_at IS '数据上传到系统的时间';