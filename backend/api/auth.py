from flask import Blueprint, jsonify, request

from auth import create_token
from crud.users import get_by_username

bp = Blueprint("auth", __name__, url_prefix="/api")


@bp.post("/login")
def login():
    """管理员登录，验证账号密码并返回 JWT"""
    data = request.get_json(silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")

    user = get_by_username(username)
    if not user or user["password"] != password:
        return jsonify({"error": "账号或密码错误"}), 401

    token = create_token(user["username"], user["role"])
    return jsonify({"token": token, "role": user["role"]})
