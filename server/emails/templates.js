import { appUrl } from "../utils/config.js";
import { renderLayout } from "./layout.js";

const FOOTER = "Email ini dikirim otomatis oleh UniLink, platform belajar dan kompetisi mahasiswa Universitas Udayana.";

const firstName = (name) => String(name ?? "").split(" ")[0] || "kamu";

const build = (subject, preview, blocks) => ({ subject, ...renderLayout({ preview, title: subject, blocks, footer: FOOTER }) });

export const templates = {
  verifyEmail: ({ name, token }) =>
    build("Verifikasi emailmu", "Satu langkah lagi sebelum melengkapi profil.", [
      { text: `Halo ${firstName(name)}, selamat datang di UniLink.` },
      { text: "Klik tombol di bawah untuk memverifikasi emailmu. Tautan berlaku 24 jam." },
      { type: "button", label: "Verifikasi email", href: `${appUrl()}/auth/verify-email?token=${token}` },
      { text: "Jika kamu tidak membuat akun UniLink, abaikan email ini." },
    ]),

  resetPassword: ({ name, token }) =>
    build("Atur ulang kata sandi", "Tautan berlaku 30 menit.", [
      { text: `Halo ${firstName(name)}, kami menerima permintaan untuk mengatur ulang kata sandimu.` },
      { text: "Klik tombol di bawah untuk membuat kata sandi baru. Tautan berlaku 30 menit dan hanya bisa dipakai sekali." },
      { type: "button", label: "Buat kata sandi baru", href: `${appUrl()}/auth/reset?token=${token}` },
      { text: "Jika bukan kamu yang meminta, abaikan email ini. Kata sandimu tetap aman." },
    ]),

  passwordChanged: ({ name }) =>
    build("Kata sandimu berubah", "Semua perangkat lain telah dikeluarkan.", [
      { text: `Halo ${firstName(name)}, kata sandi akun UniLink-mu baru saja diubah.` },
      { text: "Semua sesi di perangkat lain telah dikeluarkan demi keamanan. Jika ini bukan kamu, segera atur ulang kata sandi." },
      { type: "button", label: "Atur ulang kata sandi", href: `${appUrl()}/auth/forgot` },
    ]),

  welcome: ({ name }) =>
    build("Profilmu siap", "Mulai cari teman belajar dan tim lomba.", [
      { text: `Halo ${firstName(name)}, profilmu sudah lengkap.` },
      { text: "Cari teman belajar, pasang tanda bantuan, atau bentuk tim untuk kompetisi berikutnya." },
      { type: "button", label: "Buka dasbor", href: `${appUrl()}/student/dashboard` },
    ]),

  requestReceived: ({ name, from, subject }) =>
    build("Permintaan belajar baru", `${from} meminta bantuanmu.`, [
      { text: `Halo ${firstName(name)}, ${from} meminta bantuanmu untuk topik "${subject}".` },
      { text: "Permintaan berlaku 7 hari. Terima atau tolak dari halaman Permintaan belajar." },
      { type: "button", label: "Lihat permintaan", href: `${appUrl()}/student/study-match/requests` },
    ]),

  requestAccepted: ({ name, from, subject }) =>
    build("Permintaanmu diterima", `${from} menerima permintaanmu.`, [
      { text: `Kabar baik, ${firstName(name)}. ${from} menerima permintaanmu untuk topik "${subject}".` },
      { text: "Nomor WhatsApp-nya sekarang terbuka. Lanjutkan percakapan di sana." },
      { type: "button", label: "Buka permintaan", href: `${appUrl()}/student/study-match/requests` },
    ]),
};

export function composeMail(name, to, data) {
  return { to, ...templates[name](data) };
}
