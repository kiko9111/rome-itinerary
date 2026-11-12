// All trip content lives here. Edit freely: add stops, change durations, fix hours.
// Opening hours are the usual November (winter) schedule. They change often,
// so always check the official site linked on each place before you go.

export const HOTEL = {
  name: 'Villa Marogni',
  address: 'Via Po 2, 00198 Roma',
  lat: 41.911333,
  lng: 12.4939171,
  mapsUrl: 'https://maps.app.goo.gl/kUGeJuLo9QgUppSV6',
}

export const TRIP_START = '2026-11-12'
export const TRIP_DAYS = 19

// Hours helper. Day index: 0 = Sunday ... 6 = Saturday.
// h('09:00', '18:30', '19:00', { closed: [1] }) -> open 9:00, last entry 18:30, closes 19:00, closed Mondays.
// `special` overrides individual days: { 0: ['13:00', '16:00', '16:30'] }
function h(open, last, close, { closed = [], special = {} } = {}) {
  const week = []
  for (let d = 0; d < 7; d++) {
    if (special[d]) week.push(special[d])
    else if (closed.includes(d)) week.push(null)
    else week.push([open, last, close])
  }
  return week
}
const ALWAYS = 'always'

export const PLACES = {
  // ---- Around the hotel / north centre
  viaVeneto: { name: 'Via Veneto', lat: 41.9075, lng: 12.4895, hours: ALWAYS, kind: 'walk',
    info: 'The "Dolce Vita" street, a 10-minute walk from the hotel.' },
  coppede: { name: 'Quartiere Coppedè', lat: 41.9178, lng: 12.5003, hours: ALWAYS, kind: 'walk',
    info: 'Fairy-tale Art Nouveau quarter. Start at the arch on Via Dora, see the Fountain of the Frogs in Piazza Mincio.' },
  capuchin: { name: 'Capuchin Crypt', lat: 41.9045, lng: 12.4887, hours: h('10:00', '18:30', '19:00'), kind: 'museum',
    ticket: '~€11', url: 'https://www.museoecriptacappuccini.it/' },
  barberini: { name: 'Palazzo Barberini (National Gallery of Ancient Art)', lat: 41.9034, lng: 12.4900,
    hours: h('10:00', '18:00', '19:00', { closed: [1] }), kind: 'museum',
    ticket: '~€15', info: "Raphael's La Fornarina, Caravaggio's Judith, Pietro da Cortona ceiling.", url: 'https://www.barberinicorsini.org/' },
  borghese: { name: 'Borghese Gallery', lat: 41.9142, lng: 12.4922, hours: h('09:00', '17:00', '19:00', { closed: [1] }),
    kind: 'museum', ticket: '~€15 + booking', booking: true,
    info: 'Bernini and Caravaggio. Timed 2-hour slots, booking is mandatory and sells out: book now. 10 minutes on foot from the hotel.',
    url: 'https://www.galleriaborghese.beniculturali.it/' },
  villaBorghese: { name: 'Villa Borghese park & Giardino del Lago', lat: 41.9135, lng: 12.4830, hours: ALWAYS, kind: 'park',
    info: 'Rent a rowboat at the lake or a bike/golf cart near the Pincio.' },
  pincio: { name: 'Pincio Terrace', lat: 41.9113, lng: 12.4797, hours: ALWAYS, kind: 'view',
    info: 'Classic panorama over Piazza del Popolo to St Peter\'s dome.' },
  popolo: { name: 'Piazza del Popolo & Santa Maria del Popolo', lat: 41.9107, lng: 12.4763, hours: ALWAYS, kind: 'walk',
    info: 'Two Caravaggios in the Cerasi Chapel of the church (church usually open until ~19:00, limited during Mass).' },
  margutta: { name: 'Via Margutta', lat: 41.9081, lng: 12.4796, hours: ALWAYS, kind: 'walk',
    info: 'Artists\' street from Roman Holiday.' },
  spanishSteps: { name: 'Spanish Steps & Trinità dei Monti', lat: 41.9060, lng: 12.4828, hours: ALWAYS, kind: 'walk',
    info: 'No sitting on the steps (fines). Go up to Trinità dei Monti for the view.' },
  condotti: { name: 'Via Condotti & Via del Corso', lat: 41.9050, lng: 12.4805, hours: ALWAYS, kind: 'walk',
    info: 'Shopping streets; shops typically open until 19:30–20:00.' },
  quirinale: { name: 'Piazza del Quirinale terrace', lat: 41.8996, lng: 12.4870, hours: ALWAYS, kind: 'view',
    info: 'Quiet terrace in front of the President\'s palace with a view across the rooftops to St Peter\'s.' },
  trevi: { name: 'Trevi Fountain', lat: 41.9009, lng: 12.4833, hours: ALWAYS, kind: 'walk',
    info: 'Small access fee (~€2) may apply during the day; evenings are calmer and beautifully lit.' },
  araPacis: { name: 'Ara Pacis Museum', lat: 41.9063, lng: 12.4754, hours: h('09:30', '18:30', '19:30'), kind: 'museum',
    ticket: '~€13', url: 'https://www.arapacis.it/' },
  augustus: { name: 'Mausoleum of Augustus (outside) & Piazza Augusto Imperatore', lat: 41.9060, lng: 12.4764, hours: ALWAYS, kind: 'walk' },

  // ---- Centro storico
  pantheon: { name: 'Pantheon', lat: 41.8986, lng: 12.4769, hours: h('09:00', '18:30', '19:00'), kind: 'museum',
    ticket: '€5', info: 'Masses can limit access on Sunday mornings.', url: 'https://www.pantheonroma.com/' },
  navona: { name: 'Piazza Navona', lat: 41.8992, lng: 12.4731, hours: ALWAYS, kind: 'walk',
    info: "Bernini's Fountain of the Four Rivers." },
  campo: { name: "Campo de' Fiori", lat: 41.8956, lng: 12.4722, hours: ALWAYS, kind: 'food',
    info: 'Aperitivo and dinner square; morning market Mon–Sat.' },
  doria: { name: 'Galleria Doria Pamphilj', lat: 41.8977, lng: 12.4815, hours: h('09:00', '18:00', '19:00', { special: { 5: ['10:00', '19:00', '20:00'], 6: ['10:00', '19:00', '20:00'], 0: ['10:00', '19:00', '20:00'] } }),
    kind: 'museum', ticket: '~€16', info: "Velázquez's Innocent X. Hours vary, check before going.", url: 'https://www.doriapamphilj.it/' },
  argentina: { name: 'Largo di Torre Argentina', lat: 41.8955, lng: 12.4767, hours: ALWAYS, kind: 'walk',
    info: 'Where Caesar was killed, now also a cat sanctuary. Visible from the street at any time.' },
  turtle: { name: 'Turtle Fountain (Piazza Mattei)', lat: 41.8939, lng: 12.4776, hours: ALWAYS, kind: 'walk' },
  ghetto: { name: "Jewish Ghetto & Portico d'Ottavia", lat: 41.8925, lng: 12.4778, hours: ALWAYS, kind: 'food',
    info: 'Try carciofi alla giudia. Kosher places close Friday evening to Saturday night.' },
  tiberina: { name: 'Tiber Island', lat: 41.8906, lng: 12.4778, hours: ALWAYS, kind: 'walk' },

  // ---- Ancient Rome
  colosseum: { name: 'Colosseum', lat: 41.8902, lng: 12.4922, hours: h('08:30', '15:30', '16:30'), kind: 'museum',
    ticket: '~€18 (Colosseum + Forum + Palatine)', booking: true,
    info: 'Winter hours: closes 16:30, so weekday evenings are exterior-only. Book a timed slot on the official site.',
    url: 'https://colosseo.it/en/' },
  colosseumNight: { name: 'Colosseum (outside view)', lat: 41.8908, lng: 12.4903, hours: ALWAYS, kind: 'view',
    info: 'Best lit-up view from Via Nicola Salvi, above the metro station.' },
  forum: { name: 'Roman Forum & Palatine Hill', lat: 41.8925, lng: 12.4853, hours: h('08:30', '15:30', '16:30'), kind: 'museum',
    ticket: 'Included with Colosseum ticket', url: 'https://colosseo.it/en/' },
  monti: { name: 'Monti neighbourhood', lat: 41.8953, lng: 12.4925, hours: ALWAYS, kind: 'food',
    info: 'Piazza della Madonna dei Monti and Via Urbana: wine bars, trattorias, boutiques.' },
  capitoline: { name: 'Capitoline Museums', lat: 41.8930, lng: 12.4828, hours: h('09:30', '18:30', '19:30'), kind: 'museum',
    ticket: '~€16', info: 'Don\'t miss the Tabularium gallery: the best view over the Forum. Terrazza Caffarelli café inside.',
    url: 'https://www.museicapitolini.org/en' },
  forumNightView: { name: 'Forum night view (Via del Campidoglio)', lat: 41.8925, lng: 12.4845, hours: ALWAYS, kind: 'view',
    info: 'Walk behind the Campidoglio for the floodlit Forum.' },
  vittoriano: { name: 'Vittoriano & Roof Terrace', lat: 41.8946, lng: 12.4831, hours: h('09:30', '18:45', '19:30'), kind: 'view',
    ticket: '~€17 incl. panoramic lift', url: 'https://vive.cultura.gov.it/' },
  foriImperiali: { name: 'Via dei Fori Imperiali & Trajan\'s Column', lat: 41.8935, lng: 12.4880, hours: ALWAYS, kind: 'walk',
    info: 'Floodlit at night. Trajan\'s Markets (open till 19:30, last entry 18:30) are an optional add-on.' },
  smMaggiore: { name: 'Santa Maria Maggiore', lat: 41.8976, lng: 12.4984, hours: h('07:00', '18:30', '18:45'), kind: 'church',
    info: 'Free. 5th-century mosaics. Dress code: covered shoulders and knees.' },
  bocca: { name: 'Mouth of Truth (Bocca della Verità)', lat: 41.8881, lng: 12.4815, hours: h('09:30', '17:30', '17:50'), kind: 'walk' },
  circus: { name: 'Circus Maximus', lat: 41.8861, lng: 12.4851, hours: ALWAYS, kind: 'walk' },
  aranci: { name: 'Orange Garden & Aventine Keyhole', lat: 41.8840, lng: 12.4792, hours: h('07:00', '16:45', '17:00'), kind: 'view',
    info: 'Garden open until dusk (~17:00 in November). The Knights of Malta keyhole, a few steps away, works any time.' },
  pyramid: { name: 'Pyramid of Cestius', lat: 41.8765, lng: 12.4808, hours: ALWAYS, kind: 'walk', info: 'Floodlit at night.' },
  testaccio: { name: 'Testaccio dinner', lat: 41.8775, lng: 12.4758, hours: ALWAYS, kind: 'food',
    info: 'Rome\'s classic food district: cacio e pepe, carbonara, offal dishes. Book a trattoria.' },
  caracalla: { name: 'Baths of Caracalla', lat: 41.8790, lng: 12.4925, hours: h('09:00', '15:30', '16:30', { special: { 1: ['09:00', '13:00', '14:00'] } }),
    kind: 'museum', ticket: '~€8', url: 'https://www.soprintendenzaspecialeroma.it/' },
  appia: { name: 'Appian Way (Via Appia Antica)', lat: 41.8735, lng: 12.5015, hours: ALWAYS, kind: 'park',
    info: 'Rent a bike or e-bike at the Appia Antica Park info point. Partly car-free on Sundays.',
    url: 'https://www.parcoappiaantica.it/' },
  callisto: { name: 'Catacombs of San Callisto', lat: 41.8594, lng: 12.5108,
    hours: h('09:00', '16:30', '17:00', { closed: [3] }), kind: 'museum', ticket: '~€10 guided',
    info: 'Closed Wednesdays and at lunch (~12:00–14:00). Check annual closure dates.', url: 'https://www.catacombe.roma.it/' },
  cecilia: { name: 'Tomb of Cecilia Metella', lat: 41.8526, lng: 12.5207, hours: h('09:00', '16:00', '16:30', { closed: [1] }), kind: 'museum',
    ticket: 'Included in Appia Antica ticket' },

  // ---- Vatican & Borgo
  vaticanMuseums: { name: 'Vatican Museums & Sistine Chapel', lat: 41.9065, lng: 12.4536,
    hours: h('08:00', '17:00', '19:00', { closed: [0] }), kind: 'museum', ticket: '~€20 + booking', booking: true,
    info: 'Closed Sundays (except the last Sunday of the month, free and very crowded). Book the earliest slot.',
    url: 'https://www.museivaticani.va/' },
  stPeters: { name: "St Peter's Basilica & Dome", lat: 41.9022, lng: 12.4539, hours: h('07:00', '18:15', '18:30'), kind: 'church',
    info: 'Basilica free (security line). Dome climb ~€10, closes earlier (~16:00–17:00). Dress code applies.',
    url: 'https://www.basilicasanpietro.va/' },
  stPetersSquare: { name: "St Peter's Square", lat: 41.9022, lng: 12.4568, hours: ALWAYS, kind: 'walk' },
  castel: { name: "Castel Sant'Angelo", lat: 41.9031, lng: 12.4663, hours: h('09:00', '18:30', '19:30', { closed: [1] }), kind: 'museum',
    ticket: '~€16', url: 'https://direzionemuseiroma.cultura.gov.it/' },

  // ---- Trastevere & Gianicolo
  portaPortese: { name: 'Porta Portese flea market', lat: 41.8810, lng: 12.4720,
    hours: h('06:00', '13:30', '14:00', { closed: [1, 2, 3, 4, 5, 6] }), kind: 'food', info: 'Sundays only. Watch your pockets.' },
  smTrastevere: { name: 'Santa Maria in Trastevere', lat: 41.8894, lng: 12.4703, hours: h('07:30', '20:30', '21:00'), kind: 'church',
    info: 'Golden 12th-century mosaics.' },
  trastevere: { name: 'Trastevere evening (Piazza Trilussa & lanes)', lat: 41.8890, lng: 12.4700, hours: ALWAYS, kind: 'food' },
  gianicolo: { name: 'Gianicolo Terrace (noon cannon)', lat: 41.8919, lng: 12.4610, hours: ALWAYS, kind: 'view',
    info: 'A cannon is fired every day at 12:00. Great city panorama.' },
  acquaPaola: { name: "Fontana dell'Acqua Paola", lat: 41.8882, lng: 12.4664, hours: ALWAYS, kind: 'view' },

  // ---- Termini / Esquilino
  diocletian: { name: 'Baths of Diocletian & Santa Maria degli Angeli', lat: 41.9030, lng: 12.4970,
    hours: h('09:30', '18:30', '19:30', { closed: [1] }), kind: 'museum', ticket: '~€12 (Museo Nazionale Romano card)',
    info: 'The basilica designed by Michelangelo inside the baths is free and open in the evening.',
    url: 'https://museonazionaleromano.beniculturali.it/' },
  opera: { name: 'Teatro dell\'Opera di Roma (optional show)', lat: 41.9006, lng: 12.4955, hours: ALWAYS, kind: 'show',
    info: 'Check the programme and book. Performances usually start 19:00–20:00.', url: 'https://www.operaroma.it/en/' },
  palazzoMassimo: { name: 'Palazzo Massimo (Museo Nazionale Romano)', lat: 41.9013, lng: 12.4986,
    hours: h('09:30', '18:00', '19:00', { closed: [1] }), kind: 'museum', ticket: '~€12 (combined card)',
    info: 'Livia\'s garden frescoes and the Boxer at Rest.', url: 'https://museonazionaleromano.beniculturali.it/' },
  lateran: { name: 'San Giovanni in Laterano & Scala Santa', lat: 41.8859, lng: 12.5059, hours: h('07:00', '18:15', '18:30'), kind: 'church',
    info: "Rome's cathedral. The Holy Stairs next door close at lunch." },
  sanClemente: { name: 'San Clemente (underground basilica)', lat: 41.8893, lng: 12.4975,
    hours: h('10:00', '17:30', '18:00', { special: { 0: ['12:00', '17:30', '18:00'] } }), kind: 'church',
    ticket: '~€10 for the excavations', info: 'Three layers: 12th-century church, 4th-century church, Mithraic temple. Closed ~12:30–15:00 on weekdays.' },

  termini: { name: 'Roma Termini station', lat: 41.9010, lng: 12.5018, hours: ALWAYS, kind: 'transport',
    info: '~20 min from the hotel on foot, or bus 910 / taxi.' },
  tiburtina: { name: 'Roma Tiburtina station', lat: 41.9105, lng: 12.5306, hours: ALWAYS, kind: 'transport' },
  piramideStation: { name: 'Piramide / Porta San Paolo station', lat: 41.8763, lng: 12.4815, hours: ALWAYS, kind: 'transport',
    info: 'Metro B to Piramide, then the Roma–Lido train (same metro ticket).' },

  // ---- Day trips
  florenceSMN: { name: 'Firenze Santa Maria Novella station', lat: 43.7765, lng: 11.2480, hours: ALWAYS, kind: 'transport' },
  uffizi: { name: 'Uffizi Gallery', lat: 43.7678, lng: 11.2553, hours: h('08:15', '17:30', '18:30', { closed: [1] }), kind: 'museum',
    ticket: '~€25 + booking', booking: true, url: 'https://www.uffizi.it/en' },
  duomoFlorence: { name: 'Florence Duomo & Baptistery', lat: 43.7731, lng: 11.2560, hours: h('10:15', '15:45', '16:30', { special: { 0: ['13:30', '16:00', '16:30'] } }),
    kind: 'church', info: 'Cathedral free; dome climb needs a timed ticket (Brunelleschi Pass).', url: 'https://duomo.firenze.it/en' },
  accademia: { name: "Accademia Gallery (Michelangelo's David)", lat: 43.7768, lng: 11.2586, hours: h('08:15', '18:20', '18:50', { closed: [1] }),
    kind: 'museum', ticket: '~€16 + booking', booking: true, url: 'https://www.galleriaaccademiafirenze.it/en/' },
  pontevecchio: { name: 'Ponte Vecchio', lat: 43.7680, lng: 11.2531, hours: ALWAYS, kind: 'walk' },
  michelangelo: { name: 'Piazzale Michelangelo (sunset)', lat: 43.7629, lng: 11.2650, hours: ALWAYS, kind: 'view' },

  napoliCentrale: { name: 'Napoli Centrale station', lat: 40.8530, lng: 14.2726, hours: ALWAYS, kind: 'transport',
    info: 'Take the Circumvesuviana (Sorrento line) downstairs at Garibaldi to Pompei Scavi, ~35 min.' },
  pompeii: { name: 'Pompeii archaeological site', lat: 40.7486, lng: 14.4847, hours: h('09:00', '15:30', '17:00'), kind: 'museum',
    ticket: '~€22', info: 'Huge site: wear good shoes, bring water. Enter at Porta Marina.', url: 'https://pompeiisites.org/en/' },
  spaccanapoli: { name: 'Spaccanapoli & pizza in Naples', lat: 40.8490, lng: 14.2560, hours: ALWAYS, kind: 'food',
    info: 'Historic centre walk, then Neapolitan pizza (Via dei Tribunali).' },

  villaEste: { name: "Villa d'Este (Tivoli)", lat: 41.9632, lng: 12.7962, hours: h('08:45', '16:15', '17:15', { special: { 1: ['14:00', '16:15', '17:15'] } }),
    kind: 'museum', ticket: '~€15', info: 'Renaissance fountain gardens. UNESCO site.', url: 'https://www.villae.cultura.gov.it/' },
  villaAdriana: { name: "Hadrian's Villa (Tivoli)", lat: 41.9425, lng: 12.7744, hours: h('08:15', '15:30', '17:00'), kind: 'museum',
    ticket: '~€15', info: 'Bus 4X from Tivoli centre or taxi (~10 min).', url: 'https://www.villae.cultura.gov.it/' },
  tivoliStation: { name: 'Tivoli station', lat: 41.9590, lng: 12.8020, hours: ALWAYS, kind: 'transport' },

  orvietoStation: { name: 'Orvieto station & funicular', lat: 42.7243, lng: 12.1293, hours: ALWAYS, kind: 'transport',
    info: 'Funicular up to the old town, then shuttle bus to the Duomo.' },
  orvietoDuomo: { name: 'Orvieto Cathedral', lat: 42.7175, lng: 12.1137, hours: h('09:30', '16:30', '17:00', { special: { 0: ['13:00', '16:00', '16:30'] } }),
    kind: 'church', ticket: '~€5', info: "Signorelli's frescoes in the San Brizio chapel.", url: 'https://www.duomodiorvieto.it/' },
  orvietoUnderground: { name: 'Orvieto Underground (cave tour)', lat: 42.7180, lng: 12.1130, hours: h('11:00', '16:15', '17:00'), kind: 'museum',
    ticket: '~€8', info: 'Guided tours of Etruscan caves; several per day.' },
  pozzo: { name: "St Patrick's Well", lat: 42.7232, lng: 12.1265, hours: h('10:00', '17:00', '17:30'), kind: 'museum', ticket: '~€5' },

  ostia: { name: 'Ostia Antica', lat: 41.7558, lng: 12.2918, hours: h('08:30', '15:30', '16:30', { closed: [1] }), kind: 'museum',
    ticket: '~€18', info: "Rome's ancient port: like Pompeii, but 40 minutes away.", url: 'https://www.ostiaantica.beniculturali.it/' },

  assisiStation: { name: 'Assisi station', lat: 43.0583, lng: 12.5822, hours: ALWAYS, kind: 'transport',
    info: 'Bus C or taxi up to the town.' },
  assisiBasilica: { name: 'Basilica of St Francis', lat: 43.0750, lng: 12.6056, hours: h('08:30', '17:45', '18:00'), kind: 'church',
    info: 'Free. Giotto frescoes in the Upper Basilica.', url: 'https://www.sanfrancescoassisi.org/' },
  assisiTown: { name: 'Assisi old town & Piazza del Comune', lat: 43.0706, lng: 12.6153, hours: ALWAYS, kind: 'walk' },
}

