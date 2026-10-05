/* Page structure and copy for the multi-page site (English and Spanish).
   Prices, services, terms and form questions live in content.js; this file holds navigation,
   page-level copy and destination details (coordinates, local time zone, photo descriptions). */

export const LANGS = ['en', 'es'];

/* Where each service lives. `index` matches SERVICES in content.js. */
export const SERVICE_PAGES = [
  { index: 0, slug: 'weddings', place: 'amalfi' },
  { index: 1, slug: 'venues', place: 'mallorca' },
  { index: 2, slug: 'travel', place: 'lisbon' },
];

/* The two explorer links in the floating navigation island. */
export const NAV = [
  { slug: 'venues', label: { en: 'The Sourcing Matrix', es: 'La Matriz de Espacios' }, hint: { en: 'Venue sourcing', es: 'Búsqueda de espacios' } },
  { slug: 'travel', label: { en: 'The Chronicles', es: 'Las Crónicas' }, hint: { en: 'Travel & journeys', es: 'Viajes' } },
];

/* Every page, for the full-screen menu and the footer. */
export const MENU = [
  { slug: 'weddings', label: { en: 'Weddings & proposals', es: 'Bodas y pedidas' } },
  { slug: 'venues', label: { en: 'Venues', es: 'Espacios' } },
  { slug: 'travel', label: { en: 'Travel', es: 'Viajes' } },
  { slug: 'destinations', label: { en: 'Destinations', es: 'Destinos' } },
  { slug: 'reviews', label: { en: 'Reviews', es: 'Opiniones' } },
  { slug: 'about', label: { en: 'About', es: 'Sobre mí' } },
];

/* Links to review and social profiles. Leave a value empty and its button is hidden.
   googleReview: the "Ask for reviews" link from Google Business Profile (https://g.page/r/.../review). */
export const PROFILES = {
  googleReview: '',
  google: '',
  bodas: '',
  hitched: '',
  instagram: '',
  pinterest: '',
};

export const PLACE_META = {
  amalfi: {
    coords: '40.6281° N, 14.4850° E', tz: 'Europe/Rome', town: { en: 'Positano', es: 'Positano' },
    alt: { en: 'The houses of Positano lit up after sunset on the Amalfi Coast', es: 'Las casas de Positano iluminadas tras la puesta de sol en la Costa Amalfitana' },
    service: 'venues',
  },
  iceland: {
    coords: '63.4044° N, 19.0445° W', tz: 'Atlantic/Reykjavik', town: { en: 'Vík', es: 'Vík' },
    alt: { en: 'Basalt rocks and sea stacks on a black sand beach near Vík, Iceland', es: 'Rocas de basalto y farallones en una playa de arena negra cerca de Vík, Islandia' },
    service: 'venues',
  },
  mallorca: {
    coords: '39.7481° N, 2.6484° E', tz: 'Europe/Madrid', town: { en: 'Deià', es: 'Deià' },
    alt: { en: 'The village of Deià below the Tramuntana mountains, with bougainvillea in the foreground', es: 'El pueblo de Deià bajo la sierra de Tramuntana, con buganvillas en primer plano' },
    service: 'venues',
  },
  lisbon: {
    coords: '38.7139° N, 9.1335° W', tz: 'Europe/Lisbon', town: { en: 'Lisbon', es: 'Lisboa' },
    alt: { en: 'A yellow tram on a cobbled street in Lisbon', es: 'Un tranvía amarillo en una calle empedrada de Lisboa' },
    service: 'travel',
  },
};

