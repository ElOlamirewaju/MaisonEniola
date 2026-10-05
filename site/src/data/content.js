/* Content and pricing for the Maison Eniola website (English and Spanish), shared by every page and script.
   Source of truth for terms: the amended PDF price guides (Q4 2026). */
const CONTACT = { wa: '34663412843', waLabel: '+34 663 412 843', email: 'maisoneniola@gmail.com' };
const TIER_COLORS = ['coral', 'teal', 'gold'];

const UI = {
  nav: { services: { en: 'Services', es: 'Servicios' }, places: { en: 'Places', es: 'Destinos' }, estimate: { en: 'Estimate', es: 'Presupuesto' }, enquire: { en: 'Enquire', es: 'Consulta' } },
  whatsapp: { en: 'Message Maryann on WhatsApp', es: 'Escribe a Maryann por WhatsApp' },
  whatsappShort: { en: 'WhatsApp', es: 'WhatsApp' },
  menu: { en: 'Menu', es: 'Menú' },
  heroTitle: { en: 'Where to go, where to say yes, and how everyone gets there.', es: 'Adónde ir, dónde dar el sí y cómo llega todo el mundo.' },
  heroLead: {
    en: 'Maison Eniola plans trips, finds wedding venues and organises travel for proposals, weddings and the guests who come to them, for solo travellers, couples, families and groups. You get real options with the costs compared and the details checked, in English or Spanish.',
    es: 'Maison Eniola planifica viajes, busca espacios para bodas y organiza los desplazamientos de pedidas, bodas e invitados, para quien viaja solo, en pareja, en familia o en grupo. Recibes opciones reales, con los costes comparados y los detalles comprobados, en inglés o en español.'
  },
  heroCta1: { en: 'See services and prices', es: 'Ver servicios y precios' },
  heroCta2: { en: 'Work out an estimate', es: 'Calcular un presupuesto' },
  heroPostcardHint: { en: 'Tap a postcard to look closer', es: 'Toca una postal para verla de cerca' },
  servicesTitle: { en: 'Services and prices', es: 'Servicios y precios' },
  servicesLead: { en: 'Three services, each with three levels, for individuals, couples, families and groups. Prices shown are Maryann’s planning fees.', es: 'Tres servicios, cada uno con tres niveles, para personas, parejas, familias y grupos. Los precios son los honorarios de planificación de Maryann.' },
  // Locked operational string: used word-for-word in the services intro and the footer.
  priceValidity: { en: 'Prices valid from 1 October 2026. Flights, hotels, and venues are paid by you directly to each supplier.', es: 'Precios válidos desde el 1 de octubre de 2026. Vuelos, hoteles y espacios los pagas tú directamente a cada proveedor.' },
  fxNote: { en: 'GBP and USD figures are guides converted from EUR and rounded; invoices are issued in EUR unless agreed otherwise.', es: 'Las cifras en GBP y USD son orientativas, convertidas desde el euro y redondeadas; las facturas se emiten en euros salvo acuerdo.' },
  from: { en: 'From', es: 'Desde' },
  bestFor: { en: 'Best for', es: 'Ideal para' },
  included: { en: 'What’s included', es: 'Qué incluye' },
  showAll: { en: 'Show all {n} inclusions', es: 'Ver las {n} inclusiones' },
  showFewer: { en: 'Show fewer', es: 'Ver menos' },
  scope: { en: 'Scope', es: 'Alcance' },
  turnaround: { en: 'Turnaround', es: 'Plazo' },
  work: { en: 'Work involved', es: 'Trabajo' },
  addons: { en: 'Add-ons', es: 'Extras' },
  estimateThis: { en: 'Estimate this', es: 'Calcular este' },
  enquireThis: { en: 'Enquire about this', es: 'Consultar este' },
  howTitle: { en: 'How it works', es: 'Cómo funciona' },
  termsTitle: { en: 'Payment and terms', es: 'Pagos y condiciones' },
  placesTitle: { en: 'Places Maryann might suggest', es: 'Lugares que Maryann podría proponerte' },
  placesLead: { en: 'Examples of the kind of places Maryann researches. Every suggestion is checked against your brief, your dates and where your guests are travelling from.', es: 'Ejemplos del tipo de lugares que investiga Maryann. Cada propuesta se comprueba según tu idea, tus fechas y desde dónde viajan tus invitados.' },
  planThis: { en: 'Plan something like this', es: 'Planificar algo así' },
  close: { en: 'Close', es: 'Cerrar' },
  prev: { en: 'Previous place', es: 'Lugar anterior' },
  next: { en: 'Next place', es: 'Lugar siguiente' },
  illustration: { en: 'Illustration', es: 'Ilustración' },
  estTitle: { en: 'Work out an estimate', es: 'Calcula un presupuesto' },
  estLead: { en: 'Choose a service, a level and any add-ons. Your final fee is confirmed in writing after the consultation call.', es: 'Elige un servicio, un nivel y los extras que quieras. Tu tarifa final se confirma por escrito después de la llamada de consulta.' },
  estService: { en: 'Service', es: 'Servicio' },
  estLevel: { en: 'Level', es: 'Nivel' },
  estNoAddons: { en: 'No add-ons for this level.', es: 'Este nivel no tiene extras.' },
  estTicket: { en: 'Your estimate', es: 'Tu presupuesto' },
  estBase: { en: 'Base fee', es: 'Tarifa base' },
  estRush: { en: 'Rush (+30% of base fee)', es: 'Urgente (+30 % de la tarifa base)' },
  estCredit: { en: 'Destination Match credit', es: 'Abono de Destination Match' },
  estTotal: { en: 'Estimated planning fee', es: 'Honorarios estimados' },
  estApprox: { en: 'About {gbp} or {usd}. Invoiced in EUR.', es: 'Unos {gbp} o {usd}. Se factura en euros.' },
  estPlusTravel: { en: 'Plus travel for in-person days, billed at receipted cost.', es: 'Más los desplazamientos de los días presenciales, a coste justificado.' },
  estSmall: { en: 'This is a guide, not a quote. It covers Maryann’s fee only. Flights, stays, venues and visa application fees are paid by you directly to each supplier.', es: 'Es una orientación, no un presupuesto cerrado. Solo cubre los honorarios de Maryann. Vuelos, alojamientos, espacios y tasas de visado los pagas tú directamente a cada proveedor.' },
  estSend: { en: 'Add this estimate to my enquiry', es: 'Añadir este presupuesto a mi consulta' },
  estAdded: { en: 'Added to your enquiry below.', es: 'Añadido a tu consulta, más abajo.' },
  rushNote: { en: '+30% of the base fee', es: '+30 % sobre la tarifa base' },
  // Discount codes (worker/discounts.js): a percentage off Maryann's planning fee only, never supplier costs.
  estDiscount: { en: 'Discount {code} (−{p}%)', es: 'Descuento {code} (−{p} %)' },
  promoLabel: { en: 'Discount code', es: 'Código de descuento' },
  promoApply: { en: 'Apply', es: 'Aplicar' },
  promoRemove: { en: 'Remove', es: 'Quitar' },
  promoChecking: { en: 'Checking…', es: 'Comprobando…' },
  promoOk: { en: '{p}% off the planning fee', es: '{p} % de descuento en los honorarios' },
  promoErr: {
    invalid: { en: 'That code isn’t valid.', es: 'Ese código no es válido.' },
    expired: { en: 'That code has expired.', es: 'Ese código ha caducado.' },
    used: { en: 'That code has already been used up.', es: 'Ese código ya se ha agotado.' },
    rate: { en: 'Too many tries. Please try again later.', es: 'Demasiados intentos. Prueba más tarde.' },
    network: { en: 'The code couldn’t be checked right now. Add it to your enquiry and Maryann will confirm it.', es: 'No se ha podido comprobar el código ahora. Añádelo a tu consulta y Maryann lo confirmará.' },
  },
  promoNote: { en: 'Codes apply to Maryann’s planning fee only, never to flights, stays, venues or other supplier costs.', es: 'Los códigos se aplican solo a los honorarios de planificación de Maryann, nunca a vuelos, alojamientos, espacios ni otros costes de proveedores.' },
  estTotalShort: { en: 'Estimated fee', es: 'Honorarios estimados' },
  decrease: { en: 'Remove one', es: 'Quitar uno' },
  increase: { en: 'Add one', es: 'Añadir uno' },
  enqTitle: { en: 'Tell Maryann what you are planning', es: 'Cuenta a Maryann qué estás planeando' },
  enqLead: { en: 'Three short steps. When you send it, your enquiry goes straight to Maryann and you get a copy by email. Nothing is stored on this website.', es: 'Tres pasos cortos. Al enviarla, tu consulta llega directamente a Maryann y recibes una copia por correo. Nada se guarda en esta web.' },
  step: { en: 'Step {n} of 3', es: 'Paso {n} de 3' },
  back: { en: 'Back', es: 'Atrás' },
  continue: { en: 'Continue', es: 'Continuar' },
  sendWa: { en: 'Send on WhatsApp', es: 'Enviar por WhatsApp' },
  sendSite: { en: 'Send enquiry', es: 'Enviar consulta' },
  sending: { en: 'Sending…', es: 'Enviando…' },
  sentTitle: { en: 'Thank you. Your enquiry is on its way.', es: 'Gracias. Tu consulta está en camino.' },
  sentBody: { en: 'Maryann replies personally to {email}, as soon as she can. A copy of your message is on its way to you.', es: 'Maryann te responde personalmente a {email} lo antes posible. Te llega una copia de tu mensaje.' },
  sentFail: { en: 'That didn’t send. Try WhatsApp, or copy the message and email it to {email}.', es: 'No se ha podido enviar. Prueba por WhatsApp, o copia el mensaje y envíalo a {email}.' },
  altSend: { en: 'Prefer to send it yourself?', es: '¿Prefieres enviarlo tú?' },
  // Consultation-call booking offered after an enquiry is sent (worker/booking.js).
  bookTitle: { en: 'Book your consultation call now', es: 'Reserva ya tu llamada de consulta' },
  bookLead: { en: 'Pick a time and Maryann calls you. Times are Madrid time, with your local time in brackets.', es: 'Elige una hora y Maryann te llama. Horas de Madrid, con tu hora local entre paréntesis.' },
  bookBtn: { en: 'Book this time', es: 'Reservar esta hora' },
  bookDone: { en: 'Booked: {when}. The calendar invite is on its way to {email}.', es: 'Reservada: {when}. La invitación de calendario va de camino a {email}.' },
  bookFail: { en: 'That time has just gone. Pick another.', es: 'Esa hora se acaba de ocupar. Elige otra.' },
  bookNone: { en: 'No free times in the next two weeks. Maryann will suggest one when she replies.', es: 'No hay horas libres en las próximas dos semanas. Maryann te propondrá una al responder.' },
  bookSkip: { en: 'Or wait for Maryann’s reply and find a time together.', es: 'O espera la respuesta de Maryann y buscáis una hora.' },
  nextStart: { en: 'Next available start: {d}', es: 'Próximo inicio disponible: {d}' },
  waClosed: { en: 'replies from {t} CET', es: 'responde desde las {t} CET' },
  sendEmail: { en: 'Send by email', es: 'Enviar por correo' },
  copyMsg: { en: 'Copy message', es: 'Copiar mensaje' },
  copied: { en: 'Message copied.', es: 'Mensaje copiado.' },
  opened: { en: 'Your message has opened in a new tab. If nothing happened, copy it and send it to {wa} or {email}.', es: 'Tu mensaje se ha abierto en otra pestaña. Si no ha pasado nada, cópialo y envíalo al {wa} o a {email}.' },
  q1: { en: 'What are you planning?', es: '¿Qué estás planeando?' },
  choosePlan: { en: 'Choose one option to continue.', es: 'Elige una opción para continuar.' },
  required: { en: 'Please fill this in.', es: 'Rellena este campo.' },
  emailInvalid: { en: 'Enter an email address like name@example.com.', es: 'Escribe un correo como nombre@ejemplo.com.' },
  mustTick: { en: 'Tick this box to send your enquiry.', es: 'Marca esta casilla para enviar tu consulta.' },
  optional: { en: 'optional', es: 'opcional' },
  yourDetails: { en: 'Your details', es: 'Tus datos' },
  name: { en: 'Your name', es: 'Tu nombre' },
  email: { en: 'Email', es: 'Correo electrónico' },
  phone: { en: 'WhatsApp number', es: 'Número de WhatsApp' },
  lang: { en: 'Preferred language', es: 'Idioma preferido' },
  notes: { en: 'Anything else Maryann should know', es: 'Algo más que Maryann deba saber' },
  estimateAttached: { en: 'Estimate attached', es: 'Presupuesto adjunto' },
  removeEstimate: { en: 'Remove', es: 'Quitar' },
  boundTitle: { en: 'What Maryann does and doesn’t do', es: 'Qué hace Maryann y qué no' },
  boundText: {
    en: 'Maryann plans and books travel, and researches and compares venues. She is not a wedding planner, décor designer or on-site coordinator, unless you add on-site presence to The Whole Event. When she makes bookings for you, they’re in your name and paid by you directly to each supplier. Venue contracts are always between you and the venue.',
    es: 'Maryann planifica y reserva viajes, e investiga y compara espacios. No es wedding planner, decoradora ni coordinadora in situ, salvo que añadas la presencia en el evento a The Whole Event. Cuando hace reservas por ti, van a tu nombre y las pagas tú directamente a cada proveedor. Los contratos con los espacios son siempre entre tú y el espacio.'
  },
  tickBound: { en: 'I have read what Maryann does and doesn’t do.', es: 'He leído qué hace y qué no hace Maryann.' },
  tickPrivacy: { en: 'I agree to my details being used to reply to this enquiry, as described in the', es: 'Acepto que mis datos se usen para responder a esta consulta, según el' },
  privacyLink: { en: 'privacy notice', es: 'aviso de privacidad' },
  // The checkout statement (client's wording, 5 Oct 2026), required before an enquiry can be sent.
  tickTermsA: { en: 'I agree to the', es: 'Acepto las' },
  tickTermsLink: { en: 'Terms of Service', es: 'Condiciones del servicio' },
  tickTermsB: { en: ', including the 14-day pro-rata cancellation policy, and confirm that all third-party bookings will be made using my personal details and payment card.', es: ', incluida la política de cancelación proporcional de 14 días, y confirmo que todas las reservas con terceros se harán con mis datos personales y mi tarjeta de pago.' },
  termsAccepted: { en: 'Terms of Service and 14-day pro-rata cancellation policy: accepted', es: 'Condiciones del servicio y política de cancelación proporcional de 14 días: aceptadas' },
  legalLink: { en: 'Legal notice', es: 'Aviso legal' },
  footLangs: { en: 'English and Spanish', es: 'Inglés y español' },
  langNames: { en: 'English', es: 'Español' },
};

