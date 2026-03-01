"""前端适配的只读 API"""

from flask import Blueprint, jsonify

from crud import posts as crud

bp = Blueprint("posts", __name__, url_prefix="/api")


@bp.get("/posts")
def list_posts():
    posts = crud.get_all_posts()
    return jsonify({"posts": posts})


@bp.get("/posts/<slug>")
def get_post(slug):
    post = crud.get_post_by_slug(slug)
    if not post:
        return jsonify({"error": "文章不存在"}), 404
    return jsonify(post)


@bp.get("/posts/<slug>/adjacent")
def get_adjacent(slug):
    return jsonify(crud.get_adjacent_posts(slug))


@bp.get("/categories")
def list_categories_with_posts():
    categories = crud.get_all_categories_with_posts()
    return jsonify({"categories": categories})


@bp.get("/categories/<category>/posts")
def get_category_posts(category):
    posts = crud.get_posts_by_category(category)
    return jsonify({"posts": posts})
