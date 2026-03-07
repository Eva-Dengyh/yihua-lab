"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { authHeaders } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* 通知 toast */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors =
    type === "error"
      ? "bg-red-500/90 text-white"
      : "bg-emerald-500/90 text-white";

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg backdrop-blur-sm text-sm font-medium ${colors}`}
      style={{ animation: "toast-in 0.3s ease-out" }}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">
        &times;
      </button>
    </div>
  );
}

/* 骨架屏 */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden">
          <div
            className="aspect-square bg-gray-100 animate-pulse rounded-xl"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div className="pt-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* 图片卡片 */
function ImageCard({ img, onCopy, onDelete }) {
  const [hovering, setHovering] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy(e) {
    e.stopPropagation();
    onCopy(img.cdn_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(img);
  }

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* 图片区域 */}
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={img.cdn_url}
          alt={img.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* 悬浮遮罩 + 操作按钮 */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300"
          style={{ opacity: hovering ? 1 : 0 }}
        >
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 text-xs font-medium px-3 py-2 rounded-lg bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-white transition-colors"
            >
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <button
              onClick={handleDelete}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-red-500/90 text-white backdrop-blur-sm hover:bg-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 信息区域 */}
      <div className="px-3 py-2.5">
        <p className="text-xs text-gray-700 truncate leading-tight" title={img.name}>
          {img.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{formatSize(img.size)}</p>
      </div>
    </div>
  );
}

export default function AdminImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  // 上传进度模拟动画
  useEffect(() => {
    if (!uploading) {
      setUploadProgress(0);
      return;
    }
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      setUploadProgress(progress);
    }, 200);
    return () => clearInterval(interval);
  }, [uploading]);

  function showToast(message, type = "success") {
    setToast({ message, type, key: Date.now() });
  }

  async function fetchImages() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/images`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("获取图片列表失败");
      setImages(await res.json());
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
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
      setUploadProgress(100);
      showToast("上传成功");
      await fetchImages();
    } catch (err) {
      showToast(err.message, "error");
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
      showToast("已删除");
      await fetchImages();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function copyUrl(url) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("URL 已复制到剪贴板"))
        .catch(() => showToast("复制失败", "error"));
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        showToast("URL 已复制到剪贴板");
      } catch {
        showToast("复制失败", "error");
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

  return (
    <>
      {/* 内联关键帧动画 */}
      <style jsx global>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes upload-pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Toast 通知 */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="p-6 md:p-8 max-w-7xl">
        {/* 页头 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
              图片管理
            </h1>
            {!loading && (
              <p className="text-sm text-gray-400 mt-1">
                {images.length > 0
                  ? `共 ${images.length} 张图片`
                  : "还没有上传图片"}
              </p>
            )}
          </div>
        </div>

        {/* 上传区域 */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 mb-10 overflow-hidden ${
            dragActive
              ? "border-gray-700 bg-gray-50 scale-[1.01]"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
          } ${uploading ? "pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* 上传进度条 */}
          {uploading && (
            <div
              className="absolute top-0 left-0 h-1 bg-gray-700 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          )}

          <div className="py-10 px-6">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-gray-700"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                <p className="text-sm text-gray-500 font-medium">上传中...</p>
              </div>
            ) : (
              <>
                {/* 上传图标 */}
                <div
                  className={`mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                    dragActive ? "bg-gray-200" : "bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 transition-colors duration-300 ${
                      dragActive ? "text-gray-700" : "text-gray-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0l-4 4m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1.5">
                  拖拽图片到此处，或
                  <span className="text-gray-800 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500">
                    点击选择文件
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  PNG / JPG / GIF / WebP / SVG，最大 5MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* 图片网格 */}
        {loading ? (
          <SkeletonGrid />
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">暂无图片，上传第一张吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((img, i) => (
              <div
                key={img.sha}
                style={{
                  animation: "fade-up 0.4s ease-out both",
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <ImageCard
                  img={img}
                  onCopy={copyUrl}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
