"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
export type KetuaTim = {
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
      // Get handlers from table.options.meta
      const meta = table.options.meta as {
        onEdit: (ketua: KetuaTim, index: number) => void;
        onDelete: (ketua: KetuaTim, index: number) => void;
      };
      return (
        <div className="flex gap-2">
          <button
            className="cursor-pointer px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => meta?.onEdit?.(ketua, row.index)}
            type="button"
          >
            Edit
          </button>
          <button
            className="cursor-pointer px-2 py-1 text-xs rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => meta?.onDelete?.(ketua, row.index)}
            type="button"
          >
            Hapus
          </button>
        </div>
      );
    },
  },
];
