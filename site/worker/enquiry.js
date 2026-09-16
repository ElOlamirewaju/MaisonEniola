/* Enquiry relay plus a record so the reminder cron can nudge Maryann if it goes unanswered. */
import { json, str, EMAIL_RE, send, notify, putJSON, getJSON, signedLink, checkSigned, html, esc } from './lib.js';

export async function postEnquiry(request, env) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }
  if (str(d.website, 50)) return json({ ok: true, id: 'x' }); // honeypot: pretend it worked

  const name = str(d.name, 120), email = str(d.email, 200), phone = str(d.phone, 60);
  const lang = d.lang === 'es' ? 'es' : 'en';
  const subject = str(d.subject, 160) || (lang === 'es' ? 'Consulta desde la web' : 'Enquiry from the website');
  const message = str(d.message, 8000);
  if (!name || !EMAIL_RE.test(email) || message.length < 20) return json({ ok: false, error: 'fields' }, 400);

  const id = crypto.randomUUID();
  const repliedLink = await signedLink(env, '/api/enquiry/replied', { id });
  const footer = lang === 'es'
    ? `\n\n—\nEnviado desde maisoneniola.bid. Responde a ${email}${phone ? ` · WhatsApp ${phone}` : ''}.`
    : `\n\n—\nSent from maisoneniola.bid. Reply to ${email}${phone ? ` · WhatsApp ${phone}` : ''}.`;
  const adminNote = `\n\nWhen you have replied, tap this so I stop reminding you: ${repliedLink}`;
  try {
    await send(env, { to: env.ENQUIRY_TO, replyTo: email, subject: `[Enquiry] ${subject}`, text: message + footer + adminNote });
  } catch (e) {
    console.error('enquiry send failed', e && e.message);
    return json({ ok: false, error: 'send' }, 502);
  }
  await putJSON(env, `enq:${id}`, { id, name, email, phone, lang, subject, receivedAt: new Date().toISOString(), repliedAt: null, reminders: 0 }, { expirationTtl: 60 * 60 * 24 * 60 });

  const copyIntro = lang === 'es'
    ? `Hola ${name},\n\nGracias por tu consulta. Aquí tienes una copia de lo que me has enviado. Te respondo personalmente lo antes posible.\n\nMaryann\nMaison Eniola\n\n——————————\n\n`
    : `Hi ${name},\n\nThank you for your enquiry. Here is a copy of what you sent me. I reply personally, as soon as I can.\n\nMaryann\nMaison Eniola\n\n——————————\n\n`;
  try { await send(env, { to: email, replyTo: env.ENQUIRY_TO, subject: lang === 'es' ? 'Tu consulta a Maison Eniola' : 'Your enquiry to Maison Eniola', text: copyIntro + message }); } catch (e) { /* best effort */ }
  return json({ ok: true, id });
}

/* GET /api/enquiry/replied?id=&exp=&t=  — from the notification email or the admin page. */
export async function markReplied(request, env, url) {
  if (!(await checkSigned(env, url))) return html('<h1>This link is not valid.</h1>', 403);
  const id = url.searchParams.get('id'), key = `enq:${id}`;
  const e = await getJSON(env, key);
  if (!e) return html('<h1>Already gone.</h1><p>This enquiry record has expired.</p>');
  e.repliedAt = e.repliedAt || new Date().toISOString();
  await putJSON(env, key, e, { expirationTtl: 60 * 60 * 24 * 60 });
  return html(`<h1>Marked as replied.</h1><p>${esc(e.name)} · ${esc(e.subject)}</p>`);
}
