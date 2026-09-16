/* Enquiry relay for maisoneniola.bid.
   POST /api/enquiry with JSON { name, email, phone, lang, subject, message, website }
   emails the enquiry to Maryann through Cloudflare Email Sending and sends the visitor a copy.
   Everything else is served from the static build (assets binding; only /api/* reaches this script).
   Nothing is stored: the request is relayed and forgotten. `website` is a honeypot field that humans never see. */

const ALLOWED_ORIGINS = ['https://maisoneniola.bid', 'https://www.maisoneniola.bid'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const html = text => `<pre style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;white-space:pre-wrap;color:#03131F">${esc(text)}</pre>`;
const str = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/enquiry') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

    const origin = request.headers.get('Origin') || '';
    const localDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (!localDev && !ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: 'origin' }, 403);

    let d;
    try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }

    if (str(d.website, 50)) return json({ ok: true }); // honeypot filled in: a bot; pretend it worked

    const name = str(d.name, 120), email = str(d.email, 200), phone = str(d.phone, 60);
    const lang = d.lang === 'es' ? 'es' : 'en';
    const subject = str(d.subject, 160) || (lang === 'es' ? 'Consulta desde la web' : 'Enquiry from the website');
    const message = str(d.message, 8000);
    if (!name || !EMAIL_RE.test(email) || message.length < 20) return json({ ok: false, error: 'fields' }, 400);

    const from = { email: env.ENQUIRY_FROM, name: 'Maison Eniola website' };
    const footer = lang === 'es'
      ? `\n\n—\nEnviado desde maisoneniola.bid. Responde a ${email}${phone ? ` · WhatsApp ${phone}` : ''}.`
      : `\n\n—\nSent from maisoneniola.bid. Reply to ${email}${phone ? ` · WhatsApp ${phone}` : ''}.`;

    try {
      await env.EMAIL.send({
        to: env.ENQUIRY_TO,
        from,
        replyTo: email,
        subject: `[Enquiry] ${subject}`,
        text: message + footer,
        html: html(message + footer),
      });
    } catch (e) {
      console.error('enquiry send failed', e && e.message);
      return json({ ok: false, error: 'send' }, 502);
    }

    // A copy for the visitor. Best effort: their enquiry has already reached Maryann.
    const copyIntro = lang === 'es'
      ? `Hola ${name},\n\nGracias por tu consulta. Aquí tienes una copia de lo que me has enviado. Te respondo personalmente lo antes posible.\n\nMaryann\nMaison Eniola\n\n——————————\n\n`
      : `Hi ${name},\n\nThank you for your enquiry. Here is a copy of what you sent me. I reply personally, as soon as I can.\n\nMaryann\nMaison Eniola\n\n——————————\n\n`;
    try {
      await env.EMAIL.send({
        to: email,
        from,
        replyTo: env.ENQUIRY_TO,
        subject: lang === 'es' ? 'Tu consulta a Maison Eniola' : 'Your enquiry to Maison Eniola',
        text: copyIntro + message,
        html: html(copyIntro + message),
      });
    } catch (e) { console.error('copy send failed', e && e.message); }

    return json({ ok: true });
  },
};
