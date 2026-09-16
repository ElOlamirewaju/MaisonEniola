/* Client reviews shown on /reviews and the home page.
   Only add reviews from real clients, with their written permission (a WhatsApp message or email is enough; keep it).
   Don't rewrite what they say beyond fixing typing errors, and don't offer anything in return for a review.

   Each review:
   {
     name: 'Amara O.',                         // how the client asked to be named
     trip: { en: 'Proposal in Positano', es: 'Pedida en Positano' },
     service: 'weddings',                      // weddings | venues | travel
     date: '2027-05',                          // year and month of the trip or event
     place: 'amalfi',                          // optional: amalfi | iceland | mallorca | lisbon, for the background photo
     lang: 'en',                               // language the review was written in
     text: 'What the client wrote.',
     translation: { es: 'Optional translation, shown on the Spanish pages.' },
     source: 'Google',                         // optional: where it was first posted
     sourceUrl: '',                            // optional: link to the original review
   }
*/
export const REVIEWS = [];
