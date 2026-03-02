from config import supabase

TABLE = "projects"

OPTIONAL_FIELDS = ("description", "tech_stack", "media_url", "media_type", "sort_order")


def get_all():
    """获取所有项目，按 sort_order 升序、created_at 降序"""
    return (
        supabase.table(TABLE)
        .select("*")
        .order("sort_order", desc=False)
        .order("created_at", desc=True)
        .execute()
        .data
    )


def get_by_id(project_id: int):
    """获取单个项目"""
    data = (
        supabase.table(TABLE)
        .select("*")
        .eq("id", project_id)
        .execute()
        .data
    )
    return data[0] if data else None


def create(name: str, url: str, **optional):
    """创建项目，optional 可包含 description, tech_stack, media_url, media_type, sort_order"""
    record = {"name": name, "url": url}
    for key in OPTIONAL_FIELDS:
        if key in optional:
            record[key] = optional[key]
    return supabase.table(TABLE).insert(record).execute().data[0]


def update(project_id: int, **fields):
    """更新项目，只更新传入的字段"""
    data = (
        supabase.table(TABLE)
        .update(fields)
        .eq("id", project_id)
        .execute()
        .data
    )
    return data[0] if data else None


def delete(project_id: int):
    """删除项目"""
    return (
        supabase.table(TABLE)
        .delete()
        .eq("id", project_id)
        .execute()
        .data
    )
