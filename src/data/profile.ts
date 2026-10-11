export interface Project {
  title: string;
  summary: string;
  tags: string[];
  demo?: string;
  repo?: string;
}

export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  about: string[];
  marquee: string[];
  links: {
    github: string;
    linkedin: string;
    email: string;
    instagram: string;
    whatsapp?: string;
  };
  projects: Project[];
  achievements: Achievement[];
  tools: Record<string, string[]>;
}

export const profile: Profile = {
  name: "Andhikaalvn",
  role: "AI Engineer & Web Developer",
  tagline: "Membangun aplikasi web yang rapi sambil mendalami rekayasa AI.",
  about: ["{{ISI_SENDIRI}}"],
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
  },
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
  achievements: [],
  tools: {},
};