# DESIGN.md: Web Portofolio Neobrutalism

Dokumen ini adalah sumber kebenaran untuk tampilan dan struktur web portofolio. Baca seluruhnya sebelum menulis kode. Baca juga `SECURITY.md` dan `MCP-SETUP.md`. Kalau ada konflik, urutan prioritasnya: `SECURITY.md`, lalu dokumen ini, lalu preferensi pribadi agen.

## 0. Aturan yang tidak boleh dilanggar

1. **Jangan mengarang konten.** Semua data pribadi (nama, proyek, sertifikat, lomba, pengalaman, kontak, foto) harus berasal dari pemilik. Kalau belum ada, pakai placeholder yang jelas bertanda `{{ISI_SENDIRI}}` dan tanyakan ke pemilik. Dilarang membuat proyek, testimoni, sertifikat, atau angka fiktif.
2. **Jangan menyalin situs referensi.** Referensi dipakai untuk struktur dan inspirasi saja. Jangan menyalin teks, aset, ilustrasi, atau kode mentah dari situs orang lain tanpa memeriksa lisensinya.
3. **Semua konten pribadi tinggal di satu file data** (`src/data/profile.ts`), bukan tersebar di komponen. Mengganti isi tidak boleh membutuhkan edit komponen.
4. **Responsif dulu, desktop kemudian** (mobile-first). Ukuran uji minimum 360 px lebar.
5. **Aksesibilitas bukan opsional.** Gaya neobrutalism sering gagal di kontras dan fokus keyboard. Lihat bagian 5.

## 1. Apa itu "responsif"

Istilah yang dicari adalah **responsive design**: satu kode yang menyesuaikan tata letak dengan lebar layar, sehingga nyaman di HP, tablet, dan laptop tanpa membuat dua situs terpisah. Cara kerjanya di proyek ini: Tailwind breakpoint, grid dan flexbox yang fleksibel, ukuran font fluid, dan gambar yang menyesuaikan lebar.

## 2. Stack

| Bagian | Pilihan | Alasan |
|---|---|---|
| Build | Vite + React + TypeScript | Cepat, sederhana, cocok untuk situs satu halaman |
| Styling | Tailwind CSS | Dipakai oleh neobrutalism.dev dan shadcn |
| Komponen | shadcn/ui dengan styling neobrutalism.dev | Komponen salin-tempel, kode ada di repo sendiri, tidak ada paket UI besar |
| Ikon | `lucide-react` | Ringan, tree-shakeable |
| Animasi | `motion` (Framer Motion) secukupnya | Reveal saat scroll dan hover; hormati `prefers-reduced-motion` |
| Font | Self-host lewat `@fontsource` | Tanpa request ke Google Fonts, lebih cepat dan lebih privat |
| Deploy | Vercel (dari repo GitHub) | Sudah dipakai di proyek lain |
| Router | Tidak perlu | Satu halaman dengan anchor section |

Catatan untuk agen: verifikasi nama paket dan versi lewat registry sebelum memasang. Kalau sebuah paket tidak ditemukan, berhenti dan laporkan, jangan menebak nama pengganti.

### Setup awal (jalankan di folder kerja, misalnya `E:\portfolio`)

```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install
```

Lalu ikuti panduan resmi Tailwind untuk Vite dan inisialisasi shadcn. Untuk styling neobrutalism, halaman instalasi neobrutalism.dev menyebut perintah berikut untuk proyek baru:

```bash
pnpm dlx shadcn@latest init https://neobrutalism.dev/r/styling/blue.json
```

Versi `npx` setara kalau pnpm belum ada. `blue.json` adalah salah satu palet bawaan; pemilik boleh memilih palet lain di halaman styling mereka. Ada dua catatan:

- Perintah itu menjalankan kode dari URL eksternal. Jalankan hanya dari sumber resmi di atas, lalu periksa `git diff` hasilnya sebelum commit.
- Jika konflik dengan token warna di dokumen ini, **token di dokumen ini menang**, karena sudah diuji kontrasnya.