const PLAN_CHOICES = [
  { id: 'proposal', service: 'events', tier: 0, label: { en: 'A proposal abroad', es: 'Una pedida en el extranjero' }, hint: { en: 'Just the two of you', es: 'Solo vosotros dos' } },
  { id: 'event', service: 'events', tier: 1, label: { en: 'A wedding or event with guests travelling', es: 'Una boda o evento con invitados que viajan' }, hint: { en: 'Guest travel, stays and schedules', es: 'Viajes, alojamiento y horarios de invitados' } },
  { id: 'venue', service: 'venues', tier: 0, label: { en: 'Finding a wedding destination or venue', es: 'Encontrar destino o espacio para la boda' }, hint: { en: 'Where, and which venue', es: 'Dónde y en qué espacio' } },
  { id: 'trip', service: 'travel', tier: 0, label: { en: 'A trip or holiday', es: 'Un viaje o unas vacaciones' }, hint: { en: 'Solo, couple or group', es: 'Solo, en pareja o en grupo' } },
];

// Step 2 questions per plan choice. type: text | select | number | textarea
const QUESTIONS = {
  proposal: [
    { id: 'dest', type: 'text', req: true, label: { en: 'Where are you thinking of?', es: '¿En qué lugar estás pensando?' }, ph: { en: 'A city, a country, or “not sure yet”', es: 'Una ciudad, un país o “aún no lo sé”' } },
    { id: 'dates', type: 'text', req: true, label: { en: 'Rough dates', es: 'Fechas aproximadas' }, ph: { en: 'For example, late May 2027', es: 'Por ejemplo, finales de mayo de 2027' } },
    { id: 'from', type: 'text', req: true, label: { en: 'Travelling from', es: 'Desde dónde viajáis' }, ph: { en: 'City', es: 'Ciudad' } },
    { id: 'budget', type: 'select', req: true, label: { en: 'Trip budget, not including the planning fee', es: 'Presupuesto del viaje, sin los honorarios de planificación' }, opts: [{ en: 'Up to €2,000', es: 'Hasta 2.000 €' }, { en: '€2,000 to €5,000', es: 'De 2.000 € a 5.000 €' }, { en: 'More than €5,000', es: 'Más de 5.000 €' }, { en: 'Not sure yet', es: 'Aún no lo sé' }] },
  ],
  event: [
    { id: 'occasion', type: 'select', req: true, label: { en: 'The occasion', es: 'La ocasión' }, opts: [{ en: 'Destination wedding', es: 'Boda en destino' }, { en: 'Anniversary or milestone celebration', es: 'Aniversario o celebración especial' }, { en: 'Something else', es: 'Otra cosa' }] },
    { id: 'dest', type: 'text', req: true, label: { en: 'Destination or venue', es: 'Destino o espacio' }, ph: { en: 'Or “not chosen yet”', es: 'O “aún sin elegir”' } },
    { id: 'dates', type: 'text', req: true, label: { en: 'Rough dates', es: 'Fechas aproximadas' }, ph: { en: 'For example, September 2027', es: 'Por ejemplo, septiembre de 2027' } },
    { id: 'guests', type: 'select', req: true, label: { en: 'Guests travelling, not counting the couple', es: 'Invitados que viajan, sin contar a la pareja' }, opts: [{ en: 'Up to 20', es: 'Hasta 20' }, { en: '21 to 40', es: 'De 21 a 40' }, { en: 'More than 40', es: 'Más de 40' }] },
    { id: 'from', type: 'text', req: true, label: { en: 'Where guests are travelling from', es: 'Desde dónde viajan los invitados' }, ph: { en: 'For example, London, Lagos and Madrid', es: 'Por ejemplo, Londres, Lagos y Madrid' } },
    { id: 'days', type: 'select', req: true, label: { en: 'How many event days?', es: '¿Cuántos días de evento?' }, opts: [{ en: 'One weekend', es: 'Un fin de semana' }, { en: 'Up to 4 days, with a honeymoon', es: 'Hasta 4 días, con luna de miel' }, { en: 'Not sure yet', es: 'Aún no lo sé' }] },
  ],
  venue: [
    { id: 'stage', type: 'select', req: true, label: { en: 'Where are you up to?', es: '¿En qué punto estáis?' }, opts: [{ en: 'We haven’t chosen a country or region', es: 'No hemos elegido país ni región' }, { en: 'We have a destination and need venues', es: 'Tenemos destino y buscamos espacios' }, { en: 'We have venues in mind and want them checked', es: 'Tenemos espacios en mente y queremos comprobarlos' }] },
    { id: 'dest', type: 'text', req: false, label: { en: 'Destination, if chosen', es: 'Destino, si ya lo tenéis' }, ph: { en: 'Country or region', es: 'País o región' } },
    { id: 'season', type: 'text', req: true, label: { en: 'Season and year', es: 'Temporada y año' }, ph: { en: 'For example, summer 2027', es: 'Por ejemplo, verano de 2027' } },
    { id: 'guests', type: 'select', req: true, label: { en: 'Guest numbers', es: 'Número de invitados' }, opts: [{ en: 'Up to 50', es: 'Hasta 50' }, { en: '51 to 100', es: 'De 51 a 100' }, { en: '101 to 150', es: 'De 101 a 150' }, { en: 'More than 150', es: 'Más de 150' }] },
    { id: 'ceremony', type: 'select', req: true, label: { en: 'The ceremony', es: 'La ceremonia' }, opts: [{ en: 'We want it legally binding on location', es: 'Queremos que sea legal en el destino' }, { en: 'A symbolic ceremony is perfect', es: 'Una ceremonia simbólica es perfecta' }, { en: 'Not sure yet', es: 'Aún no lo sabemos' }] },
    { id: 'faith', type: 'text', req: false, label: { en: 'Faith or ceremony needs', es: 'Necesidades religiosas o de ceremonia' }, ph: { en: 'For example, a church blessing', es: 'Por ejemplo, una bendición en iglesia' } },
    { id: 'budget', type: 'select', req: true, label: { en: 'Venue and catering budget', es: 'Presupuesto de espacio y catering' }, opts: [{ en: 'Up to €15,000', es: 'Hasta 15.000 €' }, { en: '€15,000 to €40,000', es: 'De 15.000 € a 40.000 €' }, { en: 'More than €40,000', es: 'Más de 40.000 €' }, { en: 'Not sure yet', es: 'Aún no lo sabemos' }] },
  ],
  trip: [
    { id: 'help', type: 'select', req: true, label: { en: 'How much help would you like?', es: '¿Cuánta ayuda necesitas?' }, opts: [{ en: 'A plan I book myself', es: 'Un plan que reservo yo' }, { en: 'Plan it and book it for me', es: 'Que lo planifiques y lo reserves' }, { en: 'A group trip, booked for everyone', es: 'Un viaje en grupo, reservado para todos' }] },
    { id: 'dest', type: 'text', req: true, label: { en: 'Where would you like to go?', es: '¿Adónde te gustaría ir?' }, ph: { en: 'Or the kind of trip you want', es: 'O el tipo de viaje que buscas' } },
    { id: 'dates', type: 'text', req: true, label: { en: 'Dates and length', es: 'Fechas y duración' }, ph: { en: 'For example, 7 days in April', es: 'Por ejemplo, 7 días en abril' } },
    { id: 'people', type: 'number', req: true, min: 1, max: 60, label: { en: 'Number of travellers', es: 'Número de viajeros' } },
    { id: 'from', type: 'text', req: true, label: { en: 'Travelling from', es: 'Desde dónde viajas' }, ph: { en: 'City', es: 'Ciudad' } },
    { id: 'budget', type: 'select', req: true, label: { en: 'Budget per person, not including the planning fee', es: 'Presupuesto por persona, sin los honorarios de planificación' }, opts: [{ en: 'Up to €800', es: 'Hasta 800 €' }, { en: '€800 to €2,000', es: 'De 800 € a 2.000 €' }, { en: 'More than €2,000', es: 'Más de 2.000 €' }, { en: 'Not sure yet', es: 'Aún no lo sé' }] },
  ],
};

