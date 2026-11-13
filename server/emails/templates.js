import { appUrl } from "../utils/config.js";
import { renderLayout } from "./layout.js";

const FOOTER =
  "Email ini dikirim otomatis oleh UniLink, platform belajar dan kompetisi mahasiswa Universitas Udayana.";

const verifyUrl = (token) => `${appUrl()}/auth/verify-email?token=${token}`;
const resetUrl = (token) => `${appUrl()}/auth/reset?token=${token}`;

const firstName = (name) => String(name ?? "").split(" ")[0] || "kamu";

const build = (subject, preview, eyebrow, blocks) => ({
  subject,
  ...renderLayout({ preview, title: subject, eyebrow, blocks, footer: FOOTER }),
});

export const templates = {
  verifyEmail: ({ name, token }) =>
    build(
      "Verifikasi emailmu",
      "Satu langkah lagi sebelum melengkapi profil.",
      "Selamat datang",
      [
        { text: `Halo ${firstName(name)}, selamat datang di UniLink.` },
        {
          text: "Klik tombol di bawah untuk memverifikasi emailmu, lalu lengkapi profil agar bisa cari teman belajar, bantuan, dan tim lomba.",
        },
        { type: "button", label: "Verifikasi email", href: verifyUrl(token) },
        { type: "note", text: "Tautan berlaku 24 jam." },
        { type: "link", href: verifyUrl(token) },
        { text: "Jika kamu tidak membuat akun UniLink, abaikan email ini." },
      ],
    ),

  resetPassword: ({ name, token }) =>
    build(
      "Atur ulang kata sandi",
      "Tautan berlaku 30 menit.",
      "Keamanan akun",
      [
        {
          text: `Halo ${firstName(name)}, kami menerima permintaan untuk mengatur ulang kata sandimu.`,
        },
        { text: "Klik tombol di bawah untuk membuat kata sandi baru." },
        {
          type: "button",
          label: "Buat kata sandi baru",
          href: resetUrl(token),
        },
        {
          type: "note",
          text: "Tautan berlaku 30 menit dan hanya bisa dipakai sekali.",
        },
        { type: "link", href: resetUrl(token) },
        {
          text: "Jika bukan kamu yang meminta, abaikan email ini. Kata sandimu tetap aman.",
        },
      ],
    ),

  passwordChanged: ({ name }) =>
    build(
      "Kata sandimu berubah",
      "Semua perangkat lain telah dikeluarkan.",
      "Keamanan akun",
      [
        {
          text: `Halo ${firstName(name)}, kata sandi akun UniLink-mu baru saja diubah.`,
        },
        {
          text: "Semua sesi di perangkat lain telah dikeluarkan demi keamanan.",
        },
        {
          type: "note",
          tone: "warning",
          text: "Bukan kamu yang mengubahnya? Segera atur ulang kata sandi.",
        },
        {
          type: "button",
          label: "Atur ulang kata sandi",
          href: `${appUrl()}/auth/forgot`,
        },
      ],
    ),
};

export function composeMail(name, to, data) {
  return { to, ...templates[name](data) };
}
