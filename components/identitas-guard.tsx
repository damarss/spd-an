"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCekIdentitas } from "@/hooks/use-identitas";
import { toast } from "sonner";

export default function IdentitasGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isIdentitasFilled = useCekIdentitas();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isIdentitasFilled === false && pathname !== "/identitas") {
      router.replace("/identitas");
      toast.error("Silakan lengkapi identitas Anda terlebih dahulu.");
    }
  }, [isIdentitasFilled, pathname, router]);

  // Optionally, show a loading state while checking
  if (isIdentitasFilled === undefined) return null;

  return <>{children}</>;
}
