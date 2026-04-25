// ============================================================
// Vex — Cross the line.
// UI Store — Zustand state for UI elements
// ============================================================

import { create } from 'zustand';
import type { Payload, Toast } from '@/types';

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Payload detail modal
  selectedPayload: Payload | null;
  detailModalOpen: boolean;
  openPayloadDetail: (payload: Payload) => void;
  closePayloadDetail: () => void;

  // Matrix rain
  matrixRainEnabled: boolean;
  toggleMatrixRain: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () =>
    set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),

  // Payload detail modal
  selectedPayload: null,
  detailModalOpen: false,
  openPayloadDetail: (payload) =>
    set({ selectedPayload: payload, detailModalOpen: true }),
  closePayloadDetail: () =>
    set({ selectedPayload: null, detailModalOpen: false }),

  // Matrix rain
  matrixRainEnabled: false,
  toggleMatrixRain: () =>
    set((s) => ({ matrixRainEnabled: !s.matrixRainEnabled })),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id }],
    }));
    // Auto-remove after duration
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));
