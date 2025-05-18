import { useIdentitasStore } from "@/stores/identitas-store";

export function useCekIdentitas() {
  const { nama, nip, pangkat_golongan, jabatan, unit_kerja, hasHydrated } =
    useIdentitasStore();
  if (!hasHydrated) return undefined; // or null, or a loading state
  const isIdentitasFilled = Boolean(
    nama && nip && pangkat_golongan && jabatan && unit_kerja
  );
  return isIdentitasFilled;
}
