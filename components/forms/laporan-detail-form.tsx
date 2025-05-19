import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLaporanStore } from "@/stores/laporan-store";
import { toast } from "sonner";

const detailSchema = z
  .object({
    uraian: z.string().min(1, "Uraian wajib diisi"),
    waktu_mulai: z.string().min(1, "Waktu mulai wajib diisi"),
    waktu_selesai: z.string().min(1, "Waktu selesai wajib diisi"),
  })
  .refine(
    (data) => {
      if (!data.waktu_mulai || !data.waktu_selesai) return true;
      return new Date(data.waktu_mulai) <= new Date(data.waktu_selesai);
    },
    {
      message: "Waktu mulai tidak boleh melebihi waktu selesai.",
      path: ["waktu_mulai"],
    }
  );

type LaporanDetailFormProps = {
  laporanId: number;
  onSuccess?: () => void;
  initialValues?: {
    uraian: string;
    waktu_mulai: string;
    waktu_selesai: string;
  };
  isEditing?: boolean;
  detailId?: number;
  previousWaktuSelesai?: string; // <-- Tambahkan prop ini
  isFirstDetail?: boolean; // <-- Tambahkan prop ini
};

const LaporanDetailForm: React.FC<LaporanDetailFormProps> = ({
  laporanId,
  onSuccess,
  initialValues,
  isEditing,
  detailId,
  previousWaktuSelesai,
  isFirstDetail,
}) => {
  const addLaporanDetail = useLaporanStore((state) => state.addLaporanDetail);
  const updateLaporanDetail = useLaporanStore(
    (state) => state.updateLaporanDetail
  );

  const form = useForm<z.infer<typeof detailSchema>>({
    resolver: zodResolver(detailSchema),
    defaultValues: initialValues || {
      uraian: "",
      waktu_mulai: isFirstDetail ? "" : previousWaktuSelesai || "",
      waktu_selesai: "",
    },
  });

  // Always set waktu_mulai to previousWaktuSelesai for non-first detail and not editing
  useEffect(() => {
    if (!isEditing && !isFirstDetail && previousWaktuSelesai) {
      form.setValue("waktu_mulai", previousWaktuSelesai, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, isFirstDetail, previousWaktuSelesai]);

  async function onSubmit(values: z.infer<typeof detailSchema>) {
    try {
      if (isEditing && detailId !== undefined) {
        updateLaporanDetail(laporanId, detailId, {
          uraian: values.uraian,
          waktu_mulai: new Date(values.waktu_mulai),
          waktu_selesai: new Date(values.waktu_selesai),
        });
        toast.success("Detail laporan berhasil diperbarui.");
      } else {
        addLaporanDetail(laporanId, {
          uraian: values.uraian,
          waktu_mulai: new Date(values.waktu_mulai),
          waktu_selesai: new Date(values.waktu_selesai),
        });
        toast.success("Detail laporan berhasil ditambahkan.");
        form.reset();
      }
      if (onSuccess) onSuccess();
    } catch (e) {
      toast.error(
        isEditing
          ? "Gagal memperbarui detail laporan."
          : "Gagal menambahkan detail laporan."
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="waktu_mulai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu Mulai</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={!isFirstDetail && !isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="waktu_selesai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu Selesai</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="uraian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uraian</FormLabel>
              <FormControl>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Uraian kegiatan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-fit">
          Simpan
        </Button>
      </form>
    </Form>
  );
};

export default LaporanDetailForm;
