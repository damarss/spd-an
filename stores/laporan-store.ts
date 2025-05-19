import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LaporanDetail = {
  id: number;
  uraian: string;
  waktu_mulai: Date;
  waktu_selesai: Date;
};

export type Laporan = {
  id: number;
  kecamatan_tujuan: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  perihal: string;
  id_ketua: number;
  is_spd: boolean;
  details: LaporanDetail[];
  modified_at: Date;
};

export type LaporanState = {
  laporanList: Laporan[];
  nextId: number;
};

export type LaporanActions = {
  addLaporan: (laporan: Omit<Laporan, "id" | "created_at">) => void;
  updateLaporan: (id: number, laporan: Omit<Laporan, "id">) => void;
  deleteLaporan: (id: number) => void;
  addLaporanDetail: (
    laporanId: number,
    detail: Omit<LaporanDetail, "id">
  ) => void;
  updateLaporanDetail: (
    laporanId: number,
    detailId: number,
    detail: Omit<LaporanDetail, "id">
  ) => void;
  deleteLaporanDetail: (laporanId: number, detailId: number) => void;
};

export type LaporanStore = LaporanState & LaporanActions;

export const useLaporanStore = create<LaporanStore>()(
  persist(
    (set, get) => ({
      laporanList: [],
      nextId: 1,
      addLaporan: (laporan) => {
        const newId = get().nextId;
        const newLaporan = {
          ...laporan,
          id: newId,
          modified_at: new Date(),
        };
        set((state) => ({
          laporanList: [...state.laporanList, newLaporan],
          nextId: newId + 1,
        }));
      },
      updateLaporan: (id, laporan) =>
        set((state) => ({
          laporanList: state.laporanList.map((l) =>
            l.id === id ? { ...laporan, id, details: l.details } : l
          ),
        })),
      deleteLaporan: (id) =>
        set((state) => ({
          laporanList: state.laporanList.filter((l) => l.id !== id),
        })),
      addLaporanDetail: (laporanId, detail) => {
        set((state) => ({
          laporanList: state.laporanList.map((l) => {
            if (l.id !== laporanId) return l;
            const nextDetailId =
              l.details.length > 0
                ? Math.max(...l.details.map((d) => d.id)) + 1
                : 1;
            return {
              ...l,
              details: [...l.details, { ...detail, id: nextDetailId }],
            };
          }),
        }));
      },
      updateLaporanDetail: (laporanId, detailId, detail) => {
        set((state) => ({
          laporanList: state.laporanList.map((l) => {
            if (l.id !== laporanId) return l;
            return {
              ...l,
              details: l.details.map((d) =>
                d.id === detailId ? { ...detail, id: detailId } : d
              ),
            };
          }),
        }));
      },
      deleteLaporanDetail: (laporanId, detailId) => {
        set((state) => ({
          laporanList: state.laporanList.map((l) => {
            if (l.id !== laporanId) return l;
            return {
              ...l,
              details: l.details.filter((d) => d.id !== detailId),
            };
          }),
        }));
      },
    }),
    {
      name: "laporan-storage",
    }
  )
);
