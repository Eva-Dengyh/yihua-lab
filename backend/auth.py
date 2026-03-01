"""JWT 认证模块"""

import functools
from datetime import datetime, timedelta, timezone

import jwt
from flask import request, jsonify

from config import JWT_SECRET_KEY

TOKEN_EXPIRE_HOURS = 24


def create_token(username, role):
    """生成 JWT token"""
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")


def require_admin(fn):
    """认证装饰器，仅允许 admin 角色访问"""
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "未提供认证令牌"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "令牌已过期"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "无效令牌"}), 401
        if payload.get("role") != "admin":
            return jsonify({"error": "权限不足"}), 403
        return fn(*args, **kwargs)
    return wrapper
