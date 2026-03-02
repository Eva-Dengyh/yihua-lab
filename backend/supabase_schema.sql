-- 分类表
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  desc TEXT
);

-- 文章表
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  publish_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  url VARCHAR(512),
  category_id BIGINT REFERENCES categories(id)
);

-- 用户表
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- 导航可见性配置表
CREATE TABLE nav_visibility (
  id BIGSERIAL PRIMARY KEY,
  nav_key VARCHAR(50) UNIQUE NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 初始化导航可见性数据
INSERT INTO nav_visibility (nav_key, visible) VALUES
  ('posts', false),
  ('categories', false),
  ('tags', false),
  ('about', true),
  ('projects', false);

-- 项目展示表
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  description TEXT,
  tech_stack VARCHAR(512),
  media_url VARCHAR(512),
  media_type VARCHAR(10) DEFAULT 'image',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);