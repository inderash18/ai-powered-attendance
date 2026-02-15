import create from "zustand";
export const useUI = create(set => ({
  cameraOn: true,
  toggleCamera: () => set(s => ({ cameraOn: !s.cameraOn })),
}));