## 3. Referensi dan cara memakainya

| Referensi | Dipakai untuk | Jangan |
|---|---|---|
| neobrutalism.dev | Basis komponen (Button, Card, Badge, Input, Dialog, Tooltip, dan lain-lain) dan gaya dasar | Jangan menyalin komponen yang tidak dipakai |
| ikhsan3adi.is-a.dev | Urutan section dan pola penyajian konten | Jangan menyalin teks, desain persis, atau gambarnya |
| reactbits.dev (versi gratis) | Ide animasi kecil (marquee, text reveal) | Jangan memakai atau menyalin komponen dari `pro.reactbits.dev`; itu berbayar dan berlisensi |
| 21st.dev | Inspirasi komponen | Lisensi tiap komponen berbeda-beda, periksa sebelum memakai |
| neobrutalism.com | Inspirasi visual | Hanya referensi |

Peringatan gaya: animasi ReactBits cenderung halus dan kaca (glassy), sedangkan neobrutalism keras dan datar. Mencampur keduanya mudah menghasilkan tampilan yang tidak konsisten. Aturannya: neobrutalism.dev adalah basis, dan animasi tambahan hanya boleh yang cocok dengan gaya keras (gerak patah, offset, marquee, stamp, wiggle). Hindari blur, gradien lembut, dan glow.

Struktur ikhsan3adi yang dijadikan acuan (dibaca dari teks halamannya, bukan tampilannya): navigasi dengan anchor dan tombol dark mode, hero dengan dua tombol aksi, strip teks berulang bergaya marquee, tentang saya dengan galeri foto, daftar kategori portofolio, pencapaian (lomba dan kursus), daftar tools berkelompok, tautan sosial, kontak, dan footer. Situs itu dibuat dengan SvelteKit; proyek ini memakai React, jadi hanya konsepnya yang diadopsi.

## 4. Struktur halaman

Satu halaman, urutan section dari atas ke bawah. Setiap section punya `id` untuk anchor.

1. **Navbar** (sticky). Logo/nama, link anchor, tombol dark mode. Di HP: tombol menu yang membuka panel penuh, bukan deretan link yang menumpuk.
2. **Hero** (`#home`). Sapaan kecil, nama besar, satu kalimat peran, dua tombol: "Lihat proyek" dan "Hubungi saya". Satu elemen dekoratif (stiker atau bentuk geometris), jangan lebih.
3. **Marquee strip.** Satu baris frasa pendek yang bergerak, dipisahkan simbol. Berhenti saat `prefers-reduced-motion` aktif atau saat di-hover. Maksimal dua strip di seluruh halaman, supaya tidak jadi dekorasi berlebihan.
4. **Tentang** (`#about`). Dua sampai tiga paragraf pendek. Foto dalam bingkai tebal dengan sedikit rotasi. Tombol ke LinkedIn atau CV.
5. **Proyek** (`#projects`). Kartu proyek dalam grid. Tiap kartu: judul, deskripsi satu kalimat, tag teknologi, tautan demo dan repo. Ada filter kategori sederhana jika proyek lebih dari 6.
6. **Pencapaian** (`#achievements`). Lomba, kursus, sertifikat. Tiap item punya penerbit, tanggal, dan tautan kredensial yang bisa diverifikasi.
7. **Tools / Skills** (`#tools`). Dikelompokkan (misalnya Frontend, Backend, Data/AI, Tools lain). Gunakan badge, bukan bar persentase kemampuan; persentase tidak bermakna dan mudah dikritik.
8. **Kontak** (`#contact`). Tombol langsung (email, WhatsApp, LinkedIn, GitHub). Tanpa formulir bawaan di fase 1, lihat `SECURITY.md` bagian 4.
9. **Footer.** Hak cipta, tautan sosial, catatan "dibuat dengan React dan Tailwind", tautan repo.

Fase 2 (hanya setelah fase 1 selesai dan diterapkan): toggle bahasa ID/EN, halaman detail proyek, blog atau catatan, dan menyorot proyek skripsi.

