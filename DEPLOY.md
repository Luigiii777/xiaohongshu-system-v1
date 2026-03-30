# 快速部署指南 (完全免费)

本文档将指导您如何**零成本**部署小红书车型内容管理系统。

## 前置要求

- GitHub 账号（免费）
- Supabase 账号（免费）
- Vercel 账号（免费）

## 第一步：配置 Supabase 数据库

### 1.1 注册并创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project" 注册账号
3. 登录后，点击 "New Project"
4. 填写项目信息：
   - **组织名称**: 随意填写
   - **项目名称**: 如 `xiaohongshu-system`
   - **数据库密码**: 记住这个密码（不需要实际使用）
   - **区域**: 选择距离最近的区域（如 Northeast Asia）以获得更好的速度
5. 等待项目创建（约1-2分钟）

### 1.2 创建数据库表

1. 在左侧菜单找到 "SQL Editor"
2. 点击 "New query"
3. 复制项目中的 `sql/schema.sql` 文件的全部内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行 SQL
6. 等待提示 "Success. No rows returned"

### 1.3 获取连接信息

1. 点击左侧菜单 "Settings" -> "API"
2. 复制以下两个值，稍后需要用到：
   - **Project URL**: 形如 `https://xxx.supabase.co`
   - **anon public**: 很长的密钥字符串

## 第二步：部署到 Vercel

### 2.1 推送代码到 GitHub

如果您还没有 GitHub 仓库：

1. 访问 https://github.com/new 创建新仓库
2. 命名为 `xiaohongshu-system`
3. 点击 "Create repository"

在本地项目目录执行：

```bash
cd xiaohongshu-system

# 如果还没有初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 设置主分支名称
git branch -M main

# 添加远程仓库
git remote add origin https://github.com/你的用户名/xiaohongshu-system.git

# 推送代码
git push -u origin main
```

### 2.2 连接到 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Login"（可以用 GitHub 账号登录）
3. 登录后，点击仪表盘的 "Add New" -> "Project"
4. 点击 "Import" 导入您的 GitHub 仓库
5. 配置项目设置：
   - **Framework Preset**: Next.js（会自动识别）
   - **Root Directory**: 保持默认 `./`
   - **Build Command**: 保持默认 `npm run build`
   - **Output Directory**: 保持默认 `.next`
6. 点击 "Continue"

### 2.3 配置环境变量

在 "Environment Variables" 部分：

1. 点击 "Add New" 添加第一个环境变量：
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: 粘贴第一步获取的 Project URL
   - 点击 "Add"

2. 点击 "Add New" 添加第二个环境变量：
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: 粘贴第一步获取的 anon public key
   - 点击 "Add"

3. 确保两个环境变量的 Environment 都选择了 `Production`, `Preview`, `Development`
4. 点击 "Deploy"

### 2.4 等待部署完成

- 部署过程通常需要 1-3 分钟
- 部署成功后，你会看到 "Congratulations!"
- 点击生成的链接即可访问您的应用（如：`https://xiaohongshu-system.vercel.app`）

## 第三步：测试功能

1. 打开部署好的网站
2. 点击 "📤 上传数据"
3. 选择示例文件（example 文件夹中的 JSON 文件）
4. 选择对应的车型
5. 上传数据
6. 点击 "📊 统计分析" 查看统计图表
7. 点击 "🔍 查询数据" 测试查询和下载功能

## 常见问题排查

### 问题1：部署后无法连接数据库

**解决方案**：
1. 检查 Vercel 的环境变量是否正确设置
2. 去 Supabase 确认项目状态是否为 Active
3. 重新部署 Vercel 项目：在 Vercel Dashboard 点击 "Redeploy"

### 问题2：上传数据时报错

**解决方案**：
1. 检查 JSON 文件格式是否正确
2. 确保 Supabase 数据库表已成功创建
3. 刷新页面后重试

### 问题3：统计图表不显示

**解决方案**：
1. 确保已上传数据
2. 点击 "刷新统计数据" 按钮
3. 检查浏览器控制台是否有错误

## 后续维护

### 备份数据

1. 登录 Supabase Dashboard
2. 进入您的项目
3. 点击左侧 "Database" -> "Backups"
4. 您可以自动备份或手动创建备份

### 更新应用

1. 修改本地代码
2. 提交到 GitHub
3. Vercel 会自动检测并重新部署

### 查看使用量

- **Vercel**: Dashboard 可以查看带宽、请求量等
- **Supabase**: Settings -> Billing 可以查看数据库用量

## 下一步建议

如果免费额度不够用：

1. **Supabase 升级**：Pro 版本 ¥100/月起
   - 8GB 数据库
   - 无限 API 请求
   - 更多并发连接

2. **Vercel 升级**：Pro 版本 $20/月起
   - 更快的部署速度
   - 无带宽限制
   - 专属支持

但目前的免费版本（3人并发、3万条数据）完全够用！

需要帮助？

- Supabase 文档: https://supabase.com/docs
- Vercel 文档: https://vercel.com/docs
