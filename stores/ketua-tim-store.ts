import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KetuaTim = {
  nama: string;
  jabatan: string;
  nip: string;
};

export type KetuaTimState = {
  ketuaList: KetuaTim[];
};

export type KetuaTimActions = {
  addKetuaTim: (ketuaTim: KetuaTim) => void;
  updateKetuaTim: (index: number, ketuaTim: KetuaTim) => void;
  deleteKetuaTim: (index: number) => void;
};

export type KetuaTimStore = KetuaTimState & KetuaTimActions;

export const useKetuaTimStore = create<KetuaTimStore>()(
  persist(
    (set) => ({
      ketuaList: [],
      addKetuaTim: (ketuaTim: KetuaTim) =>
        set((state) => ({ ketuaList: [...state.ketuaList, ketuaTim] })),
      updateKetuaTim: (index, ketuaTim) =>
        set((state) => ({
          ketuaList: state.ketuaList.map((k, i) =>
            i === index ? ketuaTim : k
          ),
        })),
      deleteKetuaTim: (index) =>
        set((state) => ({
          ketuaList: state.ketuaList.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "ketua-tim-storage",
    }
  )
);
