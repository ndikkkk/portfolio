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
  photo?: string;
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
  photo: "",
  role: "AI Engineer & Web Developer",
  tagline: "Membangun aplikasi web yang rapi sambil mendalami rekayasa AI.",
  about: [
    "Saya mahasiswa Informatika yang tertarik pada dua bidang yang saling melengkapi: pengembangan web dan kecerdasan buatan (AI). Ketertarikan ini muncul dari rasa ingin tahu bagaimana sebuah aplikasi bisa terasa mudah dipakai sekaligus mampu mengambil keputusan cerdas di baliknya.",
    "Di sisi web, saya senang membangun antarmuka yang rapi dan backend yang dapat diandalkan. Di sisi AI, saya sedang mendalami cara mengintegrasikan model ke dalam produk nyata, supaya aplikasi yang saya buat tidak hanya berfungsi tetapi juga menambah nilai bagi penggunanya.",
    "Saat ini saya terus memperdalam keduanya lewat proyek dan pembelajaran mandiri, dengan tujuan tumbuh menjadi engineer yang paham dari tampilan depan sampai logika model di belakangnya.",
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