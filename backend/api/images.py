"""图片管理 API - GitHub 图床上传/列表/删除"""

import logging

from flask import Blueprint, jsonify, request
from httpx import HTTPStatusError

from auth import require_admin
from service import github_image

logger = logging.getLogger(__name__)

bp = Blueprint("images", __name__)


@bp.post("/api/admin/images/upload")
@require_admin
def upload_image():
    """上传图片到 GitHub 图床"""
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "未选择文件"}), 400

    file_bytes = file.read()
    ok, err_msg = github_image.validate_file(file.filename, len(file_bytes))
    if not ok:
        return jsonify({"error": err_msg}), 400

    try:
        result = github_image.upload(file.filename, file_bytes)
        return jsonify(result), 201
    except HTTPStatusError as e:
        logger.error("GitHub API 上传失败: %s", e.response.text)
        if e.response.status_code == 422:
            return jsonify({"error": "文件已存在或路径无效"}), 409
        return jsonify({"error": "GitHub API 调用失败"}), 502


@bp.get("/api/admin/images")
@require_admin
def list_images():
    """列出所有已上传的图片"""
    try:
        images = github_image.list_images()
        return jsonify(images)
    except HTTPStatusError as e:
        logger.error("GitHub API 列表失败: %s", e.response.text)
        return jsonify({"error": "获取图片列表失败"}), 502


@bp.delete("/api/admin/images/<path:filename>")
@require_admin
def delete_image(filename):
    """删除指定图片"""
    sha = request.args.get("sha")
    if not sha:
        return jsonify({"error": "缺少 sha 参数"}), 400
    try:
        github_image.delete(filename, sha)
        return "", 204
    except HTTPStatusError as e:
        logger.error("GitHub API 删除失败: %s", e.response.text)
        if e.response.status_code == 404:
            return jsonify({"error": "图片不存在"}), 404
        return jsonify({"error": "删除失败"}), 502
