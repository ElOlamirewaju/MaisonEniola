/* Consultation-call booking without any calendar API: availability from settings, bookings in KV,
   confirmation emails with an .ics invite for both sides, cancel links for both. */
import { json, html, esc, str, EMAIL_RE, send, getJSON, putJSON, listJSON, settings, zonedToUtc, fmtZoned, ymdIn, weekdayIn, icsDate, signedLink, checkSigned, TZ } from './lib.js';

const dayList = (from, days) => { const out = []; for (let i = 0; i < days; i++) out.push(new Date(from.getTime() + i * 86400e3)); return out; };
const addMin = (hm, min) => { const [h, m] = hm.split(':').map(Number); const t = h * 60 + m + min; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };

export async function freeSlots(env) {
  const s = await settings(env);
  const booked = new Set((await listJSON(env, 'bk:')).filter(b => !b.cancelledAt).map(b => b.start));
  const earliest = new Date(Date.now() + s.leadHours * 3600e3);
  const slots = [];
  for (const day of dayList(new Date(), s.horizonDays + 1)) {
    const ymd = ymdIn(day);
    if (!s.hours.days.includes(weekdayIn(day)) || s.blocked.includes(ymd)) continue;
    for (let hm = s.hours.from; addMin(hm, s.slotMinutes) <= s.hours.to; hm = addMin(hm, s.slotMinutes)) {
      const start = zonedToUtc(ymd, hm);
      if (start < earliest || booked.has(start.toISOString())) continue;
      slots.push({ start: start.toISOString(), local: `${ymd}T${hm}`, minutes: s.slotMinutes });
    }
  }
  return { tz: TZ, minutes: s.slotMinutes, slots: slots.slice(0, 60) };
}
export const getSlots = async env => json({ ok: true, ...(await freeSlots(env)) }, 200, { 'cache-control': 'no-store' });

function ics({ id, start, end, name, lang, cancelUrl }) {
  const title = lang === 'es' ? 'Llamada de consulta · Maison Eniola' : 'Consultation call · Maison Eniola';
  const desc = (lang === 'es' ? `Llamada de consulta con Maryann Eniola. Te llamo por WhatsApp o teléfono a la hora indicada. Para cancelar: ${cancelUrl}` : `Consultation call with Maryann Eniola. I call you on WhatsApp or phone at the time shown. To cancel: ${cancelUrl}`).replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Maison Eniola//Booking//EN', 'METHOD:REQUEST', 'BEGIN:VEVENT', `UID:${id}@maisoneniola.bid`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${title}`, `DESCRIPTION:${desc}`, `ATTENDEE;CN=${name.replace(/[,;]/g, ' ')}:mailto:noreply@maisoneniola.bid`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

export async function book(request, env) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }
  if (str(d.website, 50)) return json({ ok: true });
  const name = str(d.name, 120), email = str(d.email, 200), phone = str(d.phone, 60), lang = d.lang === 'es' ? 'es' : 'en', startIso = str(d.start, 40), topic = str(d.topic, 200);
  if (!name || !EMAIL_RE.test(email) || !startIso) return json({ ok: false, error: 'fields' }, 400);
  const { slots } = await freeSlots(env);
  const slot = slots.find(x => x.start === startIso);
  if (!slot) return json({ ok: false, error: 'taken' }, 409);
  const start = new Date(slot.start), end = new Date(start.getTime() + slot.minutes * 60e3);
  const id = crypto.randomUUID();
  const cancelClient = await signedLink(env, '/api/book/cancel', { id, who: 'client' }, 60 * 86400);
  const cancelOwner = await signedLink(env, '/api/book/cancel', { id, who: 'owner' }, 60 * 86400);
  const b = { id, name, email, phone, lang, topic, start: start.toISOString(), end: end.toISOString(), createdAt: new Date().toISOString(), cancelledAt: null };
  await putJSON(env, `bk:${id}`, b, { expirationTtl: 60 * 60 * 24 * 180 });
  const when = fmtZoned(start, TZ, lang) + ' (Madrid)';
  const invite = { content: ics({ id, start, end, name, lang, cancelUrl: cancelClient }), filename: 'consultation.ics', type: 'text/calendar', disposition: 'attachment' };
  const textClient = lang === 'es'
    ? `Hola ${name},\n\nTu llamada de consulta está reservada: ${when}, ${slot.minutes} minutos. Te llamo yo${phone ? ` al ${phone}` : ' por WhatsApp o al número que me indiques'}.\n\nLa invitación de calendario va adjunta. Si necesitas cancelar o cambiar la hora: ${cancelClient}\n\nHasta pronto,\nMaryann\nMaison Eniola`
    : `Hi ${name},\n\nYour consultation call is booked: ${when}, ${slot.minutes} minutes. I will call you${phone ? ` on ${phone}` : ' on WhatsApp or the number you tell me'}.\n\nThe calendar invite is attached. If you need to cancel or change the time: ${cancelClient}\n\nSpeak soon,\nMaryann\nMaison Eniola`;
  try {
    await send(env, { to: email, replyTo: env.ENQUIRY_TO, subject: lang === 'es' ? `Llamada reservada: ${when}` : `Call booked: ${when}`, text: textClient, attachments: [invite] });
    await send(env, { to: env.ENQUIRY_TO, replyTo: email, subject: `[Call] ${name} · ${when}`, text: `New consultation call.\n\n${name} <${email}>${phone ? ` · ${phone}` : ''}\n${when}\n${topic ? `\nAbout: ${topic}\n` : ''}\nCancel: ${cancelOwner}`, attachments: [{ ...invite, content: ics({ id, start, end, name, lang, cancelUrl: cancelOwner }) }] });
  } catch (e) {
    console.error('booking email failed', e && e.message);
    await env.REVIEWS.delete(`bk:${id}`);
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true, id, start: b.start, when });
}