const VISA = {
  title: { en: 'Visa guidance', es: 'Visados' },
  items: [
    { en: 'UK and Schengen visitor visas only, offered as a separate document-checking and administrative support service with its own fee. This service is not immigration advice, and Maison Eniola does not represent you to any government or consulate.', es: 'Solo visados de visita para Reino Unido y Schengen, como un servicio aparte de revisión de documentos y apoyo administrativo, con su propia tarifa. No es asesoramiento de inmigración y no te represento ante ningún gobierno ni consulado.' },
    { en: 'The service fee is paid in full upfront and is separate from the government application fee. Visa decisions rest entirely with consular officers, so the fee is not refunded because of a refusal, a policy change or processing delays.', es: 'La tarifa se paga por adelantado y es independiente de la tasa oficial de solicitud. La decisión corresponde únicamente a los funcionarios consulares, por lo que la tarifa no se reembolsa por una denegación, un cambio normativo o retrasos en la tramitación.' },
    { en: 'If you cancel before Maryann begins reviewing your documents, the fee is refunded in full. If you ask her to begin within your 14-day cancellation period and then cancel, you pay only for the work already done.', es: 'Si cancelas antes de que Maryann empiece a revisar tus documentos, se reembolsa íntegramente. Si le pides empezar dentro de tu plazo de desistimiento de 14 días y luego cancelas, solo pagas el trabajo ya realizado.' },
    { en: 'Nothing in these terms affects your statutory consumer rights.', es: 'Nada de estas condiciones afecta a tus derechos legales como consumidor.' },
  ],
};
const MASS = { en: 'Mass disruption support: widespread emergencies (strikes, airline shutdowns, insolvency) are managed at an emergency rate of €75 per hour, pre-approved by you before work begins.', es: 'Incidencias masivas: las emergencias generalizadas (huelgas, cierres de aerolíneas, insolvencias) se gestionan a una tarifa de urgencia de 75 € por hora, que apruebas antes de que empiece el trabajo.' };
/* 14-day cancellation right for distance contracts; the visa terms above follow the same pattern. */
const CANCEL_14 = { en: '14-day right to cancel: you have a 14-day right to cancel after booking. If you ask Maryann to start working immediately during this time, any refund is strictly calculated based on the work left to be done:', es: 'Derecho de desistimiento de 14 días: tienes 14 días desde la contratación para cancelar. Si pides a Maryann que empiece a trabajar de inmediato durante ese plazo, el reembolso se calcula estrictamente según el trabajo que quede por hacer:',
  sub: [
    { en: 'Partial work: you are only refunded for the uncompleted portion of the project. For example, if 40% of the planning work is already done, only 60% of your deposit is refundable.', es: 'Trabajo parcial: solo se reembolsa la parte del proyecto que no se ha realizado. Por ejemplo, si ya está hecho el 40 % de la planificación, solo es reembolsable el 60 % de tu depósito.' },
    { en: 'Full work: if all planning work has been completed and delivered before the 14 days are up, the service is fully executed and no refund is issued.', es: 'Trabajo completo: si toda la planificación se ha completado y entregado antes de que terminen los 14 días, el servicio se ha prestado por completo y no hay reembolso.' },
  ] };
const PRE_CONSULT = { en: 'Pre-consultation: cancel before your initial consultation call for a full refund.', es: 'Antes de la consulta: si cancelas antes de la primera llamada de consulta, se te reembolsa todo.' };
const AFTER_14 = { en: 'After 14 days: all fees paid are non-refundable, as they directly cover the planning work completed up to that date.', es: 'Pasados 14 días: lo pagado no es reembolsable, porque cubre directamente el trabajo de planificación realizado hasta esa fecha.' };
const DIRECT = { en: 'Direct booking details: while Maryann handles the research, coordination and setup, actual reservations with airlines, hotels and operators are made directly using the client’s own details and payment cards, so you retain full ownership and control over your travel bookings.', es: 'Reservas a tu nombre: Maryann se ocupa de la investigación, la coordinación y la preparación, pero las reservas con aerolíneas, hoteles y operadores se hacen directamente con tus propios datos y tarjetas de pago, para que conserves la titularidad y el control total de tus reservas.' };
const RUSH = { en: 'Rush bookings: a 30% add-on fee applies to the base price for last-minute requests.', es: 'Reservas urgentes: para las solicitudes de última hora se aplica un extra del 30 % sobre el precio base.' };
const DISCOUNT = { en: 'Discounts: promo codes apply strictly to planning fees, not supplier costs. Limit one code per booking.', es: 'Descuentos: los códigos promocionales se aplican solo a los honorarios de planificación, nunca a los costes de proveedores. Un código por reserva.' };
const STATUTORY = { en: 'Nothing in these terms affects your statutory consumer rights.', es: 'Nada de estas condiciones afecta a tus derechos legales como consumidor.' };
const PLAN_FEES = { en: 'What fees cover: planning fees cover expertise and time only. You pay suppliers (flights, hotels, visas and so on) directly.', es: 'Qué cubren los honorarios: los honorarios de planificación cubren solo experiencia y tiempo. A los proveedores (vuelos, hoteles, visados, etc.) les pagas tú directamente.' };
const NO_COMM = { en: 'Zero hidden commissions: no markups are added to supplier costs. Any supplier commissions are fully disclosed to you.', es: 'Sin comisiones ocultas: no se añade ningún margen a los costes de los proveedores. Cualquier comisión de un proveedor se te comunica con total transparencia.' };
const SUPPLIER = { en: 'Supplier fees: any third-party cancellation or change fees are set by the airline, hotel or operator and are paid by the traveller.', es: 'Gastos de proveedores: los gastos de cancelación o cambio de terceros los fija la aerolínea, el hotel o el operador y los paga el viajero.' };

