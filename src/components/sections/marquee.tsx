import { profile } from "@/data/profile";
import TextLoop from "@/components/ui/TextLoop";

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

      {/* Tinggi band 1/12 lebar. Karena SVG lebarnya 100% kontainer, ukuran teks ikut skala (60 dari 1200
          unit = 5 persen lebar) sehingga proporsi terjaga dan teks tidak pernah terpotong di lebar mana pun. */}
      <div aria-hidden="true" className="flex aspect-[12/1] items-center overflow-hidden">
        <TextLoop
          text={`${profile.marquee.join(" ✦ ")} ✦`}
          shape="line"
          speed={80}
          direction="reverse"
          // Pemisah sudah ada di dalam text lewat join, jadi pemisah bawaan dimatikan
          // supaya titik sambungan loop tidak menampilkan dua bintang berderet.
          separator=""
          fontSize={60}
          fontWeight={700}
          letterSpacing={2}
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
