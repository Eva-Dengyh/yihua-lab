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