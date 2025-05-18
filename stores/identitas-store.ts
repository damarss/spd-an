import { create } from "zustand";
import { persist } from "zustand/middleware";

export type IdentitasState = {
  nama: string;
  nip: string;
  pangkat_golongan: string;
  jabatan: string;
  unit_kerja: string;
  hasHydrated: boolean;
};

export type IdentitasActions = {
  setIdentitas: (identitas: IdentitasState) => void;
  setHasHydrated: (hydrated: boolean) => void;
};

export type IdentitasStore = IdentitasState & IdentitasActions;

export const useIdentitasStore = create<IdentitasStore>()(
  persist(
    (set) => ({
      nama: "",
      nip: "",
      pangkat_golongan: "",
      jabatan: "",
      unit_kerja: "",
      hasHydrated: false,
      setIdentitas: (identitas) => set(() => ({ ...identitas })),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "identitas-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
