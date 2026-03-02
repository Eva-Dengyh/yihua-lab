from config import supabase

TABLE = "categories"


def get_all():
    """获取所有分类"""
    return supabase.table(TABLE).select("*").execute().data


def get_by_id(category_id: str):
    """获取单个分类"""
    data = (
        supabase.table(TABLE)
        .select("*")
        .eq("id", category_id)
        .execute()
        .data
    )
    return data[0] if data else None


def create(name: str, desc: str | None = None):
    """创建分类"""
    record = {"name": name}
    if desc is not None:
        record["desc"] = desc
    return supabase.table(TABLE).insert(record).execute().data[0]


def update(category_id: str, **fields):
    """更新分类，只更新传入的字段"""
    data = (
        supabase.table(TABLE)
        .update(fields)
        .eq("id", category_id)
        .execute()
        .data
    )
    return data[0] if data else None


def delete(category_id: str):
    """删除分类"""
    return (
        supabase.table(TABLE)
        .delete()
        .eq("id", category_id)
        .execute()
        .data
    )
