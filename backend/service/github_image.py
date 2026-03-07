"""GitHub 图床服务 - 封装 GitHub Contents API 的图片上传/查询/删除"""

import base64
import time

import httpx

from config import GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, GITHUB_IMG_PATH

API_BASE = "https://api.github.com"
CDN_BASE = "https://cdn.jsdelivr.net/gh"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "svg", "ico"}
REQUEST_TIMEOUT = 30


def _headers():
    return {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }


def _contents_url(path=""):
    full_path = f"{GITHUB_IMG_PATH}/{path}".strip("/")
    return f"{API_BASE}/repos/{GITHUB_REPO}/contents/{full_path}"


def _cdn_url(path):
    full_path = f"{GITHUB_IMG_PATH}/{path}".strip("/")
    return f"{CDN_BASE}/{GITHUB_REPO}@{GITHUB_BRANCH}/{full_path}"


def _generate_filename(original_name):
    """生成唯一文件名：时间戳_原始文件名"""
    timestamp = int(time.time() * 1000)
    safe_name = original_name.replace(" ", "_")
    return f"{timestamp}_{safe_name}"


def validate_file(filename, file_size):
    """校验文件类型和大小，返回 (ok, error_msg)"""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        return False, f"不支持的文件类型: .{ext}，允许: {allowed}"
    if file_size > MAX_FILE_SIZE:
        return False, f"文件大小超过限制: {file_size // 1024}KB > {MAX_FILE_SIZE // 1024}KB"
    return True, ""


def upload(filename, file_bytes):
    """上传图片到 GitHub，返回图片信息字典"""
    safe_name = _generate_filename(filename)
    content_b64 = base64.b64encode(file_bytes).decode("utf-8")

    resp = httpx.put(
        _contents_url(safe_name),
        headers=_headers(),
        json={
            "message": f"upload: {safe_name}",
            "content": content_b64,
            "branch": GITHUB_BRANCH,
        },
        timeout=REQUEST_TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()

    return {
        "name": safe_name,
        "path": data["content"]["path"],
        "cdn_url": _cdn_url(safe_name),
        "github_url": data["content"]["download_url"],
        "size": data["content"]["size"],
        "sha": data["content"]["sha"],
    }


def list_images():
    """列出图片目录下的所有文件"""
    resp = httpx.get(
        _contents_url(),
        headers=_headers(),
        params={"ref": GITHUB_BRANCH},
        timeout=REQUEST_TIMEOUT,
    )
    # 目录不存在时返回空列表
    if resp.status_code == 404:
        return []
    resp.raise_for_status()

    items = resp.json()
    if not isinstance(items, list):
        return []

    return [
        {
            "name": item["name"],
            "path": item["path"],
            "cdn_url": _cdn_url(item["name"]),
            "github_url": item.get("download_url", ""),
            "size": item["size"],
            "sha": item["sha"],
        }
        for item in items
        if item["type"] == "file"
    ]


def delete(filename, sha):
    """从 GitHub 删除指定图片"""
    resp = httpx.request(
        "DELETE",
        _contents_url(filename),
        headers=_headers(),
        json={
            "message": f"delete: {filename}",
            "sha": sha,
            "branch": GITHUB_BRANCH,
        },
        timeout=REQUEST_TIMEOUT,
    )
    resp.raise_for_status()