export const COPY = {
  meta: {
    siteName: 'Maison Eniola',
    brand: 'Maison Eniola',
    tagline: 'Independent Sourcing & Travel Design',
    titleSuffix: 'Maison Eniola',
    description: { en: 'Travel planning for individuals, couples, families and groups, wedding venue sourcing, and guest travel for proposals, weddings and events, in English and Spanish.', es: 'Planificación de viajes, búsqueda de espacios para bodas y viajes de invitados para pedidas, bodas y eventos, en inglés y español.' },
  },
  common: {
    enquire: { en: 'Enquire', es: 'Consultar' },
    consult: { en: 'Request consultation', es: 'Solicitar consulta' },
    startEnquiry: { en: 'Start an enquiry', es: 'Empezar una consulta' },
    skip: { en: 'Skip to content', es: 'Saltar al contenido' },
    home: { en: 'Home', es: 'Inicio' },
    close: { en: 'Close menu', es: 'Cerrar menú' },
    open: { en: 'Open menu', es: 'Abrir menú' },
    localTime: { en: 'Local time', es: 'Hora local' },
    scroll: { en: 'Scroll to begin', es: 'Desliza para empezar' },
    from: { en: 'From', es: 'Desde' },
    explore: { en: 'Explore', es: 'Explorar' },
    enter: { en: 'Step inside', es: 'Entrar' },
    seePrices: { en: 'See levels and prices', es: 'Ver niveles y precios' },
    estimate: { en: 'Work out an estimate', es: 'Calcular un presupuesto' },
    next: { en: 'Next destination', es: 'Siguiente destino' },
    footerTag: { en: 'Where to go, where to say yes, and how everyone gets there.', es: 'Adónde ir, dónde dar el sí y cómo llega todo el mundo.' },
    pages: { en: 'Pages', es: 'Páginas' },
    contact: { en: 'Contact', es: 'Contacto' },
    legal: { en: 'Legal', es: 'Legal' },
    cookies: { en: 'Cookies', es: 'Cookies' },
    noCookies: { en: 'No cookies, no trackers. Nothing you type is stored on this site.', es: 'Sin cookies ni rastreadores. Nada de lo que escribes se guarda en esta web.' },
    copyright: { en: '© {year} Maison Eniola. All rights reserved.', es: '© {year} Maison Eniola. Todos los derechos reservados.' },
    operator: { en: 'Operated by Maryann Eniola, Spain.', es: 'Gestionada por Maryann Eniola, España.' },
    switchLang: { en: 'Language', es: 'Idioma' },
  },
  home: {
    title: { en: 'Maison Eniola | Independent Sourcing & Travel Design', es: 'Maison Eniola | Búsqueda independiente y diseño de viajes' },
    eyebrow: { en: 'Travel · Weddings · Venues', es: 'Viajes · Bodas · Espacios' },
    heroLines: {
      en: ['Where to go,', 'where to say yes,', 'and how everyone', 'gets there.'],
      es: ['Adónde ir,', 'dónde dar el sí', 'y cómo llega', 'todo el mundo.'],
    },
    heroPrimary: { en: 'Tell Maryann what you need', es: 'Cuenta a Maryann qué necesitas' },
    heroSecondary: { en: 'How it works', es: 'Cómo funciona' },
    // The journey right under the hero: idea → tell → right service → start.
    startKicker: { en: 'How it works', es: 'Cómo funciona' },
    startTitle: { en: 'From a trip in mind to a plan in hand.', es: 'De una idea de viaje a un plan en la mano.' },
    steps: [
      { title: { en: 'You have a trip in mind', es: 'Tienes un viaje en mente' }, text: { en: 'A proposal, a wedding abroad, a family holiday or a trip on your own. A rough idea is enough.', es: 'Una pedida, una boda en el extranjero, unas vacaciones en familia o un viaje en solitario. Basta con una idea aproximada.' } },
      { title: { en: 'Tell Maison Eniola what you need', es: 'Cuenta a Maison Eniola qué necesitas' }, text: { en: 'Three short steps: what you’re planning, roughly when, and a budget range. In English or Spanish.', es: 'Tres pasos cortos: qué planeas, más o menos cuándo y un rango de presupuesto. En inglés o en español.' } },
      { title: { en: 'Get the right service', es: 'Recibe el servicio adecuado' }, text: { en: 'Maryann recommends the level that fits you and confirms the fee in writing before anything starts.', es: 'Maryann te recomienda el nivel que encaja contigo y confirma la tarifa por escrito antes de empezar.' } },
      { title: { en: 'Start planning', es: 'Empieza a planificar' }, text: { en: 'Book a call, approve the plan, then travel with every detail checked.', es: 'Reserva una llamada, aprueba el plan y viaja con cada detalle comprobado.' } },
    ],
    portalKicker: { en: 'Every journey begins with a where', es: 'Todo viaje empieza por un dónde' },
    portalTitle: { en: 'Real places, checked before you fall for them.', es: 'Lugares reales, comprobados antes de que te enamores de ellos.' },
    portalText: { en: 'Wind on a black sand beach. The last bus up a mountain road. Whether the band has to stop at midnight. Maryann looks into what the brochures leave out, so the place you choose is as good in person as it is on screen.', es: 'El viento en una playa de arena negra. El último autobús por una carretera de montaña. Si la música tiene que parar a medianoche. Maryann investiga lo que los folletos no cuentan, para que el lugar que elijas sea tan bueno en persona como en la pantalla.' },
    doorsKicker: { en: 'Or choose a service', es: 'O elige un servicio' },
    doorsTitle: { en: 'What are you planning?', es: '¿Qué estás planeando?' },
    doorsHelp: { en: 'Not sure which? Tell Maryann what you need', es: '¿No sabes cuál? Cuenta a Maryann qué necesitas' },
    doors: [
      { slug: 'weddings', place: 'amalfi', lead: { en: 'Proposals, destination weddings and every guest arriving where they should be.', es: 'Pedidas, bodas en destino y cada invitado llegando donde debe.' } },
      { slug: 'venues', place: 'mallorca', lead: { en: 'The right country, then the right venue, with the truth about each one.', es: 'El país adecuado y luego el espacio adecuado, con la verdad de cada uno.' } },
      { slug: 'travel', place: 'lisbon', lead: { en: 'Trips for one, two or twenty, planned around your budget, then booked by you or by Maryann.', es: 'Viajes para una, dos o veinte personas, planificados según tu presupuesto, que reservas tú o reserva Maryann.' } },
    ],
    atlasKicker: { en: 'The atlas', es: 'El atlas' },
    atlasTitle: { en: 'Places Maryann might suggest', es: 'Lugares que Maryann podría proponerte' },
    atlasLead: { en: 'Examples of the kind of places Maryann researches. Each suggestion is checked against your brief, your dates and where your guests are travelling from.', es: 'Ejemplos del tipo de lugares que investiga Maryann. Cada propuesta se comprueba según tu idea, tus fechas y desde dónde viajan tus invitados.' },
    promisesKicker: { en: 'How Maryann works', es: 'Cómo trabaja Maryann' },
    promises: [
      { title: { en: 'Bookings in your name', es: 'Reservas a tu nombre' }, text: { en: 'When Maryann books for you, you pay each supplier directly, so flights, stays and venues never pass through her.', es: 'Cuando Maryann reserva por ti, pagas directamente a cada proveedor, así que vuelos, alojamientos y espacios nunca pasan por ella.' } },
      { title: { en: 'No hidden commission', es: 'Sin comisiones ocultas' }, text: { en: 'If a supplier offers Maryann a commission, she tells you.', es: 'Si un proveedor ofrece una comisión a Maryann, te lo dice.' } },
      { title: { en: 'English and Spanish', es: 'Inglés y español' }, text: { en: 'Plans, calls and supplier conversations in either language.', es: 'Planes, llamadas y conversaciones con proveedores en cualquiera de los dos idiomas.' } },
    ],
    voicesKicker: { en: 'Voices', es: 'Voces' },
    voicesTitle: { en: 'Stories from people who travelled', es: 'Historias de quienes viajaron' },
    finalTitle: { en: 'Where to next?', es: '¿Adónde vamos?' },
    finalText: { en: 'Tell Maryann the occasion, rough dates and a budget range. She replies in English or Spanish.', es: 'Cuenta a Maryann la ocasión, las fechas aproximadas y un rango de presupuesto. Responde en inglés o en español.' },
  },
  destinations: {
    title: { en: 'Destinations', es: 'Destinos' },
    kicker: { en: 'The atlas', es: 'El atlas' },
    lead: { en: 'Four places, and how each one gets checked before it reaches your shortlist. Every suggestion is researched against your brief, your dates and where your guests are travelling from.', es: 'Cuatro lugares y cómo se comprueba cada uno antes de llegar a tu selección. Cada propuesta se investiga según tu idea, tus fechas y desde dónde viajan tus invitados.' },
    checked: { en: 'How it gets checked', es: 'Cómo se comprueba' },
    service: { en: 'The service behind it', es: 'El servicio detrás' },
    example: { en: 'An example, not a package. Your suggestions depend on your brief.', es: 'Un ejemplo, no un paquete. Tus propuestas dependen de lo que busques.' },
  },
  services: {
    kicker: { en: 'Service', es: 'Servicio' },
    levels: { en: 'Three levels', es: 'Tres niveles' },
    journeysKicker: { en: 'Journeys', es: 'Viajes' },
    journeysTitle: { en: 'Where the chronicles are written', es: 'Donde se escriben las crónicas' },
    journeysLead: { en: 'Four places, and what gets checked before each one reaches your plan: transfer times, late-arrival cut-offs, curfews, weather windows.', es: 'Cuatro lugares y lo que se comprueba antes de que cada uno llegue a tu plan: traslados, horas límite de llegada, horarios de cierre, ventanas de buen tiempo.' },
    storiesKicker: { en: 'Chronicles', es: 'Crónicas' },
    storiesTitle: { en: 'Stories from people who travelled', es: 'Historias de quienes viajaron' },
    pickLabel: { en: 'Which fits you?', es: '¿Cuál encaja contigo?' },
    pickHelp: { en: 'Not sure? Tell Maryann what you need and she’ll recommend the right level', es: '¿No lo tienes claro? Cuenta a Maryann qué necesitas y te recomendará el nivel adecuado' },
  },
  estimate: {
    title: { en: 'Estimate', es: 'Presupuesto' },
    sent: { en: 'Estimate added. Taking you to the enquiry form…', es: 'Presupuesto añadido. Te llevamos al formulario…' },
  },
  enquire: {
    title: { en: 'Enquire', es: 'Consulta' },
    kicker: { en: 'Begin', es: 'Empezar' },
    elsewhere: { en: 'Prefer to talk first?', es: '¿Prefieres hablar primero?' },
  },
  reviews: {
    title: { en: 'Reviews', es: 'Opiniones' },
    kicker: { en: 'Voices', es: 'Voces' },
    heading: { en: 'Stories from people who travelled', es: 'Historias de quienes viajaron' },
    lead: { en: 'Proposals, weddings and trips, in the words of the people who were there.', es: 'Pedidas, bodas y viajes, contados por quienes estuvieron allí.' },
    emptyTitle: { en: 'The first stories are on their way.', es: 'Las primeras historias están en camino.' },
    emptyText: { en: 'This page only shows reviews from real clients, shared with their permission. As trips and weddings come home, their stories will appear here.', es: 'Esta página solo muestra opiniones de clientes reales, compartidas con su permiso. Según vuelvan los viajes y las bodas, sus historias aparecerán aquí.' },
    verify: { en: 'How reviews are checked: every review on this page comes from a client Maryann has worked with. It is published only with their permission, and nothing they say is edited beyond fixing typing errors. Nothing is offered in return for a review.', es: 'Cómo se comprueban las opiniones: cada opinión de esta página viene de un cliente con quien Maryann ha trabajado. Solo se publica con su permiso y no se cambia lo que dice, salvo erratas. No se ofrece nada a cambio de una opinión.' },
    shareKicker: { en: 'Travelled with Maryann?', es: '¿Has viajado con Maryann?' },
    shareTitle: { en: 'Share your experience', es: 'Comparte tu experiencia' },
    shareText: { en: 'A few lines about what the planning was like and how the day or the trip went mean a lot, and help the next couple or traveller decide.', es: 'Unas líneas sobre cómo fue la planificación y cómo salió el día o el viaje significan mucho, y ayudan a la siguiente pareja o viajero a decidir.' },
    shareWa: { en: 'Send it on WhatsApp', es: 'Enviarla por WhatsApp' },
    shareEmail: { en: 'Send it by email', es: 'Enviarla por correo' },
    shareGoogle: { en: 'Leave a Google review', es: 'Dejar una opinión en Google' },
    shareConsent: { en: 'When you send a review, say how you’d like to be named (for example, first name and initial) and Maryann will check with you before anything is published.', es: 'Cuando envíes tu opinión, indica cómo quieres aparecer (por ejemplo, nombre e inicial) y Maryann lo confirmará contigo antes de publicar nada.' },
    shareMessage: { en: 'Hi Maryann, I’d like to share a review of my experience.\n\nWhat we planned:\nWhen:\nMy review:\n\nHow I’d like to be named:', es: 'Hola Maryann, me gustaría compartir mi opinión sobre la experiencia.\n\nQué planeamos:\nCuándo:\nMi opinión:\n\nCómo quiero aparecer:' },
    elsewhere: { en: 'Also find Maryann on', es: 'Encuentra también a Maryann en' },
    // On-site review form and carousel (worker/index.js stores submissions; Maryann approves by email).
    formTitle: { en: 'Write your review here', es: 'Escribe aquí tu opinión' },
    formIntro: { en: 'It goes to Maryann first. She checks that it is from a client she has worked with, then it appears on this page.', es: 'Llega primero a Maryann. Comprueba que sea de un cliente con quien ha trabajado y después aparece en esta página.' },
    fName: { en: 'Your name', es: 'Tu nombre' },
    fEmail: { en: 'Email', es: 'Correo electrónico' },
    fEmailHint: { en: 'not published; so Maryann can check with you', es: 'no se publica; para que Maryann pueda confirmar contigo' },
    fDisplay: { en: 'How should you be named?', es: '¿Cómo quieres aparecer?' },
    displayOpts: { first: { en: 'First name and initial (Amara O.)', es: 'Nombre e inicial (Amara O.)' }, full: { en: 'Full name', es: 'Nombre completo' }, anon: { en: 'Anonymous', es: 'Anónimo' } },
    fService: { en: 'What did we plan?', es: '¿Qué planificamos?' },
    serviceOpts: { weddings: { en: 'A wedding, event or proposal', es: 'Una boda, un evento o una pedida' }, venues: { en: 'Venue sourcing', es: 'Búsqueda de espacio' }, travel: { en: 'A trip', es: 'Un viaje' } },
    fTrip: { en: 'In a few words', es: 'En pocas palabras' },
    fTripPh: { en: 'Proposal in Positano, May 2027', es: 'Pedida en Positano, mayo de 2027' },
    fRating: { en: 'Your rating', es: 'Tu valoración' },
    fText: { en: 'Your review', es: 'Tu opinión' },
    fConsent: { en: 'I am a client of Maison Eniola and I agree to this review being published on this site under the name chosen above. I can ask for it to be removed at any time.', es: 'Soy cliente de Maison Eniola y acepto que esta opinión se publique en esta web con el nombre elegido arriba. Puedo pedir que se retire en cualquier momento.' },
    fSend: { en: 'Send review', es: 'Enviar opinión' },
    fSentTitle: { en: 'Thank you.', es: 'Gracias.' },
    fSentBody: { en: 'Your review has reached Maryann. Once she has checked it, it will appear here.', es: 'Tu opinión ha llegado a Maryann. Cuando la haya comprobado, aparecerá aquí.' },
    fFail: { en: 'That didn’t send. You can send it on WhatsApp or by email instead.', es: 'No se ha podido enviar. Puedes enviarla por WhatsApp o por correo.' },
    fTooShort: { en: 'Please write at least a couple of sentences.', es: 'Escribe al menos un par de frases.' },
    fRequired: { en: 'Please fill this in.', es: 'Rellena este campo.' },
    fOr: { en: 'Or send it another way', es: 'O envíala de otra forma' },
    prev: { en: 'Previous review', es: 'Opinión anterior' },
    next: { en: 'Next review', es: 'Siguiente opinión' },
    goTo: { en: 'Review {n}', es: 'Opinión {n}' },
    ratingLabel: { en: '{n} out of 5', es: '{n} de 5' },
    anon: { en: 'A client', es: 'Cliente' },
    read: { en: 'Read more reviews', es: 'Leer más opiniones' },
  },
  about: {
    title: { en: 'About', es: 'Sobre mí' },
    kicker: { en: 'About', es: 'Sobre mí' },
    heading: { en: 'Planning that tells you the truth about a place.', es: 'Una planificación que te cuenta la verdad de cada lugar.' },
    lead: { en: 'Maryann Eniola plans trips, finds wedding venues and organises travel for proposals, weddings and the guests who come to them, in English and Spanish. For one traveller or a hundred.', es: 'Maryann Eniola planifica viajes, busca espacios para bodas y organiza los desplazamientos de pedidas, bodas e invitados, en inglés y en español. Para una persona o para cien.' },
    // Maryann's story. Leave both empty and the block is not rendered. Paragraphs are separated by a blank line.
    story: { en: '', es: '' },
    portraitAlt: { en: 'Maryann Eniola seated on a leather bench in a navy suit, looking at the camera', es: 'Maryann Eniola sentada en un banco de cuero con traje azul marino, mirando a la cámara' },
    principlesTitle: { en: 'What you can count on', es: 'Con lo que puedes contar' },
  },
  notFound: {
    title: { en: 'This path isn’t on the map.', es: 'Este camino no está en el mapa.' },
    text: { en: 'The page may have moved. Start again from home, or tell Maryann what you were looking for.', es: 'Puede que la página se haya movido. Vuelve al inicio o cuenta a Maryann qué buscabas.' },
  },
};
