import { create } from "zustand";
import { TCsvData } from "../types";
import { devtools } from "zustand/middleware";

interface IUseCsvStore {
  data: TCsvData;
  filename: string | null;
  setData: (data: TCsvData, filename: string) => void;
  reset: () => void;
}

export const useCsvStore = create<IUseCsvStore>()(
  devtools((set) => ({
    data: [],
    filename: null,
    setData: (data, filename) => set({ data, filename }),
    reset: () => set({ data: [], filename: null }),
  })),
);
