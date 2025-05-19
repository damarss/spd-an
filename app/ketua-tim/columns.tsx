"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

// This type is used to define the shape of our data.
export type KetuaTim = {
  id: number;
  nama: string;
  jabatan: string;
  nip: string;
};

export const columns: ColumnDef<KetuaTim>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
  },
  {
    accessorKey: "nip",
    header: "NIP",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const ketua = row.original;
      const meta = table.options.meta as {
        onEdit: (ketua: KetuaTim) => void;
        onDelete: (ketua: KetuaTim) => void;
      };
      return (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => meta?.onEdit?.(ketua)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => meta?.onDelete?.(ketua)}>
            <Trash2 className="w-4 h-4 mr-1" /> Hapus
          </Button>
        </div>
      );
    },
  },
];