## 5. Sistem desain

### 5.1 Prinsip neobrutalism yang dipakai

- Border hitam tebal (2 sampai 3 px) di semua elemen interaktif dan kartu.
- Bayangan keras tanpa blur, dengan offset tetap (contoh `4px 4px 0 0 var(--ink)`).
- Warna datar yang jenuh, dengan teks gelap di atasnya.
- Radius kecil atau nol. Pilih satu nilai dan konsisten.
- Tipografi tebal dan besar. Ukuran judul dibuat berani.
- Interaksi fisik: saat di-hover, elemen bergeser sedikit; saat ditekan, elemen "masuk" ke bayangannya.

### 5.2 Token warna

Rasio kontras di bawah dihitung dengan rumus WCAG 2.1. Hasilnya penting: **warna aksen hanya boleh dipakai sebagai latar dengan teks `--ink` di atasnya.** Sebagai teks di atas krem, kontrasnya hanya 1,35 sampai 2,86 (gagal AA).

Mode terang:

| Token | Nilai | Catatan |
|---|---|---|
| `--bg` | `#FFF8E7` | Latar halaman (krem) |
| `--ink` | `#111111` | Teks, border, bayangan. Kontras terhadap `--bg`: 17,83 |
| `--muted` | `#4A4A4A` | Teks sekunder. Kontras terhadap `--bg`: 8,37 |
| `--surface` | `#FFFFFF` | Kartu |
| `--yellow` | `#FFD43B` | Aksen utama. Teks ink di atasnya: 13,25 |
| `--pink` | `#FF8FB1` | Aksen. Teks ink: 8,83 |
| `--blue` | `#7CB9FF` | Aksen. Teks ink: 9,21 |
| `--green` | `#7EE0A0` | Aksen. Teks ink: 11,74 |
| `--orange` | `#FF9F5A` | Aksen. Teks ink: 9,31 |
| `--lilac` | `#C9B5FF` | Aksen. Teks ink: 10,37 |
| `--red` | `#FF5C5C` | Error dan peringatan. Teks ink: 6,24 |

Mode gelap (ditambahkan lewat kelas `dark` di `<html>`, bawaan mengikuti `prefers-color-scheme`, dan pilihan pengguna disimpan di `localStorage` dengan `try/catch`):

| Token | Nilai | Catatan |
|---|---|---|
| `--bg` | `#16161A` | Latar |
| `--ink` | `#F5F0E6` | Teks, border, dan bayangan di mode gelap. Kontras terhadap `--bg`: 15,89 |
| `--muted` | `#B8B2A6` | Teks sekunder. Kontras: 8,56 |
| `--surface` | `#22222A` | Kartu |
| Aksen | sama dengan mode terang | Tetap dengan teks `#111111` di atasnya, jadi kontrasnya sama seperti di tabel atas |

Aturan penting untuk mode gelap: teks di atas **aksen** tetap `#111111`, bukan `--ink` yang berubah menjadi terang. Siapkan token terpisah, `--on-accent: #111111`, dan pakai itu setiap kali teks berada di atas warna aksen.

Agen harus menjalankan ulang pemeriksaan kontras kalau menambah atau mengubah warna. Jangan memakai kombinasi yang belum dihitung.

### 5.3 Border, bayangan, radius

```css
:root {
  --border-w: 3px;
  --radius: 8px;            /* pilih satu dan konsisten; boleh 0 */
  --shadow-offset: 4px;
  --shadow: var(--shadow-offset) var(--shadow-offset) 0 0 var(--ink);
}
```

Pola interaksi untuk elemen yang bisa diklik:

- Normal: border `var(--border-w) solid var(--ink)`, `box-shadow: var(--shadow)`.
- Hover (hanya perangkat dengan hover, lihat 5.6): `transform: translate(-2px, -2px)`, bayangan 6px.
- Active: `transform: translate(4px, 4px)`, `box-shadow: none`.
- Durasi transisi 100 sampai 150 ms. Jangan lebih panjang; gerak harus terasa tajam.

