"use client";

import KetuaTimForm from "@/components/forms/ketua-tim-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useKetuaTimStore } from "@/stores/ketua-tim-store";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import type { KetuaTim } from "./columns";
import { Plus } from "lucide-react";

export default function KetuaTimPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const ketuaList = useKetuaTimStore((state) => state.ketuaList);
  const { updateKetuaTim, deleteKetuaTim } = useKetuaTimStore();

  // Handler for opening the sheet in edit mode
  const handleEdit = (ketua: KetuaTim) => {
    setEditId(ketua.id);
    setIsOpen(true);
  };

  // Handler for opening the sheet in add mode
  const handleAdd = () => {
    setEditId(null);
    setIsOpen(true);
  };

  // Handler for deleting (open dialog)
  const handleDelete = (ketua: KetuaTim) => {
    setDeleteId(ketua.id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteKetuaTim(deleteId);
    }
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  // Get initial values for edit
  const initialValues =
    editId !== null && ketuaList.find((k) => k.id === editId)
      ? ketuaList.find((k) => k.id === editId)
      : undefined;

  // Submit action for edit
  const onSubmitAction = (values: {
    id?: number;
    nama: string;
    jabatan: string;
    nip: string;
  }) => {
    if (editId !== null) {
      updateKetuaTim(editId, values);
    }
  };

  return (
    <div className="flex flex-col space-y-4 px-2 sm:px-4 py-4 w-full mx-auto">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 w-full sm:w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Ketua Tim</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editId !== null ? "Edit Ketua Tim" : "Tambah Ketua Tim"}
            </SheetTitle>
            <SheetDescription>
              {editId !== null
                ? "Edit data ketua tim."
                : "Isikan data ketua tim yang akan ditambahkan."}
            </SheetDescription>
          </SheetHeader>
          <KetuaTimForm
            onSuccess={() => setIsOpen(false)}
            initialValues={initialValues}
            onSubmitAction={editId !== null ? onSubmitAction : undefined}
          />
        </SheetContent>
      </Sheet>
      <div className="w-full overflow-x-auto">
        <DataTable
          columns={columns}
          data={ketuaList}
          meta={{
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
        />
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        {/* Custom backdrop for blur and overlay */}
        {showDeleteDialog && (
          <div
            className="fixed inset-0 z-40 h-full w-full bg-black/30 backdrop-blur-sm transition-all"
            aria-hidden="true"
          ></div>
        )}
        <DialogContent className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-lg flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Hapus Laporan?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4 w-full">
            <Button variant="outline" onClick={cancelDelete}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
