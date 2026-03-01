# yihua-lab

前后端分离的个人博客系统，支持中英文国际化与深色/浅色主题切换。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 / React 19 / Tailwind CSS 4 |
| 后端 | Flask 3 / Gunicorn |
| 数据库 | Supabase (PostgreSQL) |
| 部署 | PM2 / rsync + SSH |

## 项目结构

```
yihua-lab/
├── frontend/                # 前端 (Next.js)
│   ├── app/
│   │   ├── layout.js        # 根布局（主题 Provider）
│   │   └── [lang]/          # 国际化路由 (zh / en)
│   │       ├── page.js              # 首页（个人简介）
│   │       ├── archives/page.js     # 文章归档
│   │       ├── category/page.js     # 分类列表
│   │       ├── tag/page.js          # 标签云
│   │       ├── about/page.js        # 关于页面
│   │       ├── posts/[slug]/page.js # 文章详情
│   │       ├── categories/[category]/page.js
│   │       └── tags/[tag]/page.js
│   ├── components/          # UI 组件
│   ├── lib/                 # 数据获取与配置
│   ├── dictionaries/        # 国际化词典 (zh.json / en.json)
│   ├── content/pages/       # 静态页面 (about 等 Markdown)
│   └── middleware.js        # 语言路由中间件
├── backend/                 # 后端 (Flask)
│   ├── app.py               # 应用入口
│   ├── config.py            # Supabase 客户端初始化
│   ├── api/                 # 路由层
│   │   ├── posts.py         # 前端只读接口
│   │   ├── articles.py      # 管理端 CRUD
│   │   └── categories.py    # 分类管理 CRUD
│   ├── crud/                # 数据访问层
│   └── supabase_schema.sql  # 数据库建表脚本
├── ecosystem.config.js      # PM2 进程配置
├── deploy-all.sh            # 一键部署脚本
└── LICENSE                  # MIT License
```

## API 概览

### 前端只读接口

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/posts` | 文章列表 |
| GET | `/api/posts/:slug` | 文章详情 |
| GET | `/api/posts/:slug/adjacent` | 上一篇 / 下一篇 |
| GET | `/api/categories` | 分类列表（含文章） |
| GET | `/api/categories/:name/posts` | 分类下文章 |

### 管理端 CRUD 接口

| 方法 | 端点 | 说明 |
|------|------|------|
| GET/POST | `/api/admin/articles` | 文章列表 / 创建 |
| GET/PUT/DELETE | `/api/admin/articles/:id` | 文章详情 / 更新 / 删除 |
| GET/POST | `/api/admin/categories` | 分类列表 / 创建 |
| GET/PUT/DELETE | `/api/admin/categories/:id` | 分类详情 / 更新 / 删除 |

## 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.11
- [uv](https://docs.astral.sh/uv/) (Python 包管理)
- Supabase 项目（提供 URL 和 Key）

### 后端

```bash
cd backend

# 创建环境变量
cp .env.example .env
# 编辑 .env，填入 SUPABASE_URL 和 SUPABASE_KEY

# 在 Supabase 中执行建表脚本
# supabase_schema.sql

# 安装依赖并启动
uv venv .venv
source .venv/bin/activate
uv pip install -r pyproject.toml
python app.py
# 后端运行在 http://localhost:8000
```

### 前端

```bash
cd frontend

# 创建环境变量
cp .env.local.example .env.local  # 或手动创建
# 内容: NEXT_PUBLIC_API_URL=http://localhost:8000

# 安装依赖并启动
npm install
npm run dev
# 前端运行在 http://localhost:3000
```

## 部署

项目提供一键部署脚本，通过 rsync + SSH 同步代码到远程服务器，使用 PM2 管理进程。

### 配置

```bash
# 在项目根目录创建部署配置
cp .deploy.env.example .deploy.env
# 编辑 .deploy.env:
#   DEPLOY_SERVER=user@your-server-ip
#   DEPLOY_REMOTE_DIR=/opt/yihua-lab
```

### 执行部署

```bash
# 一键部署前后端
bash deploy-all.sh

# 或单独部署
bash backend/deploy-local.sh   # 仅后端
bash frontend/deploy-local.sh  # 仅前端
```

部署流程包含：上传代码 → 备份旧版本（保留最近 5 个） → 安装依赖 → 重启服务 → 健康检查 → 失败时可选回滚。

## License

[MIT](LICENSE)
