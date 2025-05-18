"use client";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useKetuaTimStore } from "@/stores/ketua-tim-store";

const formSchema = z.object({
  nama: z.string().min(1).min(3).max(64),
  jabatan: z.string().min(1).min(3).max(64),
  nip: z.string().min(1).min(18).max(18),
});

const KetuaTimForm = ({
  onSuccess,
  initialValues,
  onSubmitAction,
}: {
  onSuccess?: () => void;
  initialValues?: { nama: string; jabatan: string; nip: string };
  onSubmitAction?: (values: {
    nama: string;
    jabatan: string;
    nip: string;
  }) => void;
}) => {
  const { addKetuaTim, updateKetuaTim } = useKetuaTimStore();
  const isEdit = Boolean(initialValues);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      nama: "",
      jabatan: "",
      nip: "",
    },
  });

  React.useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (onSubmitAction) {
        onSubmitAction(values);
      } else if (isEdit && initialValues) {
        // You need to pass the index or id for update in your usage
        // updateKetuaTim(index, values);
      } else {
        addKetuaTim(values);
      }
      toast.success(
        isEdit
          ? "Ketua tim berhasil diperbarui."
          : "Ketua tim berhasil ditambahkan."
      );
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-4 py-10"
      >
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Prajaka, S.Tr.Stat"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Masukkan nama lengkap ketua tim beserta gelar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jabatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Ketua Tim Sosial, Kepala BPS Kabupaten Buol"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Masukkan jabatan ketua tim</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input
                  placeholder="19xxxxxxxxxxxxxxxx"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Masukkan NIP 18 digit ketua tim</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
      </form>
    </Form>
  );
};

export default KetuaTimForm;
