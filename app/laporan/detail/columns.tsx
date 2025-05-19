"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

// This type is used to define the shape of our data.
export type LaporanDetail = {
  id: number;
  uraian: string;
  waktu_mulai: Date;
  waktu_selesai: Date;
};

export const columns: ColumnDef<LaporanDetail>[] = [
  {
    accessorKey: "waktu_mulai",
    header: "Waktu Mulai",
    cell: ({ row }) =>
      new Date(row.original.waktu_mulai).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "waktu_selesai",
    header: "Waktu Selesai",
    cell: ({ row }) =>
      new Date(row.original.waktu_selesai).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "uraian",
    header: "Uraian",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate" title={row.original.uraian}>
        {row.original.uraian}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const detail = row.original;
      const meta = table.options.meta as {
        onEdit: (detail: LaporanDetail) => void;
        onDelete: (detail: LaporanDetail) => void;
      };
      return (
        <div className="flex flex-nowrap gap-1 min-w-[140px]">
          <Button
            size="sm"
            variant="outline"
            onClick={() => meta?.onEdit?.(detail)}
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => meta?.onDelete?.(detail)}
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus</span>
          </Button>
        </div>
      );
    },
  },
];
