// Single source of truth for the agency's real-world coordinates. Every
// contact block, the footer, the legal notice and the LocalBusiness schema
// read from here so a change to the phone number happens in one place.
export const business = {
  name: 'Akoubri Architecture & Design',
  legalName: 'Architecte Marrakech — Akoubri Architecture & Design',
  email: 'contact@akoubri.com',

  // Displayed with the spacing Moroccans read; the tel: href stays E.164.
  phone: '06 63 51 57 23',
  phoneIntl: '+212 663 51 57 23',
  phoneHref: 'tel:+212663515723',

  address: {
    line1: '2ème étage, bureau N8',
    line2: "Centre d'Affaires Rayane",
    street: 'Rue Abdelkader Mesfioui',
    city: 'Marrakech',
    postalCode: '40000',
    country: 'Maroc',
    countryCode: 'MA',
  },

  // Written out for the info cards and the footer.
  addressLines: [
    '2ème étage, bureau N8',
    "Centre d'Affaires Rayane",
    'Rue Abdelkader Mesfioui',
    'Marrakech 40000, Maroc',
  ],
  addressOneLine:
    "2ème étage, bureau N8, Centre d'Affaires Rayane, Rue Abdelkader Mesfioui, Marrakech 40000, Maroc",

  hours: 'Lun — Ven, 9h — 17h',
  // Schema.org openingHours, kept parallel to the human-readable line above.
  openingHours: [{ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }],

  geo: { lat: 31.659884, lng: -7.991755 },

  maps: {
    link: 'https://maps.app.goo.gl/zznNQgCBrdfZ5Qu99',
    embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.048812494164!2d-7.991754524382874!3d31.659884274150407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafed8734e1eff7%3A0xd38782d4f94c7f60!2sArchitecte%20Marrakech-%20Akoubri%20Architecture%20%26%20Design!5e0!3m2!1sfr!2sma',
  },

  rating: { value: 5.0, count: 56 },
};

export default business;
