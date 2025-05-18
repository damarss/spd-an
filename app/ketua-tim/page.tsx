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
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import type { KetuaTim } from "./columns";

export default function KetuaTimPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const ketuaList = useKetuaTimStore((state) => state.ketuaList);
  const { updateKetuaTim, deleteKetuaTim } = useKetuaTimStore();

  // Handler for opening the sheet in edit mode
  const handleEdit = (ketua: KetuaTim, index: number) => {
    setEditIndex(index);
    setIsOpen(true);
  };

  // Handler for opening the sheet in add mode
  const handleAdd = () => {
    setEditIndex(null);
    setIsOpen(true);
  };

  // Handler for deleting (open dialog)
  const handleDelete = (_ketua: KetuaTim, index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteIndex !== null) {
      deleteKetuaTim(deleteIndex);
    }
    setShowDeleteDialog(false);
    setDeleteIndex(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteIndex(null);
  };

  // Get initial values for edit
  const initialValues =
    editIndex !== null && ketuaList[editIndex]
      ? ketuaList[editIndex]
      : undefined;

  // Submit action for edit
  const onSubmitAction = (values: KetuaTim) => {
    if (editIndex !== null) {
      updateKetuaTim(editIndex, values);
    }
  };

  return (
    <div className="flex flex-col space-y-4 px-2 sm:px-4 py-4 w-full mx-auto">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button onClick={handleAdd} className="w-full sm:w-fit">
            Tambah Ketua Tim
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editIndex !== null ? "Edit Ketua Tim" : "Tambah Ketua Tim"}
            </SheetTitle>
            <SheetDescription>
              {editIndex !== null
                ? "Edit data ketua tim."
                : "Isikan data ketua tim yang akan ditambahkan."}
            </SheetDescription>
          </SheetHeader>
          <KetuaTimForm
            onSuccess={() => setIsOpen(false)}
            initialValues={initialValues}
            onSubmitAction={editIndex !== null ? onSubmitAction : undefined}
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
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all"
            aria-hidden="true"
          ></div>
        )}
        <DialogContent className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
          <DialogTitle className="text-lg font-semibold mb-2 text-center">
            Konfirmasi Hapus
          </DialogTitle>
          <div className="mb-6 text-center">
            Apakah Anda yakin ingin menghapus ketua tim ini?
          </div>
          <div className="flex gap-2 mt-2 justify-center w-full">
            <Button variant="outline" onClick={cancelDelete} type="button">
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete} type="button">
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
