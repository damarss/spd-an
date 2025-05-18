"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LaporanForm from "@/components/forms/laporan-form";
// import LaporanDetailForm from "@/components/forms/laporan-detail-form"; // to be created
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

type Props = {};

const LaporanDetailPage = (props: Props) => {
  const searchParams = useSearchParams();
  const laporanId = Number(searchParams.get("id"));
  const laporan = useLaporanStore((state) =>
    state.laporanList.find((l) => l.id === laporanId)
  );
  const [tab, setTab] = React.useState("edit");
  const [openDialog, setOpenDialog] = React.useState(false);
  const router = require("next/navigation").useRouter();
  const deleteLaporan = useLaporanStore((state) => state.deleteLaporan);

  const handleDelete = () => {
    if (!laporan) return;
    deleteLaporan(laporan.id);
    router.push("/laporan");
  };

  if (!laporan) {
    return (
      <div className="text-center py-12 text-destructive">
        Laporan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Detail Laporan</h2>
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
        <TabsList className="flex justify-between w-full mb-6 bg-transparent gap-2">
          <TabsTrigger
            value="edit"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            <span className="font-bold mr-2">1</span> Edit Laporan
          </TabsTrigger>
          <TabsTrigger
            value="detail"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            <span className="font-bold mr-2">2</span> Isi Detail
          </TabsTrigger>
          <TabsTrigger
            value="report"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
          >
            <span className="font-bold mr-2">3</span> Generate Laporan
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
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
            }}
          />
        </TabsContent>
        <TabsContent value="detail">
          {/* TODO: LaporanDetailForm goes here */}
          <div className="py-8 text-center text-muted-foreground">
            Isi detail laporan di sini.
          </div>
        </TabsContent>
        <TabsContent value="report">
          {/* TODO: LaporanReport goes here */}
          <div className="py-8 text-center text-muted-foreground">
            Generate laporan di sini.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaporanDetailPage;
