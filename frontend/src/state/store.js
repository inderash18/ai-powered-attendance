import { create } from 'zustand';

export const useAttendanceStore = create((set) => ({
  isStreaming: false,
  recognizedStudents: [],
  setStreaming: (status) => set({ isStreaming: status }),
  setRecognizedStudents: (students) => set({ recognizedStudents: students }),
}));

export const useUIStore = create((set) => ({
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state })),
}));
