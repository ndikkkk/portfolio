import { profile } from "@/data/profile";
import TextLoop from "@/components/ui/TextLoop";

// Semua ukuran di bawah dalam satuan viewBox TextLoop (1200 x 520). SVG dirender selebar pita,
// jadi ukuran di layar ikut skala dan proporsinya sama di lebar mana pun.
// Pita setinggi 1/12 lebar layar hanya menampilkan 100 unit viewBox di tengah (y 210 sampai 310),
// jadi angka di sini dihitung agar huruf dan gelombang pas di dalam 100 unit itu.
const FONT_SIZE = 34;
// Puncak gelombang = curviness * 1.1 unit viewBox (kurva kuadratik hanya sampai setengah jarak ke
// titik kontrolnya, lihat buildPath di TextLoop.tsx). 16 memberi puncak 17,6 unit, jadi jalur
// bergerak di y 232,4 sampai 267,6 dan huruf setinggi 24,5 unit memakai y 220 sampai 280.
// Sisa 10 unit kuning di atas dan di bawah, sama seperti contoh.
const CURVINESS = 16;
// Satu gelombang penuh 420 unit, jadi sekitar tiga bukit sepanjang layar, sama seperti contoh.
const WAVE_LENGTH = 420;

// Marquee strip memakai TextLoop (adaptasi React Bits) di posisi yang sama seperti sebelumnya:
// tepat di bawah Hero dan di atas Tentang. Animasi CSS lama dihapus karena loop kini dijalankan komponen.
export function Marquee() {
  return (
    <div className="border-y-[var(--border-w)] border-ink bg-yellow text-on-accent">
      {/* Teks bergerak diulang terus, jadi versi visual ditandai dekoratif dan isinya disediakan
          sekali untuk pembaca layar lewat daftar sr-only di bawah. */}
      <ul className="sr-only">
        {profile.marquee.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* Tinggi pita 1/12 lebar layar, sama seperti contoh. Karena SVG lebarnya 100% kontainer,
          ukuran teks ikut skala (34 dari 1200 unit = 2,8 persen lebar), jadi proporsi terjaga di
          lebar mana pun dan teks tidak pernah terpotong. Bentuk "wave" membuat jalur huruf naik
          turun seperti pembatas bergelombang antara Hero dan Tentang. */}
      <div aria-hidden="true" className="flex aspect-[12/1] items-center overflow-hidden">
        <TextLoop
          text={`${profile.marquee.join(" ✦ ")} ✦`}
          shape="wave"
          speed={80}
          direction="reverse"
          // Pemisah sudah ada di dalam text lewat join, jadi pemisah bawaan dimatikan
          // supaya titik sambungan loop tidak menampilkan dua bintang berderet.
          separator=""
          curviness={CURVINESS}
          waveLength={WAVE_LENGTH}
          fontSize={FONT_SIZE}
          fontWeight={800}
          letterSpacing={1}
          uppercase
          ribbon={false}
          color="currentColor"
          draggable={false}
          pauseOnHover
        />
      </div>
    </div>
  );
}
