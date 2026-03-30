# 小红书车型内容管理系统

一个基于 Next.js 和 Supabase 构建的在线结构化数据存取系统，用于管理和分析小红书车型相关发帖内容。

## 功能特性

- ✅ **数据上传**: 支持 JSON 文件上传，自动解析和存储
- ✅ **数据查询**: 多维度筛选查询（车型、时间、类型、地区、博主、排序等）
- ✅ **数据下载**: 支持筛选后的 JSON 格式数据导出
- ✅ **统计分析**: 实时统计和可视化图表（月度趋势、车型分布、TOP榜单）
- ✅ **免费部署**: 基于 Vercel + Supabase，完全免费

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **图表**: Recharts
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel

## 本地开发

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd xiaohongshu-system
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 配置 Supabase 数据库

访问 https://supabase.com，创建新项目后：

1. 在 SQL Editor 中执行 [sql/schema.sql](sql/schema.sql) 创建数据库表
2. 复制项目的 URL 和 Anon Key 到 `.env.local`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 准备工作

1. 在 Supabase 创建项目并执行数据库初始化 SQL
2. 复制 Supabase 的 URL 和 Anon Key

### 2. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. 连接到 Vercel

1. 访问 https://vercel.com
2. 点击 "Add New" -> "Project"
3. 导入你的 GitHub 仓库
4. 在环境变量配置中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
5. 点击 "Deploy"

### 4. 部署完成

Deploy 完成后，你会获得一个在线访问地址，如：
```
https://xiaohongshu-system.vercel.app
```

## 使用说明

### 上传数据

1. 准备 JSON 格式的数据文件（参考 example 文件夹中的示例）
2. 点击 "上传数据" 标签
3. 选择车型
4. 选择 JSON 文件
5. 点击 "开始上传"

### 查询数据

1. 点击 "查询数据" 标签
2. 根据需求设置筛选条件：
   - 车型
   - 笔记类型（图文/视频）
   - 发布时间范围
   - IP地区
   - 博主昵称搜索
   - 排序方式（点赞/收藏/评论/分享/发布时间）
   - TOP N（显示前N条）
3. 点击 "查询数据"
4. 查看结果列表，支持分页

### 下载数据

1. 设置筛选条件后
2. 点击 "下载数据" 按钮
3. 自动下载 JSON 格式数据文件

### 统计分析

1. 点击 "统计分析" 标签
2. 查看实时统计图表：
   - 总体统计（总记录数、车型数量、本月新增等）
   - 月度发帖趋势图
   - 车型分布饼图
   - 各车型发帖量对比柱状图
   - TOP 20 点赞笔记榜

## 数据文件格式

JSON 文件格式示例：

```json
{
  "车型": "理想i8",
  "总Sheet数": 1,
  "内容": {
    "Sheet1": {
      "数据条数": 2,
      "数据": [
        {
          "笔记ID": "xxx",
          "笔记链接": "https://...",
          "笔记类型": "图文",
          "笔记标题": "标题...",
          "笔记内容": "内容...",
          "点赞量": 100,
          "收藏量": 50,
          "评论量": 20,
          "分享量": 10,
          "发布时间": "2026-03-01 19:47:07",
          "更新时间": "2026-03-01 19:47:07",
          "IP地址": "江苏",
          "博主ID": "xxx",
          "博主链接": "https://...",
          "博主昵称": "博主名",
          "图片数量": 3,
          "笔记封面链接": "https://...",
          "笔记图片链接": "https://...",
          "笔记视频时长": "",
          "笔记视频链接": ""
        }
      ]
    }
  }
}
```

## 免费资源限制

### Vercel 免费版
- 100GB 带宽/月
- 无限请求
- 自动 HTTPS

### Supabase 免费版
- 500MB 数据库存储
- 50,000 次请求/月
- 1GB 文件存储
- 2个并发连接

这些免费额度对于3人并发、3万条数据的使用场景完全足够。

## 常见问题

### Q: 如何获得 Supabase 的 URL 和 Anon Key？
A: 登录 Supabase，进入你的项目，在 Settings -> API 中可以找到。

### Q: 可以上传多大的文件？
A: Vercel 免费版支持 4.5MB 的请求体，足够处理500条以内的数据。如果数据量大，建议分批上传。

### Q: 如何备份数据？
A: 在 Supabase Dashboard 中可以导出数据库备份。

### Q: 可以修改数据吗？
A: 当前版本仅支持新增数据，不支持修改已有数据。如需修改，请使用 Supabase Dashboard 或重新上传相同笔记ID的数据。

## 项目结构

```
xiaohongshu-system/
├── app/                  # Next.js App Router
│   ├── api/             # API 路由
│   │   ├── upload/      # 上传接口
│   │   ├── query/       # 查询接口
│   │   ├── stats/       # 统计接口
│   │   └── download/    # 下载接口
│   ├── layout.tsx       # 全局布局
│   └── page.tsx         # 首页
├── components/          # React 组件
│   ├── UploadSection.tsx    # 上传组件
│   ├── FilterSection.tsx    # 筛选组件
│   ├── DataTable.tsx        # 数据表格
│   └── StatsSection.tsx     # 统计图表
├── lib/                # 工具函数
│   ├── db.ts           # 数据库连接
│   └── types.ts        # TypeScript 类型
├── sql/                # 数据库脚本
│   └── schema.sql      # 数据库表结构
├── public/             # 静态资源
├── .env.example        # 环境变量示例
└── README.md           # 项目说明
```

## License

MIT