### 5.4 Tipografi

- Heading: **Space Grotesk** (tebal, 700). Tubuh teks dan label: **Space Grotesk** 400 sampai 500, atau font sans lain yang jelas terbaca. Kode dan label teknis: **Space Mono** atau JetBrains Mono.
- Pasang lewat `@fontsource` (self-host), bukan CDN. Verifikasi nama paket saat memasang.
- Ukuran fluid dengan `clamp()`:

```css
h1 { font-size: clamp(2.5rem, 8vw, 6rem); line-height: 1; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.75rem, 5vw, 3.5rem); line-height: 1.05; }
body { font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); line-height: 1.6; }
```

- Ukuran teks tubuh minimal 16 px di HP. Jangan menurunkan di bawah itu.

### 5.5 Grid dan jarak

- Skala jarak: kelipatan 4 px (Tailwind default).
- Wadah konten: `max-w-6xl`, padding horizontal `px-4` di HP, `px-6` di tablet, `px-8` di desktop.
- Jarak antar section: `py-16` di HP, `py-24` di desktop.
- Grid proyek: 1 kolom (di bawah `sm`), 2 kolom (`md`), 3 kolom (`lg`).

### 5.6 Responsif: aturan teknis

Breakpoint Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Tulis gaya dasar untuk HP, lalu tambah awalan breakpoint untuk layar lebih besar.

Wajib:

- Tidak ada scroll horizontal di lebar 360 px. Periksa elemen yang melebar, terutama marquee, gambar, dan blok kode.
- Area sentuh minimal 44 x 44 px untuk tombol dan tautan.
- Hover tidak boleh menjadi satu-satunya cara mengakses informasi. Bungkus gaya hover dengan `@media (hover: hover)`.
- Navbar di HP menjadi menu yang bisa dibuka dan ditutup, bisa dipakai dengan keyboard, dan fokus berpindah dengan benar.
- Gambar memakai `srcset` atau `sizes`, `loading="lazy"` kecuali di atas lipatan, dan atribut `width` dan `height` untuk mencegah layout shift.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` harus ada. Jangan mematikan zoom pengguna.
- Gunakan unit `dvh` bukan `vh` untuk tinggi layar penuh di HP (bilah alamat browser mengubah tinggi `vh`).
- Hormati area aman (safe area) di perangkat dengan notch: `env(safe-area-inset-*)`.

### 5.7 Animasi

- Boleh: reveal saat scroll (geser pendek dan muncul), marquee, hover geser, stamp saat muncul.
- Dilarang: parallax berat, animasi yang memblokir interaksi, dan animasi yang berjalan terus tanpa jeda di banyak elemen sekaligus.
- Seluruh animasi non-esensial harus mati ketika `prefers-reduced-motion: reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

### 5.8 Aksesibilitas (target WCAG 2.1 AA)

- Kontras: ikuti tabel 5.2. Teks biasa minimal 4,5:1, teks besar dan komponen UI minimal 3:1.
- Fokus keyboard harus terlihat jelas: `outline: 3px solid var(--ink); outline-offset: 3px;` ditambah variasi warna kalau berada di atas latar gelap. Jangan `outline: none` tanpa pengganti.
- Semua elemen interaktif bisa dijangkau dengan Tab dalam urutan logis. Tambahkan tautan "Lewati ke konten" di awal.
- Gunakan elemen semantik (`header`, `nav`, `main`, `section`, `footer`, `button`, `a`). Satu `h1` saja.
- Gambar bermakna punya `alt`. Gambar dekoratif memakai `alt=""`.
- Jangan menyampaikan informasi hanya lewat warna.
- Marquee yang bergerak lebih dari 5 detik harus bisa dijeda.

## 6. Struktur proyek

