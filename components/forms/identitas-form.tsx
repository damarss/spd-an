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
import { db, Identitas } from "@/lib/db";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nama: z.string().min(1),
  jabatan: z.string().min(1),
});

const getIdentitas = async () => {
  const id = await db.identitas.toArray();
  if (id.length > 0) {
    return id[0];
  }

  return null;
};

const IdentitasForm = () => {
  const [identitas, setIdentitas] = React.useState<Identitas | null>(null);
  const [identitasId, setIdentitasId] = React.useState<number | undefined>(
    undefined
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      jabatan: "",
    },
  });

  const fetchIdentitas = React.useCallback(async () => {
    const data = await getIdentitas();
    if (data) {
      setIdentitas(data);
      setIdentitasId(data.id); // store id for update
      form.reset({
        nama: data.nama || "",
        jabatan: data.jabatan || "",
      });
    } else {
      setIdentitas(null);
      setIdentitasId(undefined);
      form.reset({ nama: "", jabatan: "" });
    }
  }, [form]);

  React.useEffect(() => {
    fetchIdentitas();
  }, [fetchIdentitas]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { nama, jabatan } = values;
      if (identitasId !== undefined) {
        // Update existing identitas
        await db.identitas.update(identitasId, { nama, jabatan });
        toast.success("Identitas berhasil diperbarui.");
      } else {
        // Insert new identitas
        await db.identitas.add({ nama, jabatan });
        toast.success("Identitas berhasil disimpan.");
      }
      // Force browser reload to ensure all state is updated
      window.location.reload();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh pengisian: Prajaka, S.Tr.Stat"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Masukkan nama lengkap anda beserta gelar
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
                  placeholder="Contoh: Statistisi Ahli Pertama"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Masukkan Jabatan Anda</FormDescription>
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
