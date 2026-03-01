"""前端适配的查询层，将 DB 结构映射为前端期望的格式"""

from config import supabase


def _format_post(row):
    """将 articles 表记录转换为前端 post 格式"""
    category_name = ""
    if row.get("categories"):
        category_name = row["categories"]["name"]
    return {
        "slug": row.get("url", ""),
        "title": row["title"],
        "date": row.get("publish_time", ""),
        "categories": [category_name] if category_name else [],
        "tags": [],
    }


def _format_post_detail(row):
    """带 content 的完整 post 格式"""
    post = _format_post(row)
    post["content"] = row.get("content", "")
    return post


def get_all_posts():
    """获取所有文章列表"""
    rows = (
        supabase.table("articles")
        .select("*, categories(name)")
        .order("publish_time", desc=True)
        .execute()
        .data
    )
    return [_format_post(r) for r in rows]


def get_post_by_slug(slug: str):
    """根据 slug(url) 获取单篇文章"""
    data = (
        supabase.table("articles")
        .select("*, categories(name)")
        .eq("url", slug)
        .execute()
        .data
    )
    if not data:
        return None
    return _format_post_detail(data[0])


def get_adjacent_posts(slug: str):
    """获取上一篇和下一篇文章"""
    # 先获取当前文章的 publish_time
    current = (
        supabase.table("articles")
        .select("publish_time")
        .eq("url", slug)
        .execute()
        .data
    )
    if not current:
        return {"prev": None, "next": None}

    publish_time = current[0]["publish_time"]

    # 上一篇：发布时间更早的最新一篇
    prev_data = (
        supabase.table("articles")
        .select("url, title")
        .lt("publish_time", publish_time)
        .order("publish_time", desc=True)
        .limit(1)
        .execute()
        .data
    )

    # 下一篇：发布时间更晚的最早一篇
    next_data = (
        supabase.table("articles")
        .select("url, title")
        .gt("publish_time", publish_time)
        .order("publish_time", desc=False)
        .limit(1)
        .execute()
        .data
    )

    prev_post = (
        {"slug": prev_data[0]["url"], "title": prev_data[0]["title"]}
        if prev_data
        else None
    )
    next_post = (
        {"slug": next_data[0]["url"], "title": next_data[0]["title"]}
        if next_data
        else None
    )
    return {"prev": prev_post, "next": next_post}


def get_all_categories_with_posts():
    """获取所有分类，每个分类附带文章列表"""
    categories = (
        supabase.table("categories").select("id, name").execute().data
    )
    result = []
    for cat in categories:
        posts = (
            supabase.table("articles")
            .select("*, categories(name)")
            .eq("category_id", cat["id"])
            .order("publish_time", desc=True)
            .execute()
            .data
        )
        result.append({
            "name": cat["name"],
            "posts": [_format_post(p) for p in posts],
        })
    return result


def get_posts_by_category(category_name: str):
    """根据分类名获取文章列表"""
    # 先查分类 id
    cat = (
        supabase.table("categories")
        .select("id")
        .eq("name", category_name)
        .execute()
        .data
    )
    if not cat:
        return []
    posts = (
        supabase.table("articles")
        .select("*, categories(name)")
        .eq("category_id", cat[0]["id"])
        .order("publish_time", desc=True)
        .execute()
        .data
    )
    return [_format_post(p) for p in posts]
