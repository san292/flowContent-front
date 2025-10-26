"use client";
import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  type: ToastType;
  message: string;
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
    // auto-close après 3 secondes
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const ToastBanner = () =>
    toast ? (
      <div
        className={`fixed top-4 right-4 z-50 rounded-md px-4 py-3 shadow transition-all duration-300
        ${
          toast.type === "success"
            ? "bg-green-600 text-white"
            : toast.type === "error"
            ? "bg-red-600 text-white"
            : "bg-blue-600 text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={hideToast}
            className="text-white/80 hover:text-white text-xs"
          >
            OK
          </button>
        </div>
      </div>
    ) : null;

  return { toast, showToast, hideToast, ToastBanner };
}
