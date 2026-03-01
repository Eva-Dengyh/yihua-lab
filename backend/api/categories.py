from flask import Blueprint, jsonify, request

from crud import categories as crud

bp = Blueprint("categories", __name__, url_prefix="/api/admin/categories")


@bp.get("/")
def list_categories():
    return jsonify(crud.get_all())


@bp.get("/<int:category_id>")
def get_category(category_id):
    item = crud.get_by_id(category_id)
    if not item:
        return jsonify({"error": "分类不存在"}), 404
    return jsonify(item)


@bp.post("/")
def create_category():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    if not name:
        return jsonify({"error": "name 为必填项"}), 400
    item = crud.create(name=name, desc=data.get("desc"))
    return jsonify(item), 201


@bp.put("/<int:category_id>")
def update_category(category_id):
    data = request.get_json(silent=True) or {}
    allowed = {k: v for k, v in data.items() if k in ("name", "desc")}
    if not allowed:
        return jsonify({"error": "无有效更新字段"}), 400
    item = crud.update(category_id, **allowed)
    if not item:
        return jsonify({"error": "分类不存在"}), 404
    return jsonify(item)


@bp.delete("/<int:category_id>")
def delete_category(category_id):
    crud.delete(category_id)
    return "", 204
