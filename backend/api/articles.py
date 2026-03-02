from flask import Blueprint, jsonify, request

from auth import require_admin
from crud import articles as crud

bp = Blueprint("articles", __name__, url_prefix="/api/admin/articles")

ALLOWED_OPTIONAL = ("url", "category_id", "publish_time", "tags")
ALLOWED_UPDATE = ("title", "content", "url", "category_id", "publish_time", "tags")


@bp.get("")
@require_admin
def list_articles():
    category_id = request.args.get("category_id", type=int)
    return jsonify(crud.get_all(category_id=category_id))


@bp.get("/<article_id>")
@require_admin
def get_article(article_id):
    item = crud.get_by_id(article_id)
    if not item:
        return jsonify({"error": "文章不存在"}), 404
    return jsonify(item)


@bp.post("")
@require_admin
def create_article():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    content = data.get("content")
    if not title or content is None:
        return jsonify({"error": "title 和 content 为必填项"}), 400
    if not isinstance(title, dict) or not (title.get("zh") or title.get("en")):
        return jsonify({"error": "title 必须包含 zh 或 en 字段"}), 400
    if not isinstance(content, dict) or not (content.get("zh") or content.get("en")):
        return jsonify({"error": "content 必须包含 zh 或 en 字段"}), 400
    optional = {
        k: v for k, v in data.items()
        if k in ALLOWED_OPTIONAL and v is not None
    }
    item = crud.create(title=title, content=content, **optional)
    return jsonify(item), 201


@bp.put("/<article_id>")
@require_admin
def update_article(article_id):
    data = request.get_json(silent=True) or {}
    allowed = {
        k: v for k, v in data.items()
        if k in ALLOWED_UPDATE
    }
    if not allowed:
        return jsonify({"error": "无有效更新字段"}), 400
    item = crud.update(article_id, **allowed)
    if not item:
        return jsonify({"error": "文章不存在"}), 404
    return jsonify(item)


@bp.delete("/<article_id>")
@require_admin
def delete_article(article_id):
    crud.delete(article_id)
    return "", 204