```
portfolio/
  public/            favicon, og-image.png, robots.txt, sitemap.xml
  src/
    components/      ui/ (komponen shadcn), sections/ (Hero, About, Projects, ...)
    data/profile.ts  SEMUA konten pribadi
    styles/          globals.css (token, font)
    lib/
    main.tsx
  DESIGN.md  SECURITY.md  MCP-SETUP.md
  .env.example       hanya nama variabel, tanpa nilai
```

Bentuk `src/data/profile.ts` (isi nilai sendiri, jangan diganti agen tanpa konfirmasi):

```ts
export const profile = {
  name: "{{ISI_SENDIRI}}",
  role: "{{ISI_SENDIRI}}",
  tagline: "{{ISI_SENDIRI}}",
  about: ["{{ISI_SENDIRI}}"],
  links: { github: "", linkedin: "", email: "", whatsapp: "" },
  projects: [] as Array<{ title: string; summary: string; tags: string[]; demo?: string; repo?: string }>,
  achievements: [] as Array<{ title: string; issuer: string; date: string; url?: string }>,
  tools: {} as Record<string, string[]>,
};
```

## 7. SEO dan performa

- `<html lang="id">`, `<title>` dan `<meta name="description">` yang spesifik, Open Graph dan Twitter card dengan `og-image.png` 1200 x 630.
- `robots.txt` dan `sitemap.xml` sederhana.
- Target Lighthouse (mode mobile): Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. Ukur dengan Lighthouse atau Playwright; jangan klaim angka tanpa menjalankannya.
- Gambar dalam format WebP atau AVIF. Hindari gambar di atas 200 KB tanpa alasan.
- Hanya impor ikon dan komponen yang dipakai.

## 8. Urutan kerja untuk agen

Kerjakan per tahap. Setelah tiap tahap: jalankan `npm run build`, perbaiki error, lalu tunjukkan hasilnya ke pemilik sebelum lanjut.

1. **Setup**: Vite, Tailwind, shadcn, styling neobrutalism, font, token warna dari 5.2, struktur folder. Pastikan halaman kosong ber-build.
2. **Kerangka**: Navbar (termasuk versi HP), footer, dark mode, tautan lewati konten.
3. **Hero dan marquee**.
4. **Tentang dan Kontak** dengan data placeholder.
5. **Proyek dan Pencapaian** dengan kartu dan filter.
6. **Tools**.
7. **Poles**: animasi, aksesibilitas, SEO, performa.
8. **Verifikasi** lewat Playwright (lihat bagian 9), lalu persiapan deploy.

Sebelum tahap 1, tanyakan ke pemilik: nama, peran, tiga proyek terbaik beserta tautan, sertifikat atau lomba yang nyata, dan kontak yang boleh dipublikasikan. Kalau pemilik belum punya, lanjutkan dengan placeholder.

## 9. Pengujian

Gunakan Playwright MCP (lihat `MCP-SETUP.md`) pada dev server lokal. Uji minimal pada lebar berikut dan simpan tangkapan layar:

| Perangkat | Lebar x tinggi |
|---|---|
| HP kecil | 360 x 740 |
| HP umum | 390 x 844 |
| Tablet | 768 x 1024 |
| Laptop | 1280 x 800 |
| Layar lebar | 1920 x 1080 |

Daftar periksa per ukuran: tidak ada scroll horizontal, teks tidak terpotong, tombol bisa diklik, menu HP berfungsi, dark mode terbaca, fokus keyboard terlihat, tidak ada error di konsol.

Catatan: pengujian ini hanya memeriksa render di Chromium. Tampilan di Safari iOS dan HP sungguhan tetap perlu dicek manual oleh pemilik sebelum dianggap selesai.

## 10. Definisi selesai

- `npm run build` dan `npm run lint` bersih.
- `npm audit` tidak punya temuan high atau critical yang bisa diperbaiki (lihat `SECURITY.md`).
- Daftar periksa bagian 9 lulus di lima ukuran.
- Semua konten berasal dari pemilik atau placeholder yang jelas.
- Tidak ada rahasia di repo (lihat `SECURITY.md`).
