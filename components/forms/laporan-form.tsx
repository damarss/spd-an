"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useKetuaTimStore } from "@/stores/ketua-tim-store";
import { useLaporanStore } from "@/stores/laporan-store";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    kecamatan_tujuan: z.string().min(1),
    tanggal_mulai: z.string().min(1),
    tanggal_selesai: z.string().min(1),
    perihal: z.string().min(1),
    id_ketua: z.number().optional(),
    is_spd: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.tanggal_mulai || !data.tanggal_selesai) return true;
      const mulai = new Date(data.tanggal_mulai);
      const selesai = new Date(data.tanggal_selesai);
      return mulai <= selesai;
    },
    {
      message: "Tanggal mulai tidak boleh melebihi tanggal selesai.",
      path: ["tanggal_mulai"],
    }
  )
  .refine(
    (data) => {
      if (!data.tanggal_mulai || !data.tanggal_selesai) return true;
      const mulai = new Date(data.tanggal_mulai);
      const selesai = new Date(data.tanggal_selesai);
      return selesai >= mulai;
    },
    {
      message: "Tanggal selesai tidak boleh kurang dari tanggal mulai.",
      path: ["tanggal_selesai"],
    }
  );

type LaporanFormProps = {
  laporanId?: number;
  onSuccess?: () => void;
  initialValues?: {
    kecamatan_tujuan: string;
    tanggal_mulai: Date;
    tanggal_selesai: Date;
    perihal: string;
    id_ketua: number;
    is_spd: boolean;
  };
  onSubmitAction?: (values: z.infer<typeof formSchema>) => void;
};

const LaporanForm: React.FC<LaporanFormProps> = ({
  laporanId,
  onSuccess,
  initialValues,
  onSubmitAction,
}) => {
  const ketuaList = useKetuaTimStore((state) => state.ketuaList);
  const { addLaporan, updateLaporan } = useLaporanStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          tanggal_mulai:
            typeof initialValues.tanggal_mulai === "string"
              ? initialValues.tanggal_mulai
              : initialValues.tanggal_mulai instanceof Date
              ? initialValues.tanggal_mulai.toISOString().slice(0, 10)
              : "",
          tanggal_selesai:
            typeof initialValues.tanggal_selesai === "string"
              ? initialValues.tanggal_selesai
              : initialValues.tanggal_selesai instanceof Date
              ? initialValues.tanggal_selesai.toISOString().slice(0, 10)
              : "",
          is_spd: initialValues.is_spd,
        }
      : {
          kecamatan_tujuan: "",
          tanggal_mulai: "",
          tanggal_selesai: "",
          perihal: "",
          id_ketua: undefined,
          is_spd: false,
        },
    mode: "onTouched",
  });

  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        ...initialValues,
        tanggal_mulai:
          typeof initialValues.tanggal_mulai === "string"
            ? initialValues.tanggal_mulai
            : initialValues.tanggal_mulai instanceof Date
            ? initialValues.tanggal_mulai.toISOString().slice(0, 10)
            : "",
        tanggal_selesai:
          typeof initialValues.tanggal_selesai === "string"
            ? initialValues.tanggal_selesai
            : initialValues.tanggal_selesai instanceof Date
            ? initialValues.tanggal_selesai.toISOString().slice(0, 10)
            : "",
        is_spd: initialValues.is_spd ?? false,
      });
    }
  }, [initialValues, form]);

  const [open, setOpen] = React.useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!values.id_ketua) {
        form.setError("id_ketua", { message: "Pilih ketua tim" });
        return;
      }
      if (onSubmitAction) {
        onSubmitAction(values);
        toast.success("Laporan berhasil disimpan.");
      } else if (laporanId) {
        // updateLaporan logic here
        updateLaporan(laporanId, {
          kecamatan_tujuan: values.kecamatan_tujuan,
          tanggal_mulai: new Date(values.tanggal_mulai),
          tanggal_selesai: new Date(values.tanggal_selesai),
          perihal: values.perihal,
          id_ketua: values.id_ketua as number,
          is_spd: values.is_spd,
          details:
            useLaporanStore
              .getState()
              .laporanList.find((l) => l.id === laporanId)
              ?.details.concat() || [],
        });
        toast.success("Laporan berhasil diperbarui.");
      } else {
        addLaporan({
          ...values,
          id_ketua: values.id_ketua as number, // ensure id_ketua is number
          tanggal_mulai: new Date(values.tanggal_mulai),
          tanggal_selesai: new Date(values.tanggal_selesai),
          is_spd: values.is_spd,
          details: [], // required by Laporan type
        });
        toast.success("Laporan berhasil ditambahkan.");
      }
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan laporan.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-4">
        <FormField
          control={form.control}
          name="perihal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perihal</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Survei Sosial Ekonomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kecamatan_tujuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kecamatan Tujuan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Kecamatan Biau" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="tanggal_mulai"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Tanggal Mulai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal_selesai"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Tanggal Selesai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!initialValues && (
            <Button
              type="button"
              variant="outline"
              className="h-10 px-3 whitespace-nowrap mb-2"
              onClick={() => {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, "0");
                const dd = String(today.getDate()).padStart(2, "0");
                const todayStr = `${yyyy}-${mm}-${dd}`;
                form.setValue("tanggal_mulai", todayStr, {
                  shouldValidate: true,
                });
                form.setValue("tanggal_selesai", todayStr, {
                  shouldValidate: true,
                });
              }}
            >
              Gunakan tanggal hari ini
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name="id_ketua"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ketua Tim</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between flex items-center"
                  >
                    <span>
                      {ketuaList.find((k) => k.id === field.value)?.nama ||
                        "Pilih Ketua Tim"}
                    </span>
                    <ChevronDown className="ml-2 w-4 h-4 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari ketua tim..." />
                    <CommandList>
                      {ketuaList.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Belum ada ketua tim
                        </div>
                      ) : (
                        ketuaList.map((k) => (
                          <CommandItem
                            key={k.id}
                            value={k.nama}
                            onSelect={() => {
                              field.onChange(k.id);
                              setOpen(false);
                            }}
                          >
                            {k.nama}
                          </CommandItem>
                        ))
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_spd"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="is_spd"
                />
              </FormControl>
              <FormLabel htmlFor="is_spd" className="mb-0 cursor-pointer">
                Centang jika minimal 8 jam
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="py-5 w-full">
          {initialValues ? "Simpan" : "Tambah"}
        </Button>
      </form>
    </Form>
  );
};

export default LaporanForm;
