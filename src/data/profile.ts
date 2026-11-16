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
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  photo?: string;
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
  photoPixel: "/photos/portrait-pixel.webp",
  role: "Mahasiswa Informatika",
  tagline: "Antusias mengeksplorasi AI Engineering dan Web Development.",
  about: [
    "Saya adalah mahasiswa semester akhir di jurusan Informatika, memiliki ketertarikan khusus pada bidang kecerdasan buatan (AI) dan pengembangan web. Saat ini sedang aktif membangun fondasi pengetahuan di bidang pemrograman, struktur data, dan algoritma, sekaligus mengeksplorasi berbagai teknologi modern untuk menciptakan solusi digital yang inovatif.",
  ],
  marquee: [
    "AI Engineer",
    "Web Developer",
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
        "Chat pribadi berbasis Next.js dengan pemilihan model dan riwayat percakapan.",
      tags: ["Next.js", "TypeScript", "Supabase"],
      demo: "https://kawasan-ai.vercel.app",
      repo: "https://github.com/ndikkkk/kawasanAI",
    },
    {
      title: "Hakim Printing",
      summary: "Aplikasi web Laravel, dikerjakan sebagai proyek PPL.",
      tags: ["Laravel", "Blade"],
      repo: "https://github.com/ndikkkk/Hakim-Printing",
    },
    {
      title: "Inventory Laravel",
      summary:
        "Aplikasi untuk mengoordinir inventaris di BKPSDM Boyolali, dikerjakan saat magang.",
      tags: ["Laravel", "JavaScript"],
      repo: "https://github.com/ndikkkk/inventory-laravel",
    },
    {
      title: "iCoin App",
      summary: "Aplikasi untuk memantau harga saham, mirip aplikasi trading.",
      tags: ["JavaScript"],
      repo: "https://github.com/ndikkkk/iCoin-App",
    },
    {
      title: "Wireless Mobile Computing",
      summary:
        "Sistem komunikasi data koneksi lokal antar ESP32 untuk daerah yang sulit sinyal.",
      tags: ["C++", "ESP32"],
      repo: "https://github.com/ndikkkk/Wireless-Mobile-Computing",
    },
  ],
  achievements: [
    {
      title: "Sertifikasi Cybersecurity",
      url: "/photos/Sertifikasi%20Cybersecurity.pdf",
    },
    {
      title: "Sertifikat Dicoding",
      url: "/photos/Sertifikat%20Dicoding.pdf",
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