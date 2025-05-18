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
import { useIdentitasStore } from "@/stores/identitas-store";

const formSchema = z.object({
  nama: z.string().min(1).min(3).max(64),
  nip: z.string().min(1).min(18).max(18),
  pangkat_golongan: z.string().min(1),
  jabatan: z.string().min(1).min(3).max(64),
  unit_kerja: z.string().min(1).min(3).max(64),
});

const IdentitasForm = () => {
  const {
    nama,
    nip,
    pangkat_golongan,
    jabatan,
    unit_kerja,
    setIdentitas,
    hasHydrated,
  } = useIdentitasStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: nama,
      nip: nip,
      pangkat_golongan: pangkat_golongan,
      jabatan: jabatan,
      unit_kerja: unit_kerja,
    },
  });

  React.useEffect(() => {
    form.reset({ nama, nip, pangkat_golongan, jabatan, unit_kerja });
  }, [nama, nip, pangkat_golongan, jabatan, unit_kerja, form]);

  if (!hasHydrated) return null; // or a loading spinner

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIdentitas({ ...values, hasHydrated });
      toast.success("Identitas berhasil disimpan.");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
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
                Masukkan nama lengkap Anda beserta gelar
              </FormDescription>
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
              <FormDescription>Masukkan NIP 18 digit Anda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pangkat_golongan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pangkat/Golongan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: III/a" type="text" {...field} />
              </FormControl>
              <FormDescription>Masukkan pangkat/golongan Anda</FormDescription>
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
                  placeholder="Contoh: Pranata Komputer Ahli Pertama"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Masukkan jabatan Anda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_kerja"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Kerja</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: BPS Kabupaten Buol"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Masukkan unit kerja Anda</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Simpan</Button>
      </form>
    </Form>
  );
};

export default IdentitasForm;
