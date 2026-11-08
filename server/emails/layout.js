const COLORS = {
  paper: "#F5F1E8",
  card: "#FFFFFF",
  ink: "#16151A",
  muted: "#4A4852",
  hairline: "#E3E0D8",
  blue: "#1E3FA6",
  red: "#D6382D",
  yellow: "#F4B942",
};

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const paragraph = (text) =>
  `<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${COLORS.muted};">${text}</p>`;

const button = (label, href) =>
  `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 24px;"><tr><td style="background:${COLORS.blue};border-radius:8px;"><a href="${href}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">${label}</a></td></tr></table>`;

export function renderLayout({ preview, title, blocks, footer }) {
  const body = blocks
    .map((block) => (block.type === "button" ? button(escape(block.label), block.href) : paragraph(block.html ?? escape(block.text))))
    .join("");

  const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.paper};font-family:Inter,Arial,Helvetica,sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preview)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.paper};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;">
<tr><td style="padding-bottom:16px;"><span style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:${COLORS.ink};">UniLink</span></td></tr>
<tr><td style="background:${COLORS.card};border:1px solid ${COLORS.hairline};border-radius:8px;overflow:hidden;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="34%" height="6" style="background:${COLORS.red};font-size:0;line-height:0;">&nbsp;</td><td width="33%" style="background:${COLORS.blue};font-size:0;line-height:0;">&nbsp;</td><td width="33%" style="background:${COLORS.yellow};font-size:0;line-height:0;">&nbsp;</td></tr></table>
<div style="padding:32px;"><h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:32px;color:${COLORS.ink};">${escape(title)}</h1>${body}</div>
</td></tr>
<tr><td style="padding:16px 4px;font-size:12px;line-height:20px;color:${COLORS.muted};">${escape(footer)}</td></tr>
</table></td></tr></table></body></html>`;

  const text = [title, "", ...blocks.map((block) => (block.type === "button" ? `${block.label}: ${block.href}` : (block.text ?? block.html.replace(/<[^>]+>/g, "")))), "", footer].join("\n");

  return { html, text };
}
