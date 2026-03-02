from flask import Blueprint, jsonify, request

from auth import require_admin
from crud import projects as crud

bp = Blueprint("projects", __name__)

ALLOWED_FIELDS = ("name", "url", "description", "tech_stack", "media_url", "media_type", "sort_order")


# ---- 公开接口 ----

@bp.get("/api/projects")
def list_projects():
    """获取所有项目（前端展示用）"""
    return jsonify(crud.get_all())


# ---- 管理接口 ----

@bp.get("/api/admin/projects")
@require_admin
def admin_list_projects():
    return jsonify(crud.get_all())


@bp.post("/api/admin/projects")
@require_admin
def create_project():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    url = data.get("url")
    if not name or not url:
        return jsonify({"error": "name 和 url 为必填项"}), 400
    optional = {
        k: v for k, v in data.items()
        if k in ALLOWED_FIELDS and k not in ("name", "url") and v is not None
    }
    item = crud.create(name=name, url=url, **optional)
    return jsonify(item), 201


@bp.put("/api/admin/projects/reorder")
@require_admin
def reorder_projects():
    """批量更新项目排序"""
    data = request.get_json(silent=True) or {}
    items = data.get("items", [])
    if not items:
        return jsonify({"error": "items 为必填项"}), 400
    for item in items:
        crud.update(item["id"], sort_order=item["sort_order"])
    return jsonify(crud.get_all())


@bp.get("/api/admin/projects/<int:project_id>")
@require_admin
def get_project(project_id):
    item = crud.get_by_id(project_id)
    if not item:
        return jsonify({"error": "项目不存在"}), 404
    return jsonify(item)


@bp.put("/api/admin/projects/<int:project_id>")
@require_admin
def update_project(project_id):
    data = request.get_json(silent=True) or {}
    allowed = {k: v for k, v in data.items() if k in ALLOWED_FIELDS}
    if not allowed:
        return jsonify({"error": "无有效更新字段"}), 400
    item = crud.update(project_id, **allowed)
    if not item:
        return jsonify({"error": "项目不存在"}), 404
    return jsonify(item)


@bp.delete("/api/admin/projects/<int:project_id>")
@require_admin
def delete_project(project_id):
    crud.delete(project_id)
    return "", 204