const SERVICES = [
  {
    key: 'events',
    tab: { en: 'Weddings, events and proposals', es: 'Bodas, eventos y pedidas' },
    short: { en: 'Weddings and proposals', es: 'Bodas y pedidas' },
    title: { en: 'The moment is yours. The rest is handled.', es: 'El momento es vuestro. Del resto se ocupa Maryann.' },
    lead: { en: 'Destination weddings, milestone trips and the proposal you have been imagining. Maryann handles the flights, the stays, the timing and everyone arriving where they should be.', es: 'Bodas en destino, viajes para celebrar y la pedida que llevas tiempo imaginando. Maryann se ocupa de los vuelos, el alojamiento, los horarios y de que todo el mundo llegue donde debe.' },
    tiers: [
      {
        name: 'The Proposal', pick: { en: 'I’m planning a proposal', es: 'Estoy preparando una pedida' }, sub: { en: 'Just the two of you', es: 'Solo vosotros dos' }, price: 450, plus: false,
        best: { en: 'A surprise proposal abroad, planned in private', es: 'Una pedida sorpresa en el extranjero, planeada con discreción' },
        rows: [
          [{ en: 'Consultation call', es: 'Llamada de consulta' }, { en: 'A 60-minute call on your story, style, budget and dates. Everything agreed is confirmed to you in writing.', es: 'Una llamada de 60 minutos sobre vuestra historia, estilo, presupuesto y fechas. Todo lo acordado se confirma por escrito.' }],
          [{ en: 'The place, the timing, the light', es: 'El lugar, el momento, la luz' }, { en: 'Two or three proposal spots compared, with golden-hour times, crowd levels at that hour and a weather back-up for each.', es: 'Dos o tres lugares comparados, con la hora dorada, la afluencia a esa hora y un plan B por si llueve en cada uno.' }],
          [{ en: 'Flights and stays curated', es: 'Vuelos y alojamientos seleccionados' }, { en: 'Flight and stay recommendations provided with safe direct-booking links, chosen for privacy and atmosphere. You book them yourself.', es: 'Recomendaciones de vuelos y alojamientos con enlaces seguros para reservar directamente, elegidos por su intimidad y ambiente. Las reservas las haces tú.' }],
          [{ en: 'Privacy and discretion planned', es: 'Discreción planificada' }, { en: 'All messages go to you only. Confirmations stay surprise-safe, and a cover plan is prepared for the day.', es: 'Todos los mensajes van solo a ti. Las confirmaciones no delatan la sorpresa y se prepara una excusa para ese día.' }],
          [{ en: 'Restaurant or viewpoint held', es: 'Restaurante o mirador reservado' }, { en: 'A table, private corner or viewpoint reserved for the moment, with the timing agreed with the venue.', es: 'Una mesa, un rincón privado o un mirador reservado para el momento, con la hora acordada con el lugar.' }],
          [{ en: 'Proposal-day timeline', es: 'Horario del día de la pedida' }, { en: 'A simple minute-by-minute plan of where to be, when to be there and what is already arranged.', es: 'Un plan sencillo, minuto a minuto: dónde estar, a qué hora y qué está ya organizado.' }],
        ],
        scope: { en: '2 travellers, 1 destination, up to 5 nights, 1 proposal moment', es: '2 viajeros, 1 destino, hasta 5 noches, 1 pedida' },
        turn: { en: '10 working days from the consultation call', es: '10 días laborables desde la llamada de consulta' },
        work: { en: 'Around 9 hours of planning, research and discreet supplier contact', es: 'Unas 9 horas de planificación, investigación y contacto discreto con proveedores' },
        addons: [
          { id: 'photo', type: 'toggle', price: 90, label: { en: 'Photographer sourcing and briefing', es: 'Búsqueda e instrucciones al fotógrafo' } },
          { id: 'florist', type: 'toggle', price: 120, label: { en: 'Florist or décor set-up coordinated with the supplier', es: 'Floristería o decoración coordinada con el proveedor' } },
          { id: 'dest', type: 'toggle', price: 120, label: { en: 'Extra destination on the trip', es: 'Destino adicional en el viaje' } },
          { id: 'rush', type: 'pct', pct: 30, label: { en: 'Rush planning (proposal within 3 weeks)', es: 'Planificación urgente (pedida en menos de 3 semanas)' } },
        ],
      },
      {
        name: 'Guest Travel', pick: { en: 'Our guests are travelling to us', es: 'Nuestros invitados viajan hasta nosotros' }, sub: { en: 'Your people, handled', es: 'Tus invitados, atendidos' }, price: 950, plus: false,
        best: { en: 'Couples and families bringing guests from several cities', es: 'Parejas y familias con invitados que llegan desde varias ciudades' },
        rows: [
          [{ en: 'Everything in The Proposal', es: 'Todo lo de The Proposal' }, { en: 'Consultation, planning and a held reservation where needed, plus flights and stays booked for the couple.', es: 'Consulta, planificación y reserva de mesa o lugar cuando haga falta, además de vuelos y alojamiento reservados para la pareja.' }],
          [{ en: 'Arrivals from any city', es: 'Llegadas desde cualquier ciudad' }, { en: 'Best routes and fares found for each household’s departure city, with arrivals timed around the event.', es: 'Las mejores rutas y tarifas para la ciudad de salida de cada hogar, con llegadas coordinadas con el evento.' }],
          [{ en: 'Room options at every budget', es: 'Habitaciones para cada presupuesto' }, { en: 'Three price levels near the venue. Group room rates are requested wherever hotels offer them.', es: 'Tres niveles de precio cerca del espacio. Se piden tarifas de grupo cuando los hoteles las ofrecen.' }],
          [{ en: 'One itinerary everyone can follow', es: 'Un itinerario para todos' }, { en: 'A shared weekend guide covering arrivals, dress notes, meeting points, timings and key contacts.', es: 'Una guía del fin de semana con llegadas, código de vestimenta, puntos de encuentro, horarios y contactos.' }],
          [{ en: 'Costs split per household', es: 'Costes divididos por hogar' }, { en: 'Each household receives its own cost sheet and pays its own bookings. You never chase anyone for money.', es: 'Cada hogar recibe su hoja de costes y paga sus propias reservas. Nunca tendrás que reclamar dinero a nadie.' }],
          [{ en: 'Confirmations sent to each guest', es: 'Confirmaciones a cada invitado' }, { en: 'Every household gets its own confirmations and travel details directly.', es: 'Cada hogar recibe directamente sus confirmaciones y datos de viaje.' }],
          [{ en: 'Reachable across the weekend', es: 'Disponible todo el fin de semana' }, { en: 'A dedicated WhatsApp line for guests from Friday to Monday, 8:00 to 22:00 CET.', es: 'Una línea de WhatsApp para invitados de viernes a lunes, de 8:00 a 22:00 CET.' }],
        ],
        scope: { en: 'Couple plus up to 20 guests (up to 10 households), 1 destination, 1 event weekend', es: 'Pareja y hasta 20 invitados (hasta 10 hogares), 1 destino, 1 fin de semana' },
        turn: { en: '14 working days, with guest confirmations sent as bookings land', es: '14 días laborables; las confirmaciones se envían según se cierran las reservas' },
        work: { en: 'Around 19 hours, most of it coordinating guest bookings', es: 'Unas 19 horas, la mayoría coordinando reservas de invitados' },
        addons: [
          { id: 'hh', type: 'qty', price: 45, max: 20, label: { en: 'Each additional household (up to 2 people)', es: 'Cada hogar adicional (hasta 2 personas)' } },
          { id: 'pack', type: 'toggle', price: 90, label: { en: 'Printed-style guest welcome pack (PDF)', es: 'Pack de bienvenida para invitados (PDF)' } },
          { id: 'airport', type: 'qty', price: 90, max: 4, unit: { en: 'per day', es: 'por día' }, label: { en: 'Airport arrival-day coordination', es: 'Coordinación de llegadas al aeropuerto' } },
          { id: 'loc', type: 'toggle', price: 250, label: { en: 'Second event location', es: 'Segunda ubicación del evento' } },
        ],
      },
      {
        name: 'The Whole Event', pick: { en: 'We want the whole event handled', es: 'Queremos que se ocupe de todo el evento' }, sub: { en: 'Ceremony to honeymoon', es: 'De la ceremonia a la luna de miel' }, price: 2400, plus: true,
        best: { en: 'Multi-day destination weddings with a honeymoon', es: 'Bodas en destino de varios días, con luna de miel' },
        rows: [
          [{ en: 'Everything in Guest Travel', es: 'Todo lo de Guest Travel' }, { en: 'Full guest travel coordination, cost splitting, confirmations and weekend support.', es: 'Coordinación completa de viajes de invitados, reparto de costes, confirmaciones y apoyo durante el fin de semana.' }],
          [{ en: 'Multi-day schedule built', es: 'Programa de varios días' }, { en: 'A day-by-day plan from welcome dinner to farewell brunch, including run-sheets for each travel day.', es: 'Un plan día a día, de la cena de bienvenida al brunch de despedida, con hojas de ruta para cada día de viaje.' }],
          [{ en: 'Transfers between venues', es: 'Traslados entre espacios' }, { en: 'Coaches and cars booked, pick-up lists and timings set, and drivers briefed with named contacts.', es: 'Autocares y coches reservados, listas y horarios de recogida, y conductores informados con contactos.' }],
          [{ en: 'Honeymoon planned', es: 'Luna de miel planificada' }, { en: 'A separate itinerary for the two of you, with stays and experiences booked around your rest.', es: 'Un itinerario aparte para los dos, con alojamiento y experiencias pensados para descansar.' }],
          [{ en: 'Cancellations covered', es: 'Cancelaciones cubiertas' }, { en: 'If a flight or stay falls through during the event window, Maryann handles the rebooking as part of the package, with no extra fee for the work. Widespread disruption such as strikes is covered in the terms below.', es: 'Si un vuelo o alojamiento falla durante las fechas del evento, Maryann se ocupa de volver a reservar como parte del paquete, sin coste adicional por el trabajo. Las incidencias masivas, como huelgas, se tratan en las condiciones.' }],
          [{ en: 'Final pre-travel briefing', es: 'Repaso final antes del viaje' }, { en: 'A call one week before, so every confirmation, time and contact is checked and in one place.', es: 'Una llamada una semana antes para revisar cada confirmación, horario y contacto, todo en un mismo sitio.' }],
        ],
        scope: { en: 'Couple plus up to 40 guests, up to 4 event days, and a honeymoon of up to 10 nights', es: 'Pareja y hasta 40 invitados, hasta 4 días de evento y una luna de miel de hasta 10 noches' },
        turn: { en: 'Planning starts 4 to 12 months before; support runs to the end of the honeymoon', es: 'La planificación empieza entre 4 y 12 meses antes; el apoyo dura hasta el final de la luna de miel' },
        work: { en: 'Around 45 or more hours across planning, coordination and live support', es: 'Unas 45 horas o más de planificación, coordinación y apoyo en directo' },
        addons: [
          { id: 'g10', type: 'qty', price: 350, max: 10, unit: { en: 'per 10 guests', es: 'por cada 10 invitados' }, label: { en: 'Every additional 10 guests', es: 'Cada 10 invitados adicionales' } },
          { id: 'onsite', type: 'qty', price: 380, max: 4, unit: { en: 'per day', es: 'por día' }, travel: true, label: { en: 'On-site presence during the event', es: 'Presencia en el evento' } },
          { id: 'honey', type: 'toggle', price: 180, label: { en: 'Honeymoon beyond 10 nights or a second country', es: 'Luna de miel de más de 10 noches o en un segundo país' } },
          { id: 'venue', type: 'ref', label: { en: 'Venue sourcing', es: 'Búsqueda de espacios' }, refText: { en: 'Priced separately under Venue sourcing', es: 'Se presupuesta aparte en Búsqueda de espacios' } },
        ],
        note: { en: 'The Whole Event covers travel, stays, transfers and schedules. Full wedding production (décor, vendors, ceremony direction) and venue sourcing are separate services, quoted on request.', es: 'The Whole Event cubre viajes, alojamiento, traslados y horarios. La producción completa de la boda (decoración, proveedores, dirección de la ceremonia) y la búsqueda de espacios son servicios aparte, con presupuesto a petición.' },
      },
    ],
    steps: [
      [{ en: 'Message Maryann', es: 'Escribe a Maryann' }, { en: 'Tell Maryann the occasion, the rough dates, where guests are coming from and a budget range.', es: 'Cuenta a Maryann la ocasión, las fechas aproximadas, de dónde vienen los invitados y un rango de presupuesto.' }],
      [{ en: 'Consultation call', es: 'Llamada de consulta' }, { en: 'You agree the scope together, and Maryann confirms the package, any add-ons and your final fee in writing.', es: 'Acordáis el alcance y Maryann te confirma por escrito el paquete, los extras y la tarifa final.' }],
      [{ en: 'Deposit and planning', es: 'Anticipo y planificación' }, { en: 'Once the deposit is paid, Maryann researches, compares and sends you options to approve.', es: 'Con el anticipo pagado, Maryann investiga, compara y te envía opciones para aprobar.' }],
      [{ en: 'Bookings and confirmations', es: 'Reservas y confirmaciones' }, { en: 'Approved bookings are made and confirmations reach you and each guest.', es: 'Se hacen las reservas aprobadas y las confirmaciones te llegan a ti y a cada invitado.' }],
      [{ en: 'You just show up', es: 'Tú solo tienes que llegar' }, { en: 'Maryann stays reachable across the dates in your package.', es: 'Sigo disponible durante las fechas de tu paquete.' }],
    ],
    terms: [
      [{ en: 'Payment terms', es: 'Pagos' }, [
        { en: 'The Proposal: 50% to begin and 50% when your plan and proposal-day timeline are delivered.', es: 'The Proposal: 50 % para empezar y 50 % al entregar tu plan y el horario del día de la pedida.' },
        { en: 'Guest Travel: 50% to begin and 50% when the guest itinerary is issued.', es: 'Guest Travel: 50 % para empezar y 50 % al entregar el itinerario de invitados.' },
        { en: 'The Whole Event: 50% to begin and 50% when the work is complete and your final plan is delivered.', es: 'The Whole Event: 50 % para empezar y 50 % cuando el trabajo esté completo y se entregue el plan final.' },
        DIRECT, PLAN_FEES, NO_COMM, RUSH, DISCOUNT]],
      [{ en: 'Changes & cancellations', es: 'Cambios y cancelaciones' }, [
        PRE_CONSULT, CANCEL_14, AFTER_14, SUPPLIER,
        { en: 'Included rebooking support: for The Whole Event, Maryann handles all rebooking work for free if an individual booking falls through. The traveller covers any new fares or supplier penalties.', es: 'Cambios de reserva incluidos: en The Whole Event, Maryann se ocupa sin coste de todo el trabajo de volver a reservar si falla una reserva individual. El viajero paga las nuevas tarifas o penalizaciones del proveedor.' },
        MASS, STATUTORY]],
      [VISA.title, VISA.items],
    ],
  },
  {
    key: 'venues',
    tab: { en: 'Venue sourcing', es: 'Búsqueda de espacios' },
    short: { en: 'Venue sourcing', es: 'Búsqueda de espacios' },
    title: { en: 'You know the wedding you want. Maryann knows where.', es: 'Sabes la boda que quieres. Maryann sabe dónde.' },
    lead: { en: 'Say fairytale and most people say Spain. Maryann might say Iceland, and show you why. She researches destinations and venues against the wedding you described, then tells you the truth about each one.', es: 'Dices boda de cuento y casi todos piensan en España. Maryann quizá diga Islandia, y te explique por qué. Investiga destinos y espacios según la boda que le describes y te cuenta la verdad de cada uno.' },
    tiers: [
      {
        name: 'Destination Match', pick: { en: 'We don’t know where yet', es: 'Aún no sabemos dónde' }, sub: { en: 'Where, and why there', es: 'Dónde, y por qué allí' }, price: 350, plus: false,
        best: { en: 'Couples who haven’t chosen a country or region yet', es: 'Parejas que aún no han elegido país ni región' },
        rows: [
          [{ en: 'Consultation call', es: 'Llamada de consulta' }, { en: 'A 60-minute call on your vision, guest numbers, faith or ceremony needs, season and budget, captured as a written brief.', es: 'Una llamada de 60 minutos sobre vuestra idea, invitados, necesidades religiosas o de ceremonia, temporada y presupuesto, recogida en un briefing escrito.' }],
          [{ en: 'Three destinations ranked', es: 'Tres destinos clasificados' }, { en: 'Each one scored against your brief, with a plain-language reason for the ranking.', es: 'Cada uno puntuado según vuestro briefing, con una explicación clara de la clasificación.' }],
          [{ en: 'Season, light and weather risk', es: 'Temporada, luz y riesgo meteorológico' }, { en: 'Month-by-month conditions, sunset times, and the risk of rain, wind or heat for your likely dates.', es: 'Condiciones mes a mes, hora de la puesta de sol y riesgo de lluvia, viento o calor en vuestras fechas probables.' }],
          [{ en: 'Guest access assessed', es: 'Acceso de invitados' }, { en: 'Flight routes from your main guest cities, transfer times and visa exposure for guest nationalities.', es: 'Rutas de vuelo desde las principales ciudades de vuestros invitados, tiempos de traslado y necesidad de visado según nacionalidades.' }],
          [{ en: 'Cost bracket per destination', es: 'Rango de costes por destino' }, { en: 'Typical ranges for venue hire, catering per head and guest accommodation.', es: 'Rangos habituales de alquiler de espacio, catering por persona y alojamiento de invitados.' }],
          [{ en: 'Written report', es: 'Informe escrito' }, { en: 'A clear PDF report plus a 30-minute call to walk you through it.', es: 'Un informe en PDF claro y una llamada de 30 minutos para comentarlo.' }],
        ],
        scope: { en: 'One wedding brief with three destinations researched and ranked', es: 'Un briefing de boda con tres destinos investigados y clasificados' },
        turn: { en: '7 to 10 working days from the consultation call', es: 'De 7 a 10 días laborables desde la llamada de consulta' },
        work: { en: 'Around 7 hours of research, analysis and report writing', es: 'Unas 7 horas de investigación, análisis y redacción' },
        addons: [
          { id: 'fourth', type: 'toggle', price: 90, label: { en: 'Fourth destination added to the report', es: 'Cuarto destino en el informe' } },
          { id: 'rush', type: 'pct', pct: 30, label: { en: 'Rush delivery (4 working days)', es: 'Entrega urgente (4 días laborables)' } },
        ],
        note: { en: 'The full €350 is credited against a Venue Shortlist booked within 30 days of the report.', es: 'Los 350 € se descuentan íntegros de un Venue Shortlist contratado en los 30 días siguientes al informe.' },
      },
      {
        name: 'Venue Shortlist', pick: { en: 'We know where, not which venue', es: 'Sabemos dónde, no qué espacio' }, sub: { en: 'Six to eight real options', es: 'De seis a ocho opciones reales' }, price: 850, plus: false, credit: 350,
        best: { en: 'Couples with a destination who need real venues compared', es: 'Parejas con destino que necesitan comparar espacios reales' },
        rows: [
          [{ en: 'Destination locked first', es: 'Destino fijado primero' }, { en: 'Built on your Destination Match, or on a destination you have already chosen.', es: 'A partir de vuestro Destination Match o de un destino que ya hayáis elegido.' }],
          [{ en: 'Capacity, cost and inclusions', es: 'Capacidad, coste e inclusiones' }, { en: 'A side-by-side table covering hire fee, minimum spend, catering, exclusivity and on-site rooms.', es: 'Una tabla comparativa con alquiler, gasto mínimo, catering, exclusividad y habitaciones en el lugar.' }],
          [{ en: 'Restrictions flagged early', es: 'Restricciones señaladas pronto' }, { en: 'Curfews, noise limits, outside-vendor rules, religious ceremony allowances and legal ceremony requirements.', es: 'Horarios de cierre, límites de ruido, normas sobre proveedores externos, ceremonias religiosas y requisitos de ceremonia legal.' }],
          [{ en: 'Availability for your dates', es: 'Disponibilidad en vuestras fechas' }, { en: 'Checked against published calendars or through enquiries for your preferred dates and back-up dates.', es: 'Comprobada en calendarios publicados o mediante consultas para vuestras fechas preferidas y alternativas.' }],
          [{ en: 'Airport and stay distances', es: 'Distancias a aeropuerto y alojamiento' }, { en: 'Travel times from the airport and to guest accommodation at different price levels.', es: 'Tiempos desde el aeropuerto y hasta alojamientos de invitados de distintos precios.' }],
          [{ en: 'Photos, links and a ranking', es: 'Fotos, enlaces y una clasificación' }, { en: 'Every venue presented visually with its links and Maryann’s honest ranking and reasoning.', es: 'Cada espacio presentado con imágenes, enlaces y la clasificación sincera y razonada de Maryann.' }],
        ],
        scope: { en: 'One destination with six to eight venues researched and compared side by side', es: 'Un destino con seis a ocho espacios investigados y comparados' },
        turn: { en: '10 to 14 working days', es: 'De 10 a 14 días laborables' },
        work: { en: 'Around 17 hours of venue research, checks and comparison', es: 'Unas 17 horas de investigación, comprobaciones y comparación' },
        addons: [
          { id: 'second', type: 'toggle', price: 450, label: { en: 'Second destination shortlisted', es: 'Segundo destino con selección' } },
          { id: 'extra', type: 'qty', price: 60, max: 10, unit: { en: 'each', es: 'cada uno' }, label: { en: 'Extra venues beyond eight', es: 'Espacios adicionales a partir de ocho' } },
          { id: 'rush', type: 'pct', pct: 30, label: { en: 'Rush delivery (7 working days)', es: 'Entrega urgente (7 días laborables)' } },
        ],
      },
      {
        name: 'Verified Sourcing', pick: { en: 'We want venues contacted and checked', es: 'Queremos espacios contactados y comprobados' }, sub: { en: 'Maryann speaks to them directly', es: 'Maryann habla con ellos directamente' }, price: 1950, plus: true,
        best: { en: 'Couples who want certainty before paying a venue deposit', es: 'Parejas que quieren certeza antes de pagar la reserva de un espacio' },
        rows: [
          [{ en: 'Everything in Venue Shortlist', es: 'Todo lo de Venue Shortlist' }, { en: 'The full shortlist with comparison, restrictions, availability and ranking.', es: 'La selección completa con comparación, restricciones, disponibilidad y clasificación.' }],
          [{ en: 'Venues contacted on your behalf', es: 'Contacto con los espacios' }, { en: 'Your questions asked, written quotes requested and dates held provisionally where venues allow it.', es: 'Maryann hace vuestras preguntas, pide presupuestos por escrito y bloquea fechas provisionalmente cuando el espacio lo permite.' }],
          [{ en: 'Live video walkthroughs', es: 'Visitas en vídeo en directo' }, { en: 'The top three venues walked through with you on a live video call led by Maryann, showing the spaces as they really are.', es: 'Los tres mejores espacios recorridos con vosotros en una videollamada en directo guiada por mí, tal y como son.' }],
          [{ en: 'What the website never shows', es: 'Lo que la web nunca enseña' }, { en: 'Rain plans, access and parking, sound, toilets, hidden fees and the true all-in cost, confirmed with the venue and shown on camera where possible.', es: 'Plan para lluvia, accesos y aparcamiento, sonido, aseos, costes ocultos y el precio total real, confirmados con el espacio y mostrados en cámara cuando es posible.' }],
          [{ en: 'Terms reviewed and negotiated', es: 'Condiciones revisadas y negociadas' }, { en: 'Inclusions and rates requested on your behalf, with the key contract terms summarised in plain English.', es: 'Pido inclusiones y tarifas en vuestro nombre y resumo las condiciones clave del contrato en lenguaje claro.' }],
          [{ en: 'Site verification', es: 'Verificación del espacio' }, { en: 'The base fee includes up to 3 live video walkthroughs led by Maryann. If you would prefer in-person inspections instead, each travel day is billed at a flat professional rate of €280 plus receipted travel expenses, agreed with you in writing beforehand.', es: 'La tarifa base incluye hasta 3 visitas en vídeo en directo guiadas por mí. Si preferís visitas presenciales, cada día de desplazamiento se factura a una tarifa profesional fija de 280 € más los gastos de viaje justificados, acordados por escrito de antemano.' }],
          [{ en: 'Final recommendation call', es: 'Llamada de recomendación final' }, { en: 'A one-hour call to decide, with a written summary of the recommended venue’s terms.', es: 'Una llamada de una hora para decidir, con un resumen escrito de las condiciones del espacio recomendado.' }],
        ],
        scope: { en: 'Up to eight venues contacted directly, with the top three walked through live on video', es: 'Hasta ocho espacios contactados directamente y los tres mejores recorridos en vídeo en directo' },
        turn: { en: '3 to 5 weeks, depending on how quickly venues respond', es: 'De 3 a 5 semanas, según lo que tarden en responder los espacios' },
        work: { en: 'Around 38 or more hours, including calls, walkthroughs and follow-up', es: 'Unas 38 horas o más, con llamadas, visitas en vídeo y seguimiento' },
        addons: [
          { id: 'inperson', type: 'qty', price: 280, max: 3, unit: { en: 'per day', es: 'por día' }, travel: true, label: { en: 'In-person inspection day', es: 'Día de visita presencial' } },
          { id: 'extra', type: 'qty', price: 120, max: 10, unit: { en: 'each', es: 'cada uno' }, label: { en: 'Extra venues contacted beyond eight', es: 'Espacios adicionales contactados a partir de ocho' } },
        ],
      },
    ],
    steps: [
      [{ en: 'Message Maryann', es: 'Escribe a Maryann' }, { en: 'Describe the wedding you want: the feel, guest numbers, season and budget.', es: 'Descríbeme la boda que queréis: el ambiente, los invitados, la temporada y el presupuesto.' }],
      [{ en: 'Choose your starting stage', es: 'Elige por dónde empezar' }, { en: 'Start with Destination Match, or go straight to Venue Shortlist if your destination is settled.', es: 'Empieza con Destination Match o pasa directamente a Venue Shortlist si ya tenéis destino.' }],
      [{ en: 'Deposit and research', es: 'Anticipo e investigación' }, { en: 'Maryann researches against your brief and flags deal-breakers early.', es: 'Maryann investiga según vuestro briefing y señala pronto lo que descarta un lugar.' }],
      [{ en: 'Report and review call', es: 'Informe y llamada de revisión' }, { en: 'You receive the written findings and we go through them together.', es: 'Recibís las conclusiones por escrito y las repasamos juntos.' }],
      [{ en: 'Move on if you want to', es: 'Seguid si queréis' }, { en: 'Each stage builds on the last. Nothing is repeated, and Destination Match fees are credited.', es: 'Cada etapa parte de la anterior. No se repite nada y el Destination Match se descuenta.' }],
    ],
    terms: [
      [{ en: 'Payment terms', es: 'Pagos' }, [
        { en: 'Destination Match: paid in full to begin.', es: 'Destination Match: pago completo para empezar.' },
        { en: 'Venue Shortlist: 50% to begin and 50% on delivery of the shortlist.', es: 'Venue Shortlist: 50 % para empezar y 50 % al entregar la selección.' },
        { en: 'Verified Sourcing: 50% to begin and 50% when the work is complete and the final recommendation is delivered.', es: 'Verified Sourcing: 50 % para empezar y 50 % cuando el trabajo esté completo y se entregue la recomendación final.' },
        { en: 'What fees cover: venue sourcing fees cover research and advice only. Venue deposits and hire fees are paid by you directly to the venue.', es: 'Qué cubren los honorarios: estos honorarios cubren solo investigación y asesoramiento. Las reservas y el alquiler los pagáis directamente al espacio.' },
        { en: 'Zero hidden commissions: no commission is taken from venues without your knowledge. If a venue offers one, Maryann will tell you.', es: 'Sin comisiones ocultas: no se aceptan comisiones de espacios sin que lo sepáis. Si un espacio ofrece una, Maryann os lo dirá.' },
        RUSH, DISCOUNT]],
      [{ en: 'Changes & cancellations', es: 'Cambios y cancelaciones' }, [
        PRE_CONSULT, CANCEL_14, AFTER_14, STATUTORY]],
      [{ en: 'Good to know', es: 'Conviene saber' }, [
        { en: 'Availability and prices are confirmed at the time of checking. Venues can change them until you sign and pay a deposit.', es: 'La disponibilidad y los precios se confirman en el momento de consultarlos. Los espacios pueden cambiarlos hasta que firméis y paguéis una reserva.' },
        { en: 'Final decisions and contracts are between you and the venue.', es: 'Las decisiones finales y los contratos son entre vosotros y el espacio.' },
        { en: 'This is venue sourcing only. Travel planning and guest travel are quoted separately.', es: 'Es solo búsqueda de espacios. La planificación de viajes y los viajes de invitados se presupuestan aparte.' }]],
    ],
  },
  {
    key: 'travel',
    tab: { en: 'Travel planning', es: 'Planificación de viajes' },
    short: { en: 'Travel planning', es: 'Viajes' },
    title: { en: 'Someone else can do the planning.', es: 'Deja que otra persona lo planifique.' },
    lead: { en: 'Travelling solo, as a couple, with family or as a group: tell Maryann your dream holiday and your budget. She comes back with real options, with costs compared, distances checked and everything considered.', es: 'Solo, en pareja, en familia o en grupo: cuenta a Maryann tu viaje soñado y tu presupuesto. Vuelve con opciones reales, costes comparados, distancias comprobadas y todo pensado.' },
    tiers: [
      {
        name: 'Itinerary Only', pick: { en: 'I want a plan, I’ll book it myself', es: 'Quiero un plan y reservo yo' }, sub: { en: 'You book it', es: 'Reservas tú' }, price: 120, plus: false,
        best: { en: 'Solo travellers, couples and families who want a researched plan and book it themselves', es: 'Viajeros solos, parejas y familias que quieren un plan bien investigado y reservar por su cuenta' },
        rows: [
          [{ en: 'Consultation call', es: 'Llamada de consulta' }, { en: 'A 30-minute call on your travel style, budget ceiling, dates and must-sees.', es: 'Una llamada de 30 minutos sobre tu forma de viajar, presupuesto máximo, fechas e imprescindibles.' }],
          [{ en: 'Options built to your budget', es: 'Opciones según tu presupuesto' }, { en: 'Two or three places to stay per base, with prices and reviews checked on more than one platform.', es: 'Dos o tres alojamientos por base, con precios y opiniones comprobados en más de una plataforma.' }],
          [{ en: 'Flight options to choose from', es: 'Opciones de vuelo para elegir' }, { en: 'Two or three flight options compared by airline, times, stops, baggage and fare range, with links so you can book the one you choose. Maryann does not book them for you.', es: 'Dos o tres opciones de vuelo comparadas por aerolínea, horarios, escalas, equipaje y tarifa, con enlaces para que reserves la que elijas. Maryann no las reserva por ti.' }],
          [{ en: 'Day-by-day itinerary', es: 'Itinerario día a día' }, { en: 'A clear PDF with daily plans, timings and map links.', es: 'Un PDF claro con planes diarios, horarios y enlaces a mapas.' }],
          [{ en: 'Distances and travel times', es: 'Distancias y tiempos de viaje' }, { en: 'Airport transfers, train and bus times, and late-arrival cut-offs checked in advance.', es: 'Traslados al aeropuerto, horarios de tren y autobús y horas límite de llegada comprobados de antemano.' }],
          [{ en: 'Visa requirement checked', es: 'Requisitos de entrada comprobados' }, { en: 'Entry requirements confirmed for your passport, with links to official sources.', es: 'Requisitos de entrada confirmados para tu pasaporte, con enlaces a fuentes oficiales.' }],
          [{ en: 'One round of changes', es: 'Una ronda de cambios' }, { en: 'Adjustments made after you review the plan.', es: 'Ajustes después de que revises el plan.' }],
        ],
        scope: { en: 'Up to 2 travellers, up to 7 days, 1 country', es: 'Hasta 2 viajeros, hasta 7 días, 1 país' },
        turn: { en: '5 working days from the consultation call', es: '5 días laborables desde la llamada de consulta' },
        work: { en: 'Around 3 hours of research, flight comparison and itinerary building', es: 'Unas 3 horas de investigación, comparación de vuelos e itinerario' },
        addons: [
          { id: 'day', type: 'qty', price: 15, max: 21, unit: { en: 'per day', es: 'por día' }, label: { en: 'Extra day', es: 'Día adicional' } },
          { id: 'trav', type: 'qty', price: 20, max: 6, unit: { en: 'each', es: 'cada uno' }, label: { en: 'Extra traveller', es: 'Viajero adicional' } },
          { id: 'country', type: 'toggle', price: 50, label: { en: 'Second country', es: 'Segundo país' } },
          { id: 'rush', type: 'pct', pct: 30, label: { en: 'Rush delivery (48 hours)', es: 'Entrega urgente (48 horas)' } },
        ],
      },
      {
        name: 'Planned & Booked', pick: { en: 'Plan it and book it for me', es: 'Planifícalo y resérvalo por mí' }, sub: { en: 'Booked for you', es: 'Reservado por Maryann' }, price: 280, plus: false,
        best: { en: 'Individuals, couples and families who want the whole trip handled', es: 'Personas, parejas y familias que quieren olvidarse de todo el viaje' },
        rows: [
          [{ en: 'Everything in Itinerary Only', es: 'Todo lo de Itinerary Only' }, { en: 'Consultation, budget-matched options, flight options, day-by-day itinerary and entry checks.', es: 'Consulta, opciones según presupuesto, opciones de vuelo, itinerario día a día y requisitos de entrada.' }],
          [{ en: 'Flights checked and fares compared', es: 'Vuelos revisados y tarifas comparadas' }, { en: 'Your flight options re-checked across airlines, routes and flexible dates right before booking, so you get the best fare available.', es: 'Tus opciones de vuelo revisadas de nuevo entre aerolíneas, rutas y fechas flexibles justo antes de reservar, para conseguir la mejor tarifa disponible.' }],
          [{ en: 'Every booking made for you', es: 'Todas las reservas hechas por ti' }, { en: 'Bookings made in your name once you approve them, with payment going straight to each supplier.', es: 'Reservas a tu nombre en cuanto las apruebas, con el pago directo a cada proveedor.' }],
          [{ en: 'Stays and activities secured', es: 'Alojamiento y actividades asegurados' }, { en: 'Accommodation, tours and tickets reserved, with free-cancellation options chosen where available.', es: 'Alojamiento, visitas y entradas reservados, eligiendo cancelación gratuita cuando existe.' }],
          [{ en: 'Confirmations sent to you', es: 'Confirmaciones para ti' }, { en: 'One organised travel pack with every confirmation, address and contact.', es: 'Un dossier de viaje ordenado con cada confirmación, dirección y contacto.' }],
          [{ en: 'Reachable during your trip', es: 'Disponible durante el viaje' }, { en: 'WhatsApp support from 8:00 to 22:00 CET, with replies within 3 hours.', es: 'Asistencia por WhatsApp de 8:00 a 22:00 CET, con respuesta en menos de 3 horas.' }],
          [{ en: 'Cancellations covered', es: 'Cancelaciones cubiertas' }, { en: 'If a flight or stay falls through during your trip, Maryann handles the rebooking as part of the package, with no extra fee for the work. Widespread disruption such as strikes is covered in the terms below.', es: 'Si un vuelo o alojamiento falla durante el viaje, Maryann se ocupa de volver a reservar como parte del paquete, sin coste adicional por el trabajo. Las incidencias masivas, como huelgas, se tratan en las condiciones.' }],
        ],
        scope: { en: 'Up to 2 travellers, up to 10 days, up to 2 countries', es: 'Hasta 2 viajeros, hasta 10 días, hasta 2 países' },
        turn: { en: '7 working days from the consultation call', es: '7 días laborables desde la llamada de consulta' },
        work: { en: 'Around 5.5 hours, plus on-trip support', es: 'Unas 5,5 horas, más la asistencia durante el viaje' },
        addons: [
          { id: 'trav', type: 'qty', price: 35, max: 6, unit: { en: 'each', es: 'cada uno' }, label: { en: 'Extra traveller', es: 'Viajero adicional' } },
          { id: 'day', type: 'qty', price: 20, max: 21, unit: { en: 'per day', es: 'por día' }, label: { en: 'Extra day beyond 10', es: 'Día adicional a partir de 10' } },
          { id: 'support', type: 'toggle', price: 60, label: { en: 'Extended on-trip support (24 hours a day)', es: 'Asistencia ampliada durante el viaje (24 horas)' } },
          { id: 'rush', type: 'pct', pct: 30, label: { en: 'Rush planning (travel within 7 days)', es: 'Planificación urgente (viaje en menos de 7 días)' } },
        ],
      },
      {
        name: 'Group & Occasion', pick: { en: 'It’s for a group or an occasion', es: 'Es para un grupo o una ocasión' }, sub: { en: 'Booked for everyone', es: 'Reservado para todos' }, price: 550, plus: true,
        best: { en: 'Birthdays, anniversaries, family and friends trips', es: 'Cumpleaños, aniversarios y viajes en familia o con amigos' },
        rows: [
          [{ en: 'Everything in Planned & Booked', es: 'Todo lo de Planned & Booked' }, { en: 'Every booking made for you, a travel pack, on-trip support and cancellation cover.', es: 'Todas las reservas hechas, dossier de viaje, asistencia durante el viaje y cancelaciones cubiertas.' }],
          [{ en: 'Multi-arrival coordination', es: 'Coordinación de llegadas' }, { en: 'Flights from different cities timed around each other, with meeting points and transfers lined up.', es: 'Vuelos desde distintas ciudades coordinados entre sí, con puntos de encuentro y traslados organizados.' }],
          [{ en: 'Budget split per traveller', es: 'Presupuesto por viajero' }, { en: 'A cost sheet for each person, so everyone sees and pays their own share.', es: 'Una hoja de costes por persona, para que cada uno vea y pague su parte.' }],
          [{ en: 'One itinerary everyone can follow', es: 'Un itinerario para todos' }, { en: 'A shared group plan with timings, meeting points and one group contact sheet.', es: 'Un plan de grupo compartido con horarios, puntos de encuentro y una hoja de contactos.' }],
          [{ en: 'One lead contact', es: 'Una persona de contacto' }, { en: 'Maryann works through one organiser, so decisions stay quick and clear.', es: 'Trabajo con una sola persona organizadora, para decidir rápido y con claridad.' }],
        ],
        scope: { en: 'Up to 8 travellers, 1 destination, up to 10 days', es: 'Hasta 8 viajeros, 1 destino, hasta 10 días' },
        turn: { en: '10 working days from the consultation call', es: '10 días laborables desde la llamada de consulta' },
        work: { en: 'Around 11 or more hours of coordination', es: 'Unas 11 horas o más de coordinación' },
        addons: [
          { id: 'trav', type: 'qty', price: 45, max: 20, unit: { en: 'each', es: 'cada uno' }, label: { en: 'Each additional traveller', es: 'Cada viajero adicional' } },
          { id: 'celeb', type: 'qty', price: 60, max: 5, unit: { en: 'each', es: 'cada uno' }, label: { en: 'Celebration touch (private dinner, cake, special experience)', es: 'Detalle de celebración (cena privada, tarta, experiencia especial)' } },
          { id: 'day', type: 'qty', price: 30, max: 21, unit: { en: 'per day', es: 'por día' }, label: { en: 'Extra day beyond 10', es: 'Día adicional a partir de 10' } },
        ],
      },
    ],
    steps: [
      [{ en: 'Message Maryann', es: 'Escribe a Maryann' }, { en: 'Share where you would like to go, your dates, how many travellers and your budget.', es: 'Cuenta a Maryann adónde quieres ir, tus fechas, cuántos viajáis y tu presupuesto.' }],
      [{ en: 'Consultation call', es: 'Llamada de consulta' }, { en: 'You agree the level of service together and Maryann confirms your fee in writing.', es: 'Acordáis el nivel de servicio y Maryann te confirma la tarifa por escrito.' }],
      [{ en: 'Payment and planning', es: 'Pago y planificación' }, { en: 'Maryann builds your options and itinerary.', es: 'Maryann prepara tus opciones y tu itinerario.' }],
      [{ en: 'Review and book', es: 'Revisar y reservar' }, { en: 'You approve the plan, then either book it yourself or Maryann books it for you.', es: 'Apruebas el plan y lo reservas tú o lo reserva Maryann.' }],
      [{ en: 'Enjoy the trip', es: 'Disfruta del viaje' }, { en: 'On Planned & Booked and Group & Occasion, Maryann stays reachable while you travel.', es: 'Con Planned & Booked y Group & Occasion sigo disponible mientras viajas.' }],
    ],
    terms: [
      [{ en: 'Payment terms', es: 'Pagos' }, [
        { en: 'Itinerary Only: paid in full upfront to start planning.', es: 'Itinerary Only: pago completo por adelantado para empezar a planificar.' },
        { en: 'Planned & Booked / Group & Occasion: 50% deposit to begin, 50% upon delivery of your complete plan.', es: 'Planned & Booked / Group & Occasion: 50 % de depósito para empezar y 50 % al entregar tu plan completo.' },
        DIRECT, PLAN_FEES, NO_COMM, RUSH, DISCOUNT]],
      [{ en: 'Changes & cancellations', es: 'Cambios y cancelaciones' }, [
        PRE_CONSULT, CANCEL_14, AFTER_14, SUPPLIER,
        { en: 'Included rebooking support: for Planned & Booked and Group & Occasion packages, Maryann handles all rebooking work for free if an individual booking falls through. The traveller covers any new ticket fares or supplier penalties.', es: 'Cambios de reserva incluidos: en Planned & Booked y Group & Occasion, Maryann se ocupa sin coste de todo el trabajo de volver a reservar si falla una reserva individual. El viajero paga las nuevas tarifas o penalizaciones del proveedor.' },
        MASS,
        { en: 'Travel insurance is strongly recommended for every trip.', es: 'Se recomienda encarecidamente contratar un seguro de viaje para cada viaje.' },
        STATUTORY]],
      [VISA.title, VISA.items],
    ],
  },
];

