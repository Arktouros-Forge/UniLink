import { appUrl } from "../utils/config.js";
import UnilinkLogo from "../../public/logo.png"

const COLORS = {
  paper: "#F5F1E8",
  card: "#FFFFFF",
  ink: "#16151A",
  muted: "#4A4852",
  hairline: "#E3E0D8",
  blue: "#1E3FA6",
  blueSoft: "#E8ECF8",
  red: "#D6382D",
  yellow: "#F4B942",
  yellowSoft: "#FDF4DC",
};

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Inter,Arial,Helvetica,sans-serif";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

const paragraph = (text) =>
  `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:25px;color:${COLORS.muted};">${text}</p>`;

const button = (label, href) =>
  `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 24px;"><tr><td style="background:${COLORS.blue};border:2px solid ${COLORS.ink};box-shadow:4px 4px 0 ${COLORS.ink};"><a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;">${label} &rarr;</a></td></tr></table>`;

const note = (text, tone) => {
  const accent = tone === "warning" ? COLORS.red : COLORS.yellow;
  const bg = tone === "warning" ? "#FBEAE8" : COLORS.yellowSoft;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;"><tr><td width="4" style="background:${accent};font-size:0;line-height:0;">&nbsp;</td><td style="background:${bg};padding:12px 16px;font-family:${SANS};font-size:13px;line-height:21px;color:${COLORS.ink};">${text}</td></tr></table>`;
};

const fallbackLink = (href) =>
  `<p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:20px;color:${COLORS.muted};">Tombol tidak berfungsi? Salin tautan ini ke browser:<br><a href="${href}" style="color:${COLORS.blue};word-break:break-all;">${href}</a></p>`;

const renderBlock = (block) => {
  if (block.type === "button") return button(escape(block.label), block.href);
  if (block.type === "note")
    return note(block.html ?? escape(block.text), block.tone);
  if (block.type === "link") return fallbackLink(block.href);
  return paragraph(block.html ?? escape(block.text));
};

const plain = (block) => {
  if (block.type === "button") return `${block.label}: ${block.href}`;
  if (block.type === "link") return "";
  return block.text ?? block.html.replace(/<[^>]+>/g, "");
};

export function renderLayout({ preview, title, eyebrow, blocks, footer }) {
  const site = appUrl();
  const body = blocks.map(renderBlock).join("");

  const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.paper};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escape(preview)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.paper};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
<tr><td style="padding:0 0 20px;"><a href="${site}" style="text-decoration:none;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
<td style="padding-right:12px;"><img src="${site}/${UnilinkLogo}" width="40" height="40" alt="UniLink" style="display:block;border:0;outline:none;"></td>
<td style="font-family:${SERIF};font-size:28px;line-height:40px;font-weight:700;color:${COLORS.ink};">UniLink</td></tr></table></a></td></tr>
<tr><td style="background:${COLORS.card};border:2px solid ${COLORS.ink};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="34%" height="8" style="background:${COLORS.red};font-size:0;line-height:0;">&nbsp;</td><td width="33%" style="background:${COLORS.blue};font-size:0;line-height:0;">&nbsp;</td><td width="33%" style="background:${COLORS.yellow};font-size:0;line-height:0;">&nbsp;</td></tr></table>
<div style="padding:36px 32px 28px;">
<p style="margin:0 0 12px;font-family:'Courier New',monospace;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${COLORS.blue};">${escape(eyebrow ?? "UniLink")}</p>
<h1 style="margin:0 0 20px;font-family:${SERIF};font-size:30px;line-height:36px;color:${COLORS.ink};">${escape(title)}</h1>${body}</div>
</td></tr>
<tr><td style="padding:20px 4px 0;font-family:${SANS};font-size:12px;line-height:20px;color:${COLORS.muted};">
<p style="margin:0 0 8px;">${escape(footer)}</p>
<p style="margin:0;"><a href="${site}" style="color:${COLORS.blue};">Buka UniLink</a> &nbsp;·&nbsp; <a href="${site}/help" style="color:${COLORS.blue};">Bantuan</a> &nbsp;·&nbsp; <a href="${site}/privacy" style="color:${COLORS.blue};">Privasi</a></p>
</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    title,
    "",
    ...blocks.map(plain).filter((line) => line !== ""),
    "",
    footer,
  ].join("\n");

  return { html, text };
}
