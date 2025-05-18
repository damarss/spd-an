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

const formSchema = z
  .object({
    kecamatan_tujuan: z.string().min(1),
    tanggal_mulai: z.string().min(1),
    tanggal_selesai: z.string().min(1),
    perihal: z.string().min(1),
    id_ketua: z.number().optional(),
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
  onSuccess?: () => void;
  initialValues?: {
    kecamatan_tujuan: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    perihal: string;
    id_ketua: number;
  };
  onSubmitAction?: (values: z.infer<typeof formSchema>) => void;
};

const LaporanForm: React.FC<LaporanFormProps> = ({
  onSuccess,
  initialValues,
  onSubmitAction,
}) => {
  const ketuaList = useKetuaTimStore((state) => state.ketuaList);
  const { addLaporan, updateLaporan } = useLaporanStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      kecamatan_tujuan: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      perihal: "",
      id_ketua: undefined, // do not select by default
    },
    mode: "onTouched",
  });

  React.useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
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
      } else if (initialValues) {
        // updateLaporan logic here if needed
      } else {
        addLaporan({
          ...values,
          id_ketua: values.id_ketua as number, // ensure id_ketua is number
          tanggal_mulai: new Date(values.tanggal_mulai),
          tanggal_selesai: new Date(values.tanggal_selesai),
          details: [], // required by Laporan type
        });
      }
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      // handle error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-4">
        <FormField
          control={form.control}
          name="kecamatan_tujuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kecamatan Tujuan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Biau" {...field} />
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
        </div>
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
        <Button type="submit" className="w-full">
          {initialValues ? "Simpan" : "Tambah"}
        </Button>
      </form>
    </Form>
  );
};

export default LaporanForm;
