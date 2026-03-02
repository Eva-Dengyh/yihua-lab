"""前端适配的只读 API"""

from flask import Blueprint, jsonify, request

from crud import posts as crud

bp = Blueprint("posts", __name__, url_prefix="/api")


@bp.get("/posts")
def list_posts():
    lang = request.args.get("lang")
    posts = crud.get_all_posts(lang)
    return jsonify({"posts": posts})


@bp.get("/posts/<path:slug>")
def get_post(slug):
    lang = request.args.get("lang")
    post = crud.get_post_by_slug(slug, lang)
    if not post:
        return jsonify({"error": "文章不存在"}), 404
    return jsonify(post)


@bp.get("/posts/<path:slug>/adjacent")
def get_adjacent(slug):
    lang = request.args.get("lang")
    return jsonify(crud.get_adjacent_posts(slug, lang))


@bp.get("/categories")
def list_categories_with_posts():
    lang = request.args.get("lang")
    categories = crud.get_all_categories_with_posts(lang)
    return jsonify({"categories": categories})


@bp.get("/categories/<category>/posts")
def get_category_posts(category):
    lang = request.args.get("lang")
    posts = crud.get_posts_by_category(category, lang)
    return jsonify({"posts": posts})
