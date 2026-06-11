"use client";

import { create } from "zustand";

type AppStore = {
  selectedClassId: string | null;
  subjectFilter: string;
  statusFilter: string;
  setSelectedClassId: (classId: string | null) => void;
  setSubjectFilter: (subject: string) => void;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  selectedClassId: null,
  subjectFilter: "",
  statusFilter: "",
  setSelectedClassId: (selectedClassId) => set({ selectedClassId }),
  setSubjectFilter: (subjectFilter) => set({ subjectFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  resetFilters: () => set({ subjectFilter: "", statusFilter: "" }),
}));
