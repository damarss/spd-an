"use client";

import { useLaporanStore } from "@/stores/laporan-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import LaporanForm from "@/components/forms/laporan-form";
import { Plus, Search, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function LaporanPage() {
  const laporanList = useLaporanStore((state) => state.laporanList);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Handler for opening the sheet in add mode
  const handleAdd = () => {
    setIsOpen(true);
  };

  const filteredLaporan = laporanList.filter(
    (laporan) =>
      laporan.perihal.toLowerCase().includes(search.toLowerCase()) ||
      laporan.kecamatan_tujuan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-4 px-2 sm:px-4 py-4 w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 w-full sm:w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Laporan</span>
        </Button>
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-4 h-4" />
          </span>
          <Input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border border-muted-foreground/60 bg-background w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tambah Laporan</SheetTitle>
            <SheetDescription>
              Isikan data laporan yang akan ditambahkan.
            </SheetDescription>
          </SheetHeader>
          <LaporanForm onSuccess={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="grid md:grid-cols-2 gap-4">
        {filteredLaporan.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Belum ada laporan.
          </div>
        ) : (
          filteredLaporan.map((laporan) => (
            <Card
              key={laporan.id}
              className="h-full p-6 flex flex-col gap-2 border border-muted-foreground/10 shadow-sm transition-shadow bg-card min-w-[340px] max-w-full group hover:shadow-md hover:border-primary/40 rounded-2xl cursor-pointer"
              onClick={() => router.push(`/laporan/detail?id=${laporan.id}`)}
            >
              <div className="flex items-center justify-between mb-1">
                <div
                  className="font-semibold text-base truncate transition-colors"
                  title={laporan.perihal}
                >
                  {laporan.perihal}
                </div>
                <button
                  type="button"
                  className="p-1 rounded-full transition-colors bg-transparent group-hover:text-primary"
                  tabIndex={0}
                  aria-label="Lihat detail laporan"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </button>
              </div>
              <div className="text-sm text-muted-foreground mb-1 truncate">
                Tujuan: {laporan.kecamatan_tujuan}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Tanggal:{" "}
                {(() => {
                  const d =
                    laporan.tanggal_mulai instanceof Date
                      ? laporan.tanggal_mulai
                      : new Date(laporan.tanggal_mulai);
                  return d.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                })()}
                {" - "}
                {(() => {
                  const d =
                    laporan.tanggal_selesai instanceof Date
                      ? laporan.tanggal_selesai
                      : new Date(laporan.tanggal_selesai);
                  return d.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                })()}
              </div>
              {/* TODO: Add actions (edit/delete) and maybe details preview */}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
