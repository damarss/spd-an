import createReport from "docx-templates";

export async function generateLaporanKendaraan() {
  const template = await fetch(
    "/spd-an/templates/pernyataan-tidak-menggunakan-kendaraan-dinas.docx"
  );
  const templateArrayBuffer = await template.arrayBuffer();
  const templateUint8Array = new Uint8Array(templateArrayBuffer);

  const report = await createReport({
    template: templateUint8Array,
    data: {
      nama: "Damar Septianugraha",
      nip: "200309282024121003",
      pangkat_golongan: "III/a",
      jabatan: "Pranata Komputer Ahli Pertama",
      unit_kerja: "BPS Kabupaten Buol",
      perihal: "Pengawasan Susenas Maret 2025",
      tanggal_kegiatan: "12 Februari 2025",
    },
    cmdDelimiter: ["{", "}"],
  });

  // Automatically trigger download in browser
  const blob = new Blob([report], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laporan-kendaraan.docx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
