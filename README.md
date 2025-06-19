# SPD-an

SPD-an adalah aplikasi web untuk membantu pembuatan laporan perjalanan dinas (SPD) dengan mudah, cepat, dan terstruktur. Aplikasi ini memudahkan pengguna dalam mengisi data identitas, membuat laporan, serta mengelola dokumen perjalanan dinas secara digital.

## Fitur Utama

- Pembuatan laporan perjalanan dinas secara otomatis

## Instalasi

1. Clone repository ini:
   ```sh
   git clone <repo-url>
   cd spd-an
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Jalankan aplikasi secara lokal:
   ```sh
   pnpm dev
   ```
4. Buka browser dan akses `http://localhost:3000`

## Struktur Folder

- `app/` — Halaman Next.js dan entry point aplikasi
- `components/` — Komponen UI dan logic aplikasi
- `hooks/` — Custom React hooks
- `lib/` — Library utilitas

## Cara Penggunaan

1. Isi identitas dan jabatan pada halaman identitas.
2. Navigasi ke halaman laporan untuk membuat laporan perjalanan dinas.
3. Data akan tersimpan secara otomatis di browser.
4. Gunakan sidebar untuk berpindah antar halaman.

## Teknologi

- Next.js
- React
- Tailwind CSS
- Zustand

## TODO

- [x] Upgrade state management menggunakan zustand
- [x] Fitur manage ketua tim
- [x] Fitur manage laporan dan input detail laporan
- [ ] Export laporan ke Word/PDF