const PLACES = [
  { id: 'amalfi', scene: 'cliffs', name: { en: 'Amalfi Coast, Italy', es: 'Costa Amalfitana, Italia' },
    caption: { en: 'Clifftop villages like Positano and sea views. Summer heat and the long transfer from the airport are weighed up in a Destination Match.', es: 'Pueblos sobre el acantilado como Positano y vistas al mar. El calor del verano y el largo traslado desde el aeropuerto se valoran en un Destination Match.' },
    step: { en: 'Compared in Destination Match', es: 'Se compara en Destination Match' }, detail: { en: 'Season, light and guest access weighed for your dates', es: 'Temporada, luz y acceso de invitados valorados para tus fechas' }, choice: 'venue' },
  { id: 'iceland', scene: 'north', name: { en: 'South coast, Iceland', es: 'Costa sur, Islandia' },
    caption: { en: 'Black sand, basalt sea stacks and big skies. Wind risk and rain plans are checked before any venue is shortlisted.', es: 'Arena negra, farallones de basalto y cielos inmensos. El riesgo de viento y el plan para lluvia se comprueban antes de seleccionar espacios.' },
    step: { en: 'Checked in Venue Shortlist', es: 'Se comprueba en Venue Shortlist' }, detail: { en: 'Wind risk and rain plans flagged before shortlisting', es: 'Riesgo de viento y plan para lluvia señalados antes de seleccionar' }, choice: 'venue' },
  { id: 'mallorca', scene: 'finca', name: { en: 'Deià, Mallorca', es: 'Deià, Mallorca' },
    caption: { en: 'Mountain villages above the sea and short flights from many European cities. Curfews and noise limits are confirmed with each venue.', es: 'Pueblos de montaña sobre el mar y vuelos cortos desde muchas ciudades europeas. Los horarios de cierre y límites de ruido se confirman con cada espacio.' },
    step: { en: 'Confirmed in Verified Sourcing', es: 'Se confirma en Verified Sourcing' }, detail: { en: 'Curfews and noise limits confirmed on a live video walkthrough', es: 'Horarios de cierre y ruido confirmados en una visita en vídeo en directo' }, choice: 'event' },
  { id: 'lisbon', scene: 'city', name: { en: 'Lisbon, Portugal', es: 'Lisboa, Portugal' },
    caption: { en: 'Trams, riverside landmarks and late dinners. A long weekend planned day by day, with transfer times and late-arrival cut-offs checked.', es: 'Tranvías, monumentos junto al río y cenas tardías. Un fin de semana largo planificado día a día, con traslados y horas límite de llegada comprobados.' },
    step: { en: 'Planned in Itinerary Only', es: 'Se planifica en Itinerary Only' }, detail: { en: 'Transfer times and late-arrival cut-offs checked', es: 'Traslados y horas límite de llegada comprobados' }, choice: 'trip' },
];

