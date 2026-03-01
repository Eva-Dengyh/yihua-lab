from config import supabase

TABLE = "users"


def get_by_username(username):
    """根据用户名查询用户"""
    result = (
        supabase.table(TABLE)
        .select("id, username, password, role")
        .eq("username", username)
        .limit(1)
        .execute()
    )
    return result.data[0] if result.data else None
