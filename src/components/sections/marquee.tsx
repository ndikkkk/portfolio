import { profile } from "@/data/profile";
import TextLoop from "@/components/ui/TextLoop";

// Ukuran teks dalam satuan viewBox TextLoop (1200 x 520). Setengah dari nilai sebelumnya (60)
// supaya ada ruang vertikal untuk gelombang dan huruf tidak terpotong tepi pita.
const FONT_SIZE = 30;
// Puncak gelombang = curviness * 2.2 / 2 unit viewBox (kurva kuadratik hanya mencapai setengah
// jarak ke titik kontrolnya, lihat buildPath di TextLoop.tsx). Dengan 22 puncaknya 24 unit.
// Pita setinggi 1/12 lebar hanya menampilkan 100 unit viewBox di tengah, jadi teks 30 unit plus
// gelombang 2 x 24 unit masih menyisakan sekitar 15 unit kosong di atas dan di bawah.
const CURVINESS = 22;
// Panjang satu gelombang penuh. 300 unit berarti sekitar empat gelombang sepanjang viewBox,
// cukup rapat untuk terbaca sebagai pembatas bergelombang, bukan riak landai.
const WAVE_LENGTH = 300;

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

      {/* Tinggi band 1/12 lebar. Karena SVG lebarnya 100% kontainer, ukuran teks ikut skala
          (30 dari 1200 unit = 2,5 persen lebar), jadi proporsi terjaga dan teks tidak pernah
          terpotong di lebar mana pun. Bentuk "wave" membuat jalur huruf naik turun seperti
          pembatas bergelombang antara Hero dan Tentang. */}
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
          fontWeight={700}
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
