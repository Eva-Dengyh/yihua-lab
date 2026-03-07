"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { authHeaders } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/images`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("获取图片列表失败");
      setImages(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/images/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "上传失败");
      }
      setSuccess("上传成功");
      setTimeout(() => setSuccess(""), 2000);
      await fetchImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(image) {
    if (!confirm(`确定删除 ${image.name}？`)) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/images/${image.name}?sha=${image.sha}`,
        { method: "DELETE", headers: authHeaders() }
      );
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.error || "删除失败");
      }
      setSuccess("已删除");
      setTimeout(() => setSuccess(""), 2000);
      await fetchImages();
    } catch (err) {
      setError(err.message);
    }
  }

  function copyUrl(url) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        setSuccess("URL 已复制到剪贴板");
        setTimeout(() => setSuccess(""), 2000);
      }).catch(() => setError("复制失败"));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setSuccess("URL 已复制到剪贴板");
        setTimeout(() => setSuccess(""), 2000);
      } catch {
        setError("复制失败");
      }
      document.body.removeChild(textarea);
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, []);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">图片管理</h1>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            &times;
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-2 bg-green-50 text-green-600 text-sm rounded">
          {success}
        </div>
      )}

      {/* 上传区域 */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-8 ${
          dragActive
            ? "border-gray-800 bg-gray-100"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {uploading ? (
          <p className="text-gray-500">上传中...</p>
        ) : (
          <>
            <p className="text-gray-600 mb-1">
              拖拽图片到此处，或点击选择文件
            </p>
            <p className="text-gray-400 text-xs">
              支持 PNG、JPG、GIF、WebP、SVG，最大 5MB
            </p>
          </>
        )}
      </div>

      {/* 图片网格 */}
      {images.length === 0 ? (
        <p className="text-gray-500 text-center py-12">暂无图片</p>
      ) : (
        <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
          {images.map((img) => (
            <div
              key={img.sha}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-54 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={img.cdn_url}
                  alt={img.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p
                  className="text-xs text-gray-700 truncate mb-1"
                  title={img.name}
                >
                  {img.name}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {formatSize(img.size)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(img.cdn_url)}
                    className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    复制 URL
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="text-xs px-2 py-1 text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