const LEGAL = {
  legal: {
    title: { en: 'Legal notice', es: 'Aviso legal' },
    body: {
      en: '<p>This website is operated by <strong>Maryann Eniola</strong>, based in Spain. Business registration details will be added here once registration is complete.</p><dl><dt>Email</dt><dd>maisoneniola@gmail.com</dd><dt>WhatsApp</dt><dd>+34 663 412 843</dd></dl><p>The content of this website is for information. Prices and terms are confirmed in writing for each client before any work begins.</p>',
      es: '<p>Esta web pertenece a <strong>Maryann Eniola</strong>, con base en España. Los datos de registro de la actividad se añadirán aquí cuando se complete el alta.</p><dl><dt>Correo electrónico</dt><dd>maisoneniola@gmail.com</dd><dt>WhatsApp</dt><dd>+34 663 412 843</dd></dl><p>El contenido de esta web es informativo. Los precios y condiciones se confirman por escrito a cada cliente antes de empezar cualquier trabajo.</p>'
    }
  },
  privacy: {
    title: { en: 'Privacy notice', es: 'Aviso de privacidad' },
    body: {
      en: '<p><strong>Who is responsible:</strong> Maryann Eniola, maisoneniola@gmail.com.</p><p><strong>What this website collects:</strong> when you send the enquiry form, your message is emailed to Maryann and a copy is emailed to you; the site keeps only your name, email, phone if given and the subject line for up to 60 days, so it can remind her if she has not replied. If you book a consultation call, the booking (name, email, phone if given, time) is kept for 180 days. If you use the WhatsApp or email buttons instead, the message only travels through those apps. If you add an estimate to your enquiry, it is kept in your own browser only until you close the tab. The site also counts page views by page and country, with no cookie, no IP address and nothing that identifies you; browsers that send Do Not Track are not counted.</p><p><strong>Why your details are used:</strong> to reply to your enquiry and prepare a proposal, at your request before any contract (GDPR Article 6(1)(b)).</p><p><strong>Who else sees them:</strong> Cloudflare, which hosts this site and delivers the form email, and WhatsApp (Meta) or your email provider if you send that way. If you become a client, bookings share only what each supplier needs.</p><p><strong>How long they are kept:</strong> enquiry records are deleted after 60 days and bookings after 180 days; messages that don’t lead to work are deleted from Maryann’s inbox after 12 months. Client records are kept as long as tax law requires.</p><p><strong>Your rights:</strong> you can ask to see, correct, delete or restrict your data, or object to its use, by emailing Maryann. You can also complain to the Spanish data protection authority (AEPD, aepd.es).</p><h2 class="subhead" id="reviews">Reviews</h2><p>If you send a review through the form, it is stored (your name, the name you chose to be shown, your email if you gave it, and the review) until Maryann approves or declines it, for at most 90 days. Approved reviews are published on this site under the name you chose and kept until you ask for them to be removed, by emailing Maryann. Nothing else on this site is stored.</p><h2 class="subhead" id="cookies">Cookies</h2><p>This website sets no cookies and runs no analytics or tracking scripts. If you add an estimate to your enquiry, the figures are kept in your browser’s session storage only until you close the tab, and nothing reaches Maryann until you choose to send your message.</p>',
      es: '<p><strong>Responsable:</strong> Maryann Eniola, maisoneniola@gmail.com.</p><p><strong>Qué recoge esta web:</strong> al enviar el formulario, tu mensaje llega por correo a Maryann y tú recibes una copia; la web conserva solo tu nombre, correo, teléfono si lo indicas y el asunto durante un máximo de 60 días, para recordarle si no ha respondido. Si reservas una llamada de consulta, la reserva (nombre, correo, teléfono si lo indicas y hora) se conserva 180 días. Si usas los botones de WhatsApp o correo, el mensaje solo viaja por esas aplicaciones. Si añades un presupuesto a tu consulta, se guarda solo en tu navegador hasta que cierras la pestaña. La web también cuenta las visitas por página y país, sin cookies, sin dirección IP y sin nada que te identifique; los navegadores que envían “No rastrear” no se cuentan.</p><p><strong>Para qué se usan tus datos:</strong> para responder a tu consulta y preparar una propuesta, a petición tuya y antes de cualquier contrato (artículo 6.1.b del RGPD).</p><p><strong>Quién más los ve:</strong> Cloudflare, que aloja esta web y entrega el correo del formulario, y WhatsApp (Meta) o tu proveedor de correo si envías por esa vía. Si te conviertes en cliente, en las reservas solo se comparte lo que cada proveedor necesita.</p><p><strong>Cuánto tiempo se conservan:</strong> los registros de consultas se borran a los 60 días y las reservas a los 180; los mensajes que no dan lugar a un encargo se borran del correo de Maryann pasados 12 meses. Los datos de clientes se conservan el tiempo que exige la normativa fiscal.</p><p><strong>Tus derechos:</strong> puedes pedir acceso, rectificación, supresión, limitación u oponerte al uso de tus datos escribiendo a Maryann. También puedes reclamar ante la Agencia Española de Protección de Datos (AEPD, aepd.es).</p><h2 class="subhead" id="reviews">Opiniones</h2><p>Si envías una opinión con el formulario, se guarda (tu nombre, el nombre con el que quieres aparecer, tu correo si lo indicas y la opinión) hasta que la apruebo o rechazo, como máximo 90 días. Las opiniones aprobadas se publican en esta web con el nombre elegido y se conservan hasta que pidas que se retiren, escribiendo a Maryann por correo. Nada más se guarda en esta web.</p><h2 class="subhead" id="cookies">Cookies</h2><p>Esta web no instala cookies ni utiliza analítica ni scripts de seguimiento. Si añades un presupuesto a tu consulta, las cifras se guardan en el almacenamiento de sesión de tu navegador solo hasta que cierras la pestaña, y no llega nada a Maryann hasta que decides enviar tu mensaje.</p>'
    }
  }
};

