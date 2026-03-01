from config import supabase

TABLE = "nav_visibility"


def get_all():
    """获取所有导航可见性配置"""
    return (
        supabase.table(TABLE)
        .select("nav_key, visible")
        .execute()
        .data
    )


def batch_update(items):
    """批量更新导航可见性"""
    results = []
    for item in items:
        data = (
            supabase.table(TABLE)
            .update({"visible": item["visible"]})
            .eq("nav_key", item["nav_key"])
            .execute()
            .data
        )
        if data:
            results.append(data[0])
    return results