export async function cancel(request, env, url) {
  if (!(await checkSigned(env, url))) return html('<h1>This link is not valid.</h1>', 403);
  const id = url.searchParams.get('id'), who = url.searchParams.get('who'), key = `bk:${id}`;
  const b = await getJSON(env, key);
  if (!b) return html('<h1>This booking no longer exists.</h1>');
  if (request.method === 'POST' || url.searchParams.get('confirm') === '1') {
    if (!b.cancelledAt) {
      b.cancelledAt = new Date().toISOString(); await putJSON(env, key, b, { expirationTtl: 60 * 60 * 24 * 180 });
      const when = fmtZoned(new Date(b.start), TZ, b.lang) + ' (Madrid)';
      const other = who === 'client' ? { to: env.ENQUIRY_TO, subject: `[Call cancelled] ${b.name} · ${when}`, text: `${b.name} cancelled the call on ${when}.` } : { to: b.email, subject: b.lang === 'es' ? 'Llamada cancelada' : 'Call cancelled', text: b.lang === 'es' ? `Hola ${b.name},\n\nHe tenido que cancelar nuestra llamada del ${when}. Te escribo para buscar otra hora.\n\nMaryann` : `Hi ${b.name},\n\nI have had to cancel our call on ${when}. I will write to find another time.\n\nMaryann` };
      try { await send(env, other); } catch (e) { /* best effort */ }
    }
    return html(`<h1>${b.lang === 'es' ? 'Llamada cancelada.' : 'Call cancelled.'}</h1>`);
  }
  const when = fmtZoned(new Date(b.start), TZ, b.lang);
  return html(`<h1>${b.lang === 'es' ? 'Cancelar la llamada' : 'Cancel the call'}</h1><p>${esc(when)} (Madrid) · ${esc(b.name)}</p><form method="post"><button style="font:inherit;padding:.7rem 1.2rem;border-radius:999px;border:0;background:#E75B24;color:#fff">${b.lang === 'es' ? 'Sí, cancelar' : 'Yes, cancel it'}</button></form>`);
}