// A stop is { p: placeId, dur: minutes, at?: 'HH:MM' (booked time / don't arrive before), tip?, train?: { mins, label } }
// `train` means you reach this stop by intercity train, which takes `mins`.

const W = 'weekday'
const E = 'weekend'

export const DAYS = [
  { type: W, title: 'Arrival evening: the classic walk', stops: [
    { p: 'viaVeneto', dur: 15 },
    { p: 'spanishSteps', dur: 30 },
    { p: 'condotti', dur: 30, tip: 'Shops close around 19:30–20:00.' },
    { p: 'trevi', dur: 30, tip: 'Throw a coin over your left shoulder.' },
  ], dinner: 'Around Trevi, avoid the menus with photos: walk 2–3 streets away (e.g. Via dei Crociferi area).' },

  { type: W, title: 'Pantheon & Piazza Navona', stops: [
    { p: 'pantheon', dur: 30, tip: 'Last entry 18:30. If you finish work late, see it from outside and swap with a weekend morning.' },
    { p: 'navona', dur: 30 },
    { p: 'campo', dur: 90, tip: 'Friday-night aperitivo crowd.' },
  ] },

  // Sat 14
  { type: E, title: 'Ancient Rome', stops: [
    { p: 'colosseum', dur: 105, at: '08:30', tip: 'Book the 08:30 slot. Winter closing is 16:30.' },
    { p: 'forum', dur: 150 },
    { p: 'monti', dur: 60, tip: 'Lunch.' },
    { p: 'capitoline', dur: 120 },
    { p: 'vittoriano', dur: 45, tip: 'Sunset is ~16:50 in mid-November.' },
  ], dinner: 'Monti or the Jewish Ghetto (Ghetto kosher places reopen Saturday after dark).',
  alts: [
    { id: 'florence', title: 'Day trip: Florence', transport: 'High-speed train (Frecciarossa or Italo) Roma Termini → Firenze S.M. Novella, ~1h35, about every 15–30 min. Book on trenitalia.com or italotreno.com; cheaper in advance.', stops: [
      { p: 'termini', dur: 15, at: '07:30' },
      { p: 'florenceSMN', dur: 5, train: { mins: 95, label: 'Frecciarossa / Italo' } },
      { p: 'accademia', dur: 75, tip: 'Book a timed entry.' },
      { p: 'duomoFlorence', dur: 60 },
      { p: 'uffizi', dur: 150, tip: 'Book a timed entry. Lunch before or after.' },
      { p: 'pontevecchio', dur: 20 },
      { p: 'michelangelo', dur: 40, tip: 'Then back to SMN for an evening train (last trains ~21:00–22:00).' },
    ] },
  ] },

  // Sun 15
  { type: E, title: 'Trastevere, Gianicolo & the Aventine', stops: [
    { p: 'portaPortese', dur: 75, at: '09:00', tip: 'Sundays only.' },
    { p: 'smTrastevere', dur: 30 },
    { p: 'gianicolo', dur: 45, at: '11:45', tip: 'Be there for the 12:00 cannon shot.' },
    { p: 'acquaPaola', dur: 15 },
    { p: 'tiberina', dur: 60, tip: 'Lunch on the way down in Trastevere.' },
    { p: 'bocca', dur: 20 },
    { p: 'circus', dur: 20 },
    { p: 'aranci', dur: 40, tip: 'Sunset from the Orange Garden, then peek through the keyhole.' },
  ], dinner: 'Testaccio is a 10-minute walk down the hill.',
  alts: [
    { id: 'tivoli', title: "Day trip: Tivoli (Villa d'Este & Hadrian's Villa)", transport: 'Regional train Roma Tiburtina → Tivoli, ~1h (or COTRAL bus from Ponte Mammolo, Metro B). Use a BIRG regional ticket.', stops: [
      { p: 'tiburtina', dur: 10, at: '08:30' },
      { p: 'tivoliStation', dur: 5, train: { mins: 60, label: 'Regional train' } },
      { p: 'villaEste', dur: 120 },
      { p: 'villaAdriana', dur: 150, tip: 'Lunch in Tivoli first, then bus 4X or taxi.' },
    ] },
  ] },

  { type: W, title: 'Santa Maria Maggiore, Monti & the Colosseum lit up', stops: [
    { p: 'smMaggiore', dur: 30, tip: 'Closes 18:45.' },
    { p: 'monti', dur: 90, tip: 'Dinner.' },
    { p: 'colosseumNight', dur: 30 },
  ] },

  { type: W, title: 'Capitoline Museums & the Forum at night', stops: [
    { p: 'capitoline', dur: 75, tip: 'Last entry 18:30. If you did it on Saturday, skip straight to the views.' },
    { p: 'forumNightView', dur: 20 },
    { p: 'foriImperiali', dur: 30 },
  ], dinner: 'Monti, 5 minutes away.' },

  { type: W, title: 'Easy evening: Coppedè near the hotel', stops: [
    { p: 'coppede', dur: 45, tip: 'A short walk from the hotel. A good night after a long work day.' },
  ], dinner: 'Local trattorias around Piazza Buenos Aires / Via Tagliamento.' },

  { type: W, title: 'Ara Pacis & Piazza del Popolo', stops: [
    { p: 'araPacis', dur: 50, tip: 'Last entry 18:30.' },
    { p: 'augustus', dur: 15 },
    { p: 'condotti', dur: 30 },
    { p: 'popolo', dur: 20 },
  ], dinner: 'Via della Croce / Via Ripetta.' },

  { type: W, title: 'Friday night in Trastevere', stops: [
    { p: 'smTrastevere', dur: 30, tip: 'Open until ~20:30–21:00.' },
    { p: 'trastevere', dur: 150, tip: 'Dinner, then drinks around Piazza Trilussa.' },
  ] },

  // Sat 21
  { type: E, title: "Vatican: Museums, Sistine Chapel & St Peter's", stops: [
    { p: 'vaticanMuseums', dur: 210, at: '08:00', tip: 'Book the 08:00 slot. Sistine Chapel is at the end; no photos inside.' },
    { p: 'stPeters', dur: 90, tip: 'Dome climb first if it is still open.' },
    { p: 'stPetersSquare', dur: 15 },
    { p: 'castel', dur: 90, tip: 'Rooftop terrace at sunset.' },
    { p: 'navona', dur: 30 },
  ], dinner: 'Around Piazza Navona or Via dei Coronari.',
  alts: [
    { id: 'pompeii', title: 'Day trip: Naples & Pompeii', transport: 'High-speed train Roma Termini → Napoli Centrale, ~1h10. Then Circumvesuviana to Pompei Scavi, ~35 min. Long day: leave early.', stops: [
      { p: 'termini', dur: 15, at: '07:00' },
      { p: 'napoliCentrale', dur: 15, train: { mins: 70, label: 'Frecciarossa / Italo' } },
      { p: 'pompeii', dur: 210, train: { mins: 40, label: 'Circumvesuviana' }, tip: 'Last entry 15:30.' },
      { p: 'spaccanapoli', dur: 120, train: { mins: 40, label: 'Circumvesuviana back' }, tip: 'Pizza dinner, then an evening train back to Rome.' },
    ] },
  ] },

  // Sun 22
  { type: E, title: 'Borghese Gallery, the park & Palazzo Barberini', stops: [
    { p: 'borghese', dur: 120, at: '09:00', tip: 'Book the 09:00 slot now, it sells out.' },
    { p: 'villaBorghese', dur: 60 },
    { p: 'pincio', dur: 20 },
    { p: 'popolo', dur: 30, tip: 'Church visits are limited during Sunday Mass.' },
    { p: 'margutta', dur: 15 },
    { p: 'doria', dur: 90, tip: 'Lunch first. Open later on Sundays.' },
    { p: 'trevi', dur: 20 },
    { p: 'barberini', dur: 75, tip: 'Last entry 18:00, so it fits on a weekend but not after work.' },
  ],
  alts: [
    { id: 'orvieto', title: 'Day trip: Orvieto', transport: 'Regional train Roma Termini → Orvieto, ~1h15 (some faster IC trains). Then the funicular up the hill.', stops: [
      { p: 'termini', dur: 15, at: '08:15' },
      { p: 'orvietoStation', dur: 15, train: { mins: 75, label: 'Regional / Intercity' } },
      { p: 'pozzo', dur: 45 },
      { p: 'orvietoUnderground', dur: 60, tip: 'Lunch afterwards.' },
      { p: 'orvietoDuomo', dur: 60, tip: 'Sunday: opens 13:00.' },
    ] },
  ] },

  { type: W, title: 'Vittoriano terrace & Imperial Forums', stops: [
    { p: 'vittoriano', dur: 45, tip: 'Last lift ~18:45.' },
    { p: 'foriImperiali', dur: 40 },
    { p: 'colosseumNight', dur: 20 },
  ], dinner: 'Monti.' },

  { type: W, title: 'Baths of Diocletian & a night at the opera', stops: [
    { p: 'diocletian', dur: 45, tip: 'Museum last entry 18:30; the basilica is free and open later.' },
    { p: 'opera', dur: 150, tip: 'Optional. If there is no show, have dinner in Monti instead.' },
  ] },

  { type: W, title: 'Capuchin Crypt, Via Veneto & the Quirinale', stops: [
    { p: 'capuchin', dur: 40, tip: 'Last entry 18:30, 15 minutes on foot from the hotel.' },
    { p: 'quirinale', dur: 20 },
    { p: 'viaVeneto', dur: 60, tip: 'Dinner or a drink on the way back.' },
  ] },

  { type: W, title: 'Jewish Ghetto evening', stops: [
    { p: 'argentina', dur: 15 },
    { p: 'turtle', dur: 10 },
    { p: 'ghetto', dur: 120, tip: 'Dinner: carciofi alla giudia, fried baccalà.' },
    { p: 'tiberina', dur: 20 },
  ] },

  { type: W, title: 'Pyramid & Testaccio food night', stops: [
    { p: 'pyramid', dur: 15 },
    { p: 'testaccio', dur: 120, tip: 'Book ahead on Friday nights.' },
  ] },

  // Sat 28
  { type: E, title: 'Appian Way, catacombs & Baths of Caracalla', stops: [
    { p: 'caracalla', dur: 90, at: '09:00' },
    { p: 'appia', dur: 60, tip: 'Pick up bikes at the park info point.' },
    { p: 'callisto', dur: 60, tip: 'Closed ~12:00–14:00; time it before or after lunch.' },
    { p: 'cecilia', dur: 45 },
  ], dinner: 'Back in town, anywhere you missed.',
  alts: [
    { id: 'ostia', title: 'Half-day trip: Ostia Antica', transport: 'Metro B to Piramide, then the Roma–Lido train to Ostia Antica, ~30 min. A normal metro ticket covers it.', stops: [
      { p: 'piramideStation', dur: 10, at: '09:00' },
      { p: 'ostia', dur: 180, train: { mins: 30, label: 'Roma–Lido train' } },
    ] },
    { id: 'assisi', title: 'Day trip: Assisi', transport: 'Regional train Roma Termini → Assisi, ~2h–2h20 (some need a change at Foligno).', stops: [
      { p: 'termini', dur: 15, at: '07:30' },
      { p: 'assisiStation', dur: 20, train: { mins: 135, label: 'Regional train' } },
      { p: 'assisiBasilica', dur: 90 },
      { p: 'assisiTown', dur: 120, tip: 'Lunch and a walk up to Piazza del Comune.' },
    ] },
  ] },

  // Sun 29
  { type: E, title: 'Lateran, San Clemente & Palazzo Massimo', stops: [
    { p: 'lateran', dur: 75, at: '09:30' },
    { p: 'sanClemente', dur: 60, at: '12:00', tip: 'Sunday: opens at 12:00.' },
    { p: 'colosseumNight', dur: 15, tip: 'A last daytime look, then lunch in Monti.' },
    { p: 'palazzoMassimo', dur: 120 },
    { p: 'diocletian', dur: 30, tip: 'The free basilica if you skipped it on Tuesday.' },
  ], dinner: 'Today is also the last Sunday of the month: the Vatican Museums are free 9:00–14:00 (expect long queues) if you want a second visit.',
  alts: [
    { id: 'ostia2', title: 'Half-day trip: Ostia Antica', transport: 'Metro B to Piramide, then the Roma–Lido train to Ostia Antica, ~30 min.', stops: [
      { p: 'piramideStation', dur: 10, at: '09:00' },
      { p: 'ostia', dur: 180, train: { mins: 30, label: 'Roma–Lido train' } },
    ] },
  ] },

  { type: W, title: 'Farewell: Pincio at night & Spanish Steps', stops: [
    { p: 'pincio', dur: 20 },
    { p: 'popolo', dur: 15 },
    { p: 'margutta', dur: 15 },
    { p: 'spanishSteps', dur: 20 },
  ], dinner: 'A farewell dinner. Toss one more coin in the Trevi on the way back?' },
]
