"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCekIdentitas } from "@/hooks/use-identitas";
import { toast } from "sonner";
import { useIdentitasStore } from "@/stores/identitas-store";

export default function IdentitasGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isIdentitasFilled = useCekIdentitas();
  const hasHydrated = useIdentitasStore((state) => state.hasHydrated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      hasHydrated &&
      isIdentitasFilled === false &&
      pathname !== "/identitas"
    ) {
      router.replace("/identitas");
      toast.error("Silakan lengkapi identitas Anda terlebih dahulu.");
    }
  }, [isIdentitasFilled, pathname, router, hasHydrated]);

  // Only render after hydration
  if (!hasHydrated) return null;

  return <>{children}</>;
}
