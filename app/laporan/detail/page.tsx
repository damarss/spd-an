"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LaporanForm from "@/components/forms/laporan-form";
import LaporanDetailForm from "@/components/forms/laporan-detail-form";
// import LaporanReport from "@/components/laporan-report"; // to be created
import { useSearchParams } from "next/navigation";
import { useLaporanStore } from "@/stores/laporan-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { LaporanDetail } from "./columns";
import { generateLaporanKendaraan } from "@/actions/generate-laporan-kendaraan";

// Utility to format date for datetime-local input in local time
function toLocalISOString(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

type Props = {};

const LaporanDetailPage = (props: Props) => {
  const searchParams = useSearchParams();
  const laporanId = Number(searchParams?.get("id"));
  const laporan = useLaporanStore((state) =>
    state.laporanList.find((l) => l.id === laporanId)
  );
  const [tab, setTab] = React.useState("edit");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [showAddDetail, setShowAddDetail] = React.useState(false);
  const [editingDetail, setEditingDetail] =
    React.useState<LaporanDetail | null>(null);
  const router = require("next/navigation").useRouter();
  const deleteLaporan = useLaporanStore((state) => state.deleteLaporan);

  const handleDelete = () => {
    if (!laporan) return;
    deleteLaporan(laporan.id);
    router.push("/laporan");
  };

  // Handler for edit button in DataTable
  const handleEditDetail = (detail: LaporanDetail) => {
    setEditingDetail(detail);
    setShowAddDetail(true);
  };

  // Handler for add button
  const handleAddDetail = () => {
    setEditingDetail(null);
    setShowAddDetail((prev) => !prev);
  };

  const handleDeleteDetail = (detail: LaporanDetail) => {
    if (!laporan) return;
    const confirmed = window.confirm("Yakin ingin menghapus detail ini?");
    if (confirmed) {
      useLaporanStore.getState().deleteLaporanDetail(laporan.id, detail.id);
    }
  };

  if (!laporan) {
    return (
      <div className="text-center py-12 text-destructive">
        Laporan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          aria-label="Kembali ke daftar laporan"
        >
          <ChevronLeft className="w-6 h-6 transition-colors group-hover:text-primary" />
          <span>Kembali</span>
        </Button>
        <Button variant="destructive" onClick={() => setOpenDialog(true)}>
          Hapus Laporan
        </Button>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Laporan?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* End Dialog */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex justify-between w-full p-1.5 mb-6 rounded-full h-fit gap-2 bg-black/6 dark:bg-white/6 backdrop-blur-sm">
          <TabsTrigger
            value="edit"
            className="flex-1 gap-2 cursor-pointer py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            <span className="font-bold">1</span>
            <span>Edit</span>
          </TabsTrigger>
          <TabsTrigger
            value="detail"
            className="flex-1 cursor-pointer py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            <span className="font-bold">2</span>
            <span>Isi Detail</span>
          </TabsTrigger>
          <TabsTrigger
            value="report"
            className="flex-1 cursor-pointer py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            <span className="font-bold">3</span> Generate
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="w-full">
          <LaporanForm
            laporanId={laporan.id}
            initialValues={{
              kecamatan_tujuan: laporan.kecamatan_tujuan,
              tanggal_mulai:
                typeof laporan.tanggal_mulai === "string"
                  ? new Date(laporan.tanggal_mulai)
                  : laporan.tanggal_mulai,
              tanggal_selesai:
                typeof laporan.tanggal_selesai === "string"
                  ? new Date(laporan.tanggal_selesai)
                  : laporan.tanggal_selesai,
              perihal: laporan.perihal,
              id_ketua: laporan.id_ketua,
              is_spd: laporan.is_spd,
            }}
          />
        </TabsContent>
        <TabsContent value="detail" className="w-full">
          {/* Laporan Detail List */}
          <div className="w-full overflow-x-auto rounded-lg border">
            <DataTable
              columns={columns}
              data={[...laporan.details].sort(
                (a, b) =>
                  new Date(a.waktu_mulai).getTime() -
                  new Date(b.waktu_mulai).getTime()
              )}
              meta={{
                onEdit: handleEditDetail,
                onDelete: handleDeleteDetail,
              }}
            />
          </div>
          {/* Collapsible Add/Edit Detail Button and Form */}
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleAddDetail}
              className="mb-2 cursor-pointer"
            >
              {showAddDetail
                ? editingDetail
                  ? "Tutup Form Edit Detail"
                  : "Tutup Form Tambah Detail"
                : editingDetail
                ? "Edit Detail"
                : "Tambah Detail"}
            </Button>
            {showAddDetail && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <LaporanDetailForm
                  laporanId={laporan.id}
                  onSuccess={() => {
                    setShowAddDetail(false);
                    setEditingDetail(null);
                  }}
                  isEditing={!!editingDetail}
                  detailId={editingDetail?.id}
                  initialValues={
                    editingDetail
                      ? {
                          uraian: editingDetail.uraian,
                          waktu_mulai: toLocalISOString(
                            new Date(editingDetail.waktu_mulai)
                          ),
                          waktu_selesai: toLocalISOString(
                            new Date(editingDetail.waktu_selesai)
                          ),
                        }
                      : undefined
                  }
                  isFirstDetail={laporan.details.length === 0}
                  previousWaktuSelesai={
                    !editingDetail && laporan.details.length > 0
                      ? toLocalISOString(
                          new Date(
                            laporan.details[
                              laporan.details.length - 1
                            ].waktu_selesai
                          )
                        )
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="report" className="w-full">
          {/* TODO: LaporanReport goes here */}
          <div className="py-8 text-center text-muted-foreground">
            Generate laporan di sini.
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={generateLaporanKendaraan}
          >
            <span className="flex items-center justify-center gap-2">
              <ChevronRight className="w-4 h-4" />
              Generate Laporan
            </span>
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaporanDetailPage;