/* Copy that only appears in the PDF price guides (scripts/build-pdfs.py). Keyed by service key. */
const PDF_COPY = {
  brand: 'MAISON ENIOLA',
  tagline: { en: 'Independent Sourcing & Travel Design', es: 'Búsqueda independiente y diseño de viajes' },
  breakdown: { en: 'Service & price breakdown', es: 'Servicios y precios' },
  glance: { en: 'Pricing at a glance', es: 'Precios de un vistazo' },
  cols: { tier: { en: 'Tier', es: 'Nivel' }, best: { en: 'Best for', es: 'Ideal para' }, scope: { en: 'Scope (base fee)', es: 'Alcance (tarifa base)' }, from: { en: 'From', es: 'Desde' }, fx: 'GBP · USD' },
  included: { en: 'What’s included', es: 'Qué incluye' },
  means: { en: 'What that means for you', es: 'Qué significa para ti' },
  scope: { en: 'Scope', es: 'Alcance' }, turnaround: { en: 'Turnaround', es: 'Plazo' }, work: { en: 'Work involved', es: 'Trabajo' },
  addons: { en: 'Add-ons', es: 'Extras' },
  how: { en: 'How it works', es: 'Cómo funciona' },
  langs: { en: 'English & Spanish', es: 'Inglés y español' },
  page: { en: 'Page', es: 'Página' },
  travelAtCost: { en: '+ travel at cost', es: '+ viaje a coste' },
  seeVenues: { en: 'see the Venue Sourcing breakdown', es: 'ver la guía de Búsqueda de espacios' },
  events: {
    kicker: { en: 'Weddings • Events • Proposals', es: 'Bodas • Eventos • Pedidas' },
    title: { en: ['The moment is yours.', 'The rest is handled.'], es: ['El momento es vuestro.', 'Del resto se ocupa Maryann.'] },
    intro: { en: 'Destination weddings, milestone trips and the proposal you have been imagining. Maryann handles the flights, the stays, the timing and everyone arriving where they should be. This document sets out exactly what each package includes, how far the base fee goes, and what changes the price, so you can choose with confidence.', es: 'Bodas en destino, viajes para celebrar y la pedida que llevas tiempo imaginando. Maryann se ocupa de los vuelos, el alojamiento, los horarios y de que todo el mundo llegue donde debe. Este documento explica qué incluye cada paquete, hasta dónde llega la tarifa base y qué cambia el precio, para que elijas con confianza.' },
    glanceScope: { en: ['2 travellers · 1 destination · up to 5 nights', 'Couple + up to 20 guests (10 households)', 'Couple + up to 40 guests · up to 4 event days'], es: ['2 viajeros · 1 destino · hasta 5 noches', 'Pareja + hasta 20 invitados (10 hogares)', 'Pareja + hasta 40 invitados · hasta 4 días'] },
    glanceNote: { en: 'Each fee reflects the real hours behind it: research, supplier contact, cross-checking reviews and prices, building documents and staying reachable. Every package starts with a consultation call, and the base fee covers the scope shown. Larger groups or longer trips are quoted using the add-on rates below.', es: 'Cada tarifa refleja las horas reales que hay detrás: investigación, contacto con proveedores, comprobación de opiniones y precios, preparación de documentos y disponibilidad. Todos los paquetes empiezan con una llamada de consulta y la tarifa base cubre el alcance indicado. Grupos más grandes o viajes más largos se presupuestan con los extras.' },
  },
  venues: {
    kicker: { en: 'Venue Sourcing • Weddings & Events', es: 'Búsqueda de espacios • Bodas y eventos' },
    title: { en: ['You know the wedding you want.', 'Maryann knows where.'], es: ['Sabes la boda que quieres.', 'Maryann sabe dónde.'] },
    intro: { en: 'Say fairytale and most people say Spain. Maryann might say Iceland, and show you why. She researches destinations and venues against the wedding you described, then tells you the truth about each one. This breakdown sets out what each stage delivers, what it costs and how the stages build on one another.', es: 'Dices boda de cuento y casi todos piensan en España. Maryann quizá diga Islandia, y te explique por qué. Investiga destinos y espacios según la boda que le describes y te cuenta la verdad de cada uno. Esta guía explica qué aporta cada etapa, cuánto cuesta y cómo se apoyan unas en otras.' },
    glanceScope: { en: ['1 wedding brief · 3 destinations ranked', '1 destination · 6 to 8 venues', 'Up to 8 venues contacted · top 3 walked through live'], es: ['1 briefing · 3 destinos clasificados', '1 destino · de 6 a 8 espacios', 'Hasta 8 espacios contactados · los 3 mejores en vídeo'] },
    glanceNote: { en: 'Fees reflect the research hours involved: season and access data, venue terms, availability checks and, at the Verified stage, direct conversations with venues. The Destination Match fee is credited in full against a Venue Shortlist booked within 30 days.', es: 'Las tarifas reflejan las horas de investigación: datos de temporada y acceso, condiciones de los espacios, disponibilidad y, en la etapa Verified, conversaciones directas con los espacios. El Destination Match se descuenta íntegro de un Venue Shortlist contratado en 30 días.' },
  },
  travel: {
    kicker: { en: 'Independent Travel Planning', es: 'Planificación de viajes' },
    title: { en: ['Someone else can do the planning.', 'Better plans. Bigger adventures.'], es: ['Deja que otra persona lo planifique.', 'Mejores planes. Más aventura.'] },
    intro: { en: 'Travelling solo, as a couple, with family or as a group: tell Maryann your dream holiday and your budget. She comes back with real options, with costs compared, distances checked and everything considered. Here is exactly what each level includes, how far the base fee goes and what changes the price.', es: 'Solo, en pareja, en familia o en grupo: cuenta a Maryann tu viaje soñado y tu presupuesto. Vuelve con opciones reales, costes comparados, distancias comprobadas y todo pensado. Aquí tienes qué incluye cada nivel, hasta dónde llega la tarifa base y qué cambia el precio.' },
    glanceScope: { en: ['Up to 2 travellers · up to 7 days', 'Up to 2 travellers · up to 10 days', 'Up to 8 travellers · up to 10 days'], es: ['Hasta 2 viajeros · hasta 7 días', 'Hasta 2 viajeros · hasta 10 días', 'Hasta 8 viajeros · hasta 10 días'] },
    glanceNote: { en: 'Fees are set by the hours of real work involved: comparing options, cross-checking reviews across platforms, checking transfer times and late-arrival cut-offs, and building a plan you can follow. Longer trips and larger groups use the add-on rates shown.', es: 'Las tarifas se basan en las horas de trabajo real: comparar opciones, contrastar opiniones en varias plataformas, comprobar traslados y horas límite de llegada, y preparar un plan fácil de seguir. Viajes más largos y grupos más grandes usan los extras indicados.' },
  },
};

export { CONTACT, TIER_COLORS, UI, PLAN_CHOICES, QUESTIONS, VISA, MASS, PLAN_FEES, NO_COMM, SUPPLIER, SERVICES, PLACES, LEGAL, CANCEL_14, STATUTORY, PDF_COPY };
