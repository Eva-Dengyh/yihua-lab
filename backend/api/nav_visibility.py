from flask import Blueprint, jsonify, request

from auth import require_admin
from crud import nav_visibility as crud

bp = Blueprint("nav_visibility", __name__, url_prefix="/api")


@bp.get("/nav-visibility")
def get_visibility():
    """公开接口：获取导航可见性配置"""
    return jsonify(crud.get_all())


@bp.put("/admin/nav-visibility")
@require_admin
def update_visibility():
    """管理员接口：批量更新导航可见性"""
    data = request.get_json(silent=True) or {}
    items = data.get("items", [])
    if not items:
        return jsonify({"error": "items 为必填项"}), 400
    for item in items:
        if "nav_key" not in item or "visible" not in item:
            return jsonify({"error": "每个 item 需包含 nav_key 和 visible"}), 400
    results = crud.batch_update(items)
    return jsonify(results)
