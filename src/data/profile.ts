export interface Project {
  title: string;
  summary: string;
  tags: string[];
  demo?: string;
  repo?: string;
}

export interface Achievement {
  title: string;
  issuer?: string;
  date?: string;
  url?: string;
  image?: string;
  year?: string;
  credentialId?: string;
  validUntil?: string;
  category?: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  photo?: string;
  openingPhoto?: string;
  photoPixel?: string;
  about: string[];
  marquee: string[];
  links: {
    github: string;
    linkedin: string;
    email: string;
    instagram: string;
    whatsapp: string;
  };
  whatsappChatMessage: string;
  projects: Project[];
  achievements: Achievement[];
  tools: Record<string, string[]>;
}

export const profile: Profile = {
  name: "Andhikaalvn",
  photo: "/photos/portrait.webp",
  openingPhoto: "/photos/IMG_0181.jpg",
  photoPixel: "/photos/portrait-pixel.webp",
  role: "Mahasiswa Informatika",
  tagline: "Mahasiswa S1 Informatika Universitas Sebelas Maret",
  // Minat disimpan untuk ditampilkan kembali nanti:
  // "Antusias mengeksplorasi AI Engineering dan Web Development."
  // Minat tambahan: Cyber Security.
  about: [
    "Saya adalah mahasiswa semester akhir di jurusan Informatika, memiliki ketertarikan khusus pada bidang kecerdasan buatan (AI) dan pengembangan web. Saat ini sedang aktif membangun fondasi pengetahuan di bidang pemrograman, struktur data, dan algoritma, sekaligus mengeksplorasi berbagai teknologi modern untuk menciptakan solusi digital yang inovatif.",
  ],
  marquee: [
    "Next.js",
    "Laravel",
    "TypeScript",
    "React",
    "Supabase",
    "ESP32",
  ],
  links: {
    github: "https://github.com/ndikkkk",
    linkedin: "https://www.linkedin.com/in/andhikaalvn",
    email: "andhi618@gmail.com",
    instagram: "https://www.instagram.com/andhikaalvn",
    whatsapp: "https://wa.me/6285803277484",
  },
  whatsappChatMessage: "Hai, saya lihat portofolio kamu dan ingin bertanya lebih lanjut.",
  projects: [
    {
      title: "kawasanAI",
      summary:
        "Ruang percakapan AI pribadi untuk mengeksplorasi berbagai model dalam satu aplikasi. Dibangun dengan Next.js, dilengkapi pilihan model dan riwayat agar percakapan mudah dilanjutkan.",
      tags: ["Next.js", "TypeScript", "Supabase"],
      demo: "https://kawasan-ai.vercel.app",
      repo: "https://github.com/ndikkkk/kawasanAI",
    },
    {
      title: "Hakim Printing",
      summary: "Proyek aplikasi web Hakim Printing yang dikembangkan dalam kegiatan PPL. Menggunakan Laravel dan Blade sebagai penerapan pengembangan web dalam konteks usaha percetakan.",
      tags: ["Laravel", "Blade"],
      repo: "https://github.com/ndikkkk/Hakim-Printing",
    },
    {
      title: "Inventory Laravel",
      summary:
        "Aplikasi pengelolaan inventaris untuk BKPSDM Boyolali yang dikembangkan saat magang. Menggunakan Laravel dan JavaScript untuk mendukung koordinasi inventaris dalam lingkungan instansi.",
      tags: ["Laravel", "JavaScript"],
      repo: "https://github.com/ndikkkk/inventory-laravel",
    },
    {
      title: "iCoin App",
      summary: "Aplikasi pemantauan harga saham dengan pendekatan tampilan seperti aplikasi trading. Dikembangkan menggunakan JavaScript untuk mengeksplorasi penyajian informasi harga dalam antarmuka web.",
      tags: ["JavaScript"],
      repo: "https://github.com/ndikkkk/iCoin-App",
    },
    {
      title: "Wireless Mobile Computing",
      summary:
        "Eksplorasi komunikasi data lokal antarperangkat ESP32 untuk wilayah yang sulit mendapatkan sinyal. Dibangun dengan C++ sebagai pendekatan konektivitas melalui jaringan lokal.",
      tags: ["C++", "ESP32"],
      repo: "https://github.com/ndikkkk/Wireless-Mobile-Computing",
    },
  ],
  achievements: [
    {
      title: "Sertifikasi Cybersecurity",
      image: "/photos/certificate-cybersecurity.png",
      url: "/photos/Sertifikasi%20Cybersecurity.pdf",
    },
    {
      title: "Sertifikat Dicoding",
      image: "/photos/certificate-dicoding.png",
      url: "/photos/Sertifikat%20Dicoding.pdf",
    },
    {
      title: "Sertifikat Peserta Gemini Academy for University Student",
      image: "/photos/certificate-gemini-academy.png",
      url: "/photos/Sertifikat%20Peserta%20Gemini%20Academy%20for%20University%20Student.pdf",
    },
    {
      title: "Sertifikat Gemini untuk Mahasiswa",
      url: "/photos/sertifikat%20gemini%20university%20student.pdf",
    },
  ],
  tools: {
    Frontend: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
    Backend: [
      "Node.js",
      "Laravel",
      "PHP",
      "REST API",
      "Supabase",
      "MySQL",
    ],
    "AI & Data": [
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "TensorFlow",
      "LangChain",
      "OpenAI API",
    ],
    "Embedded & IoT": [
      "Arduino",
      "ESP32",
      "C++",
    ],
    Lainnya: [
      "Git",
      "GitHub",
      "Vite",
      "VS Code",
      "Linux",
    ],
  },
};

export function whatsAppChatHref(): string {
  const base = profile.links.whatsapp;
  if (!base) return "#";
  return `${base}?text=${encodeURIComponent(profile.whatsappChatMessage)}`;
}