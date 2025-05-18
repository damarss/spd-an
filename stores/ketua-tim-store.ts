import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KetuaTim = {
  id: number;
  nama: string;
  jabatan: string;
  nip: string;
};

export type KetuaTimState = {
  ketuaList: KetuaTim[];
};

export type KetuaTimActions = {
  addKetuaTim: (ketuaTim: Omit<KetuaTim, "id">) => void;
  updateKetuaTim: (id: number, ketuaTim: Omit<KetuaTim, "id">) => void;
  deleteKetuaTim: (id: number) => void;
};

export type KetuaTimStore = KetuaTimState & KetuaTimActions;

export const useKetuaTimStore = create<KetuaTimStore>()(
  persist(
    (set, get) => ({
      ketuaList: [],
      addKetuaTim: (ketuaTim) => {
        const list = get().ketuaList;
        const nextId =
          list.length > 0 ? Math.max(...list.map((k) => k.id)) + 1 : 1;
        set({ ketuaList: [...list, { ...ketuaTim, id: nextId }] });
      },
      updateKetuaTim: (id, ketuaTim) =>
        set((state) => ({
          ketuaList: state.ketuaList.map((k) =>
            k.id === id ? { ...ketuaTim, id } : k
          ),
        })),
      deleteKetuaTim: (id) =>
        set((state) => ({
          ketuaList: state.ketuaList.filter((k) => k.id !== id),
        })),
    }),
    {
      name: "ketua-tim-storage",
    }
  )
);
