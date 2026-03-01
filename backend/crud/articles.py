from config import supabase

TABLE = "articles"

# 关联查询：文章 + 分类名
SELECT_WITH_CATEGORY = "*, categories(name)"


def get_all(category_id: int | None = None):
    """获取文章列表，可按分类筛选"""
    query = supabase.table(TABLE).select(SELECT_WITH_CATEGORY)
    if category_id is not None:
        query = query.eq("category_id", category_id)
    return query.order("publish_time", desc=True).execute().data


def get_by_id(article_id: int):
    """获取单篇文章（含分类信息）"""
    data = (
        supabase.table(TABLE)
        .select(SELECT_WITH_CATEGORY)
        .eq("id", article_id)
        .execute()
        .data
    )
    return data[0] if data else None


def create(title: str, content: dict, **optional):
    """创建文章，optional 可包含 url, category_id"""
    record = {"title": title, "content": content}
    for key in ("url", "category_id"):
        if key in optional:
            record[key] = optional[key]
    return supabase.table(TABLE).insert(record).execute().data[0]


def update(article_id: int, **fields):
    """更新文章，只更新传入的字段"""
    data = (
        supabase.table(TABLE)
        .update(fields)
        .eq("id", article_id)
        .execute()
        .data
    )
    return data[0] if data else None


def delete(article_id: int):
    """删除文章"""
    return (
        supabase.table(TABLE)
        .delete()
        .eq("id", article_id)
        .execute()
        .data
    )
