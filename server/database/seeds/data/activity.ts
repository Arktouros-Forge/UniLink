export const helpTopics: Record<
  string,
  { titles: string[]; details: string[] }
> = {
  "Algoritma & Struktur Data": {
    titles: [
      "Rekursi masih membingungkan",
      "Cara menganalisis kompleksitas Big-O",
      "Debug pohon biner yang tidak seimbang",
    ],
    details: [
      "Saya paham contoh faktorial tapi bingung ketika rekursinya bercabang seperti Fibonacci.",
      "Butuh penjelasan memilih kompleksitas yang tepat untuk tugas minggu depan.",
      "Fungsi rotasi AVL saya menghasilkan urutan yang salah pada beberapa kasus.",
    ],
  },
  "Basis Data & SQL": {
    titles: [
      "Normalisasi sampai 3NF",
      "Query JOIN yang sangat lambat",
      "Merancang ERD sistem perpustakaan",
    ],
    details: [
      "Tabel pesanan saya masih punya ketergantungan transitif dan belum tahu cara memisahkannya.",
      "Query dengan tiga JOIN butuh 8 detik di data uji. Ingin belajar membaca EXPLAIN.",
      "Tugas besar meminta ERD lengkap dengan relasi banyak ke banyak.",
    ],
  },
  Python: {
    titles: [
      "List comprehension dan generator",
      "Membaca CSV besar dengan pandas",
      "Virtual environment berantakan",
    ],
    details: [
      "Sering menulis loop panjang padahal katanya bisa lebih ringkas.",
      "File 500 MB membuat laptop saya kehabisan memori.",
      "Paket saling bentrok setiap kali memasang dependensi baru.",
    ],
  },
  "Web Frontend": {
    titles: [
      "Layout responsif dengan grid",
      "State management di Vue",
      "Aksesibilitas formulir",
    ],
    details: [
      "Tampilan rapi di desktop tapi pecah di layar 390px.",
      "Props drilling tiga tingkat membuat kode sulit dibaca.",
      "Pembaca layar tidak membacakan label input pada formulir saya.",
    ],
  },
  "Machine Learning": {
    titles: [
      "Overfitting pada dataset kecil",
      "Memilih metrik evaluasi",
      "Menyiapkan fitur dari teks",
    ],
    details: [
      "Akurasi latih 99% tetapi uji hanya 71%.",
      "Dataset tidak seimbang dan akurasi terasa menipu.",
      "Belum jelas kapan memakai TF-IDF dan kapan embedding.",
    ],
  },
  "UI/UX Design": {
    titles: [
      "Review prototipe aplikasi kampus",
      "Menyusun alur onboarding",
      "Memilih palet warna yang kontras",
    ],
    details: [
      "Butuh mata lain untuk menilai hierarki visual di 5 layar utama.",
      "Pengguna sering berhenti di langkah ketiga dan saya belum tahu sebabnya.",
      "Warna merek saya sulit terbaca di atas latar terang.",
    ],
  },
  "Business Plan": {
    titles: [
      "Proyeksi keuangan tiga tahun",
      "Menentukan segmen pelanggan",
      "Memvalidasi model pendapatan",
    ],
    details: [
      "Saya belum paham cara menghitung titik impas dengan biaya tetap bertingkat.",
      "Targetnya terlalu luas dan juri meminta lebih spesifik.",
      "Perlu sparring partner untuk menguji asumsi harga.",
    ],
  },
  "Penulisan Ilmiah": {
    titles: [
      "Merumuskan rumusan masalah",
      "Format sitasi APA 7",
      "Menyusun tinjauan pustaka",
    ],
    details: [
      "Draf proposal PKM saya masih terlalu luas.",
      "Daftar pustaka berantakan setelah menggabungkan banyak sumber.",
      "Bingung mengelompokkan literatur berdasarkan tema.",
    ],
  },
  Statistika: {
    titles: [
      "Memilih uji hipotesis",
      "Interpretasi p-value",
      "Regresi linear berganda",
    ],
    details: [
      "Data saya tidak normal dan belum tahu uji alternatifnya.",
      "Hasil signifikan tetapi efeknya kecil, apakah tetap berguna?",
      "Multikolinearitas muncul dan saya belum tahu cara mengatasinya.",
    ],
  },
  "Backend & API": {
    titles: [
      "Desain endpoint REST yang rapi",
      "Autentikasi dengan cookie",
      "Penanganan error yang konsisten",
    ],
    details: [
      "Endpoint saya campur antara kata kerja dan kata benda.",
      "Belum paham perbedaan sesi dan token untuk tugas akhir.",
      "Respons error tiap endpoint berbeda bentuknya.",
    ],
  },
  "Keamanan Siber": {
    titles: [
      "Dasar SQL injection untuk CTF",
      "Hashing dan salting kata sandi",
      "Konfigurasi HTTPS di server uji",
    ],
    details: [
      "Ingin berlatih dengan lingkungan aman sebelum lomba.",
      "Dosen meminta penjelasan kenapa MD5 tidak cukup.",
      "Sertifikat selalu ditolak oleh peramban.",
    ],
  },
};

export const fallbackTopic = {
  titles: [
    "Butuh teman diskusi materi minggu ini",
    "Latihan soal sebelum kuis",
    "Review tugas sebelum dikumpulkan",
  ],
  details: [
    "Ingin membahas materi pertemuan terakhir sebelum kuis.",
    "Mencari teman untuk latihan soal selama satu jam.",
    "Ingin ada mata lain sebelum tugas dikumpulkan.",
  ],
};

export const preferredTimes = [
  "Senin sore setelah kuliah",
  "Selasa atau Kamis, 15.30-17.00",
  "Rabu malam via panggilan",
  "Akhir pekan, pagi hari",
  "Fleksibel, kabari sehari sebelumnya",
  "Jumat setelah salat Jumat",
];

export const taskTemplates = [
  ["Kerjakan latihan {topic}", "Soal nomor 1-8 dari modul praktikum."],
  ["Kumpulkan laporan praktikum {topic}", "Format PDF, maksimal 10 halaman."],
  ["Belajar untuk kuis {topic}", "Fokus bab 3 dan 4."],
  ["Siapkan presentasi {topic}", "Durasi 10 menit dengan 8 slide."],
  ["Baca jurnal tentang {topic}", "Ringkas dalam satu halaman."],
  ["Revisi tugas besar {topic}", "Perbaiki sesuai catatan dosen."],
  ["Latihan soal ujian {topic}", "Gunakan soal tahun lalu dari himpunan."],
] as const;

export const generalTasks = [
  "Daftar lomba semester ini",
  "Perbarui portofolio dan CV",
  "Booking ruang diskusi perpustakaan",
  "Fotokopi KRS untuk administrasi beasiswa",
  "Hubungi dosen pembimbing akademik",
  "Rapat tim lomba hari Sabtu",
];

export const requestMessages = [
  "Halo, saya lihat kamu mahir di bidang ini. Boleh minta waktu satu sesi untuk membahas tugas saya?",
  "Saya sedang mengerjakan tugas besar dan ingin mencocokkan pemahaman. Apakah minggu ini kamu bisa?",
  "Butuh bantuan memahami materi sebelum kuis. Saya bawa contoh soal dan catatan sendiri.",
  "Saya menemukan tanda bantuan kamu dan merasa bisa membantu. Kapan kita bisa mulai?",
];
