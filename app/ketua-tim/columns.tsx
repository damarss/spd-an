"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

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
          <Button
            className="cursor-pointer text-sm bg-primary text-primary-foreground hover:bg-primary/90 min-w-[64px]"
            onClick={() => meta?.onEdit?.(ketua)}
          >
            Edit
          </Button>
          <Button
            className="cursor-pointer text-sm !text-primary-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90 min-w-[64px]"
            onClick={() => meta?.onDelete?.(ketua)}
          >
            Hapus
          </Button>
        </div>
      );
    },
  },
];
