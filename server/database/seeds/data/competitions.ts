export type CompetitionSeed = {
  key: string;
  title: string;
  host: string;
  description: string;
  prize: string;
  categories: string[];
  maxTeamSize: number;
  deadlineInDays: number;
  status: "draft" | "published" | "closed";
  by: "admin" | "student";
  teams: number;
};

export const competitionSeeds: CompetitionSeed[] = [
  {
    key: "gemastik",
    title: "GEMASTIK XVIII - Pemrograman dan Pengembangan Perangkat Lunak",
    host: "Puspresnas Kemdikbudristek",
    description:
      "Divisi pemrograman dan pengembangan perangkat lunak pada Pagelaran Mahasiswa Nasional Bidang TIK. Tim membangun aplikasi yang menjawab masalah nyata dan mempresentasikannya di depan juri nasional.",
    prize: "Total hadiah Rp75.000.000 dan akses ke final nasional",
    categories: ["Teknologi & Informatika"],
    maxTeamSize: 3,
    deadlineInDays: 24,
    status: "published",
    by: "admin",
    teams: 3,
  },
  {
    key: "kmipn",
    title: "KMIPN - Kompetisi Mahasiswa Informatika Politeknik Nasional",
    host: "Direktorat Jenderal Pendidikan Vokasi",
    description:
      "Kompetisi bidang aplikasi web, mobile, dan basis data untuk mahasiswa vokasi dan sarjana terapan. Penilaian mencakup inovasi, kualitas kode, dan kesiapan implementasi.",
    prize: "Medali, sertifikat nasional, dan pembinaan",
    categories: ["Teknologi & Informatika"],
    maxTeamSize: 3,
    deadlineInDays: 41,
    status: "published",
    by: "admin",
    teams: 2,
  },
  {
    key: "compfest",
    title: "COMPFEST Hackathon 17",
    host: "Fakultas Ilmu Komputer Universitas Indonesia",
    description:
      "Hackathon 36 jam bertema solusi digital untuk layanan publik. Peserta mendapat mentoring dari praktisi industri dan dapat mempresentasikan prototipe di hari final.",
    prize: "Rp40.000.000 dan peluang magang",
    categories: ["Teknologi & Informatika", "Data & Kecerdasan Buatan"],
    maxTeamSize: 4,
    deadlineInDays: 12,
    status: "published",
    by: "admin",
    teams: 3,
  },
  {
    key: "satria-data",
    title: "Satria Data - Big Data Challenge",
    host: "Pusat Prestasi Nasional",
    description:
      "Tantangan analisis data dan machine learning pada data terbuka. Tim membangun model, menyusun laporan analisis, dan menyajikan temuan dalam bentuk dasbor.",
    prize: "Rp30.000.000 dan sertifikat kompetensi",
    categories: ["Data & Kecerdasan Buatan"],
    maxTeamSize: 3,
    deadlineInDays: 33,
    status: "published",
    by: "admin",
    teams: 2,
  },
  {
    key: "ibpc",
    title: "Indonesia Business Plan Competition",
    host: "Himpunan Mahasiswa Manajemen Nasional",
    description:
      "Kompetisi rencana bisnis untuk ide usaha tahap awal. Tim menyusun model bisnis, proyeksi keuangan tiga tahun, dan pitch lima menit.",
    prize: "Pendanaan awal Rp25.000.000",
    categories: ["Bisnis & Kewirausahaan"],
    maxTeamSize: 4,
    deadlineInDays: 19,
    status: "published",
    by: "student",
    teams: 2,
  },
  {
    key: "uiux-fest",
    title: "UI/UX Design Fest - Ruang Publik Digital",
    host: "Komunitas Desain Bali",
    description:
      "Rancang antarmuka aplikasi yang membuat layanan publik lebih mudah diakses. Penilaian meliputi riset pengguna, alur, konsistensi visual, dan uji kegunaan.",
    prize: "Rp15.000.000 dan portofolio terkurasi",
    categories: ["Desain & Kreatif", "Teknologi & Informatika"],
    maxTeamSize: 3,
    deadlineInDays: 27,
    status: "published",
    by: "student",
    teams: 2,
  },
  {
    key: "kri",
    title: "Kontes Robot Indonesia Regional Bali",
    host: "Balai Pengembangan Talenta Indonesia",
    description:
      "Kontes robot beroda dan robot berkaki dengan misi navigasi otonom. Tim wajib menyertakan laporan teknis dan demo langsung.",
    prize: "Piala bergilir dan tiket ke tingkat nasional",
    categories: ["Rekayasa & Robotika"],
    maxTeamSize: 5,
    deadlineInDays: 55,
    status: "published",
    by: "admin",
    teams: 1,
  },
  {
    key: "pkm",
    title: "PKM Karsa Cipta 2027",
    host: "Direktorat Pembelajaran dan Kemahasiswaan",
    description:
      "Program Kreativitas Mahasiswa bidang karsa cipta. Usulan berupa karya inovatif yang dapat diwujudkan menjadi prototipe dalam satu semester.",
    prize: "Pendanaan hingga Rp12.500.000 per proposal",
    categories: ["Sains & Riset"],
    maxTeamSize: 5,
    deadlineInDays: 68,
    status: "published",
    by: "admin",
    teams: 2,
  },
  {
    key: "lktin",
    title: "Lomba Karya Tulis Ilmiah Nasional - Ekonomi Hijau",
    host: "BEM Fakultas Ekonomi dan Bisnis",
    description:
      "Karya tulis ilmiah bertema transisi ekonomi hijau dan pariwisata berkelanjutan. Finalis mempresentasikan gagasan di hadapan dewan juri akademisi.",
    prize: "Rp10.000.000 dan publikasi di jurnal mahasiswa",
    categories: ["Sains & Riset", "Lingkungan & Keberlanjutan"],
    maxTeamSize: 3,
    deadlineInDays: 8,
    status: "published",
    by: "student",
    teams: 1,
  },
  {
    key: "debat",
    title: "Debat Konstitusi Mahasiswa Tingkat Nasional",
    host: "Mahkamah Konstitusi Republik Indonesia",
    description:
      "Debat mosi konstitusi dengan format parlementer. Setiap tim terdiri dari tiga pembicara dan satu pencatat argumen.",
    prize: "Beasiswa pendidikan dan piala Ketua MK",
    categories: ["Sosial & Humaniora"],
    maxTeamSize: 3,
    deadlineInDays: 46,
    status: "published",
    by: "admin",
    teams: 1,
  },
  {
    key: "hology-lalu",
    title: "Hology Web Development Challenge",
    host: "Himpunan Mahasiswa Teknik Informatika Brawijaya",
    description:
      "Tantangan membangun aplikasi web berbasis tema kota cerdas dalam waktu satu minggu. Pendaftaran sudah ditutup dan hasil telah diumumkan.",
    prize: "Rp20.000.000",
    categories: ["Teknologi & Informatika"],
    maxTeamSize: 3,
    deadlineInDays: -34,
    status: "closed",
    by: "admin",
    teams: 3,
  },
  {
    key: "datathon-lalu",
    title: "Datathon Nasional - Kesehatan Masyarakat",
    host: "Kementerian Kesehatan RI",
    description:
      "Datathon analisis data kesehatan masyarakat untuk memetakan risiko penyakit menular. Kompetisi telah selesai dan hasil sudah diumumkan.",
    prize: "Rp35.000.000",
    categories: ["Data & Kecerdasan Buatan"],
    maxTeamSize: 4,
    deadlineInDays: -61,
    status: "closed",
    by: "admin",
    teams: 2,
  },
  {
    key: "startup-lalu",
    title: "Startup Weekend Denpasar",
    host: "Techstars Community Bali",
    description:
      "Akhir pekan intensif membangun startup dari ide menjadi prototipe dan pitch. Acara telah berlangsung dan pendaftaran dibuka kembali pada tahun depan.",
    prize: "Ruang kerja bersama selama 3 bulan",
    categories: ["Bisnis & Kewirausahaan", "Teknologi & Informatika"],
    maxTeamSize: 5,
    deadlineInDays: -20,
    status: "closed",
    by: "student",
    teams: 2,
  },
  {
    key: "film-draft",
    title: "Festival Film Pendek Mahasiswa Nusantara",
    host: "Komunitas Sinema Kampus",
    description:
      "Festival film pendek bertema keberagaman budaya. Draf pengumuman masih ditinjau admin sebelum dipublikasikan.",
    prize: "Rp8.000.000",
    categories: ["Desain & Kreatif"],
    maxTeamSize: 6,
    deadlineInDays: 90,
    status: "draft",
    by: "student",
    teams: 0,
  },
];

export const teamNamePool = [
  "Garuda Muda",
  "Tri Hita Karana",
  "Barong Byte",
  "Pulau Kode",
  "Segara Labs",
  "Janger Dev",
  "Canang Data",
  "Kintamani Squad",
  "Sanur Syntax",
  "Ubud Pixels",
  "Lovina Logic",
  "Nusa Dua Team",
  "Tabanan Tech",
  "Gianyar Guild",
  "Kuta Kernel",
  "Jimbaran Join",
  "Batur Builders",
  "Bedugul Bits",
  "Rinjani Rangers",
  "Komodo Core",
  "Borobudur Bytes",
  "Sunda Strike",
  "Wallacea Works",
  "Pesona Nusantara",
];

export const teamBlurbs = [
  "Kami mencari rekan yang konsisten latihan dan terbuka pada umpan balik.",
  "Tim kecil dengan jadwal sinkron tiap Selasa dan Kamis sore di kampus.",
  "Sudah punya draf ide dan wireframe awal. Butuh yang kuat di sisi eksekusi.",
  "Pernah lolos babak penyisihan tahun lalu, sekarang mengejar final.",
  "Fokus belajar sambil berlomba. Pemula yang rajin sangat diterima.",
];
