/* ==========================================================================
   CONTENT.JS - every word on the site.

   Easiest way to edit this is tools/editor.html, the Text tab, which
   writes this file for you. Hand-editing is fine too.

   Elements in the HTML carry data-text="someKey" and get their contents
   replaced from here on load, so this file is the source of truth.
   ========================================================================== */

window.TEXT = {

  /* --- Contact & everywhere --- */
  email: "reachkevinquan@gmail.com",
  instagramUrl: "https://instagram.com/",
  instagramHandle: "@kay_quan",
  tagline: "Festival & live music photography",
  footerNote: "All photographs are my own work.",

  /* --- Homepage — the big opening --- */
  heroKicker: "Festival & live music photography",
  heroLine1: "Kevin",
  heroLine2: "Quan",
  heroSub: "I shoot festivals — main stages, barricades, the ten minutes before someone walks on. Portraits, weddings and food the rest of the year.",

  /* --- Homepage — selected work --- */
  featuredEyebrow: "Selected work",
  featuredTitle: "On the\nBarricade",

  /* --- Homepage — other work --- */
  otherEyebrow: "Beyond the stage",
  otherTitle: "The rest\nof the year",
  otherLede: "Festivals are seasonal. These aren't.",
  cardClubs: "Late rooms and small stages. Same job as a festival, tighter.",
  cardPortraits: "Studio and location. Musicians, and everyone else.",
  cardWeddings: "Documentary-leaning. Few setups, a lot of watching.",
  cardFood: "Menus, restaurants and the pass mid-service.",

  /* --- Homepage — how you work --- */
  approachEyebrow: "How I work",
  approachTitle: "Fast,\nunlit,\nclose",
  approachBody: "Festival light changes every eight seconds and nobody is going to wait for you. I shoot fast, I don't add light, and I get close enough that the frame feels like the room felt.\n\nPit access, backstage, crowd, site — I cover the whole day, not just the headliner. Galleries turn around quickly because a festival photo is worth the most the morning after.",

  /* --- Homepage — the facts list --- */
  homeFacts: [
    { label: "Based", value: "Add your city here" },
    { label: "Travel", value: "Anywhere there's a stage" },
    { label: "Turnaround", value: "Same-night selects, full gallery in 72 hours" },
    { label: "Covers", value: "Festivals, clubs, tours, press, portraits, weddings, food" },
    { label: "Clients", value: "Add promoters, venues and publications here" }
  ],

  /* --- Homepage — closing pitch --- */
  ctaEyebrow: "Bookings open",
  ctaTitle: "Shooting a festival?",
  ctaLede: "Send the dates and the lineup. I'll tell you straight away whether I'm free.",

  /* --- Festivals page --- */
  festEyebrow: "01 — Festivals",
  festTitle: "Festivals",
  festLede: "Main stages, side tents, the pit and everything behind it. Filter by event below, or click any frame to open it full screen.",
  festCtaTitle: "Next season",
  festCtaLede: "Festival, tour date or press shoot — send the dates and I'll come back to you quickly.",

  /* --- Other Work page --- */
  workEyebrow: "02 — Everything else",
  workTitle: "Other\nWork",
  workLede: "Clubs, portraits, weddings and food. Different rooms, same instinct — get close, use what light is already there.",
  workCtaTitle: "Something\nin mind?",
  workCtaLede: "Tell me what you need photographed and roughly when.",

  /* --- About page --- */
  aboutEyebrow: "03 — About",
  aboutTitle: "About",
  aboutLede: "I'm a photographer working mainly at festivals and live shows.",
  aboutBody: "I started out shooting portraits, weddings and food — which is where most of this portfolio still comes from — and those years taught me how to work quickly in rooms I don't control. That turned out to be exactly the skill festivals demand.\n\nNow most of my year is built around them. I like the whole day, not just the headline slot: the load-in, the crowd forming, the side tent nobody's covering, the three songs in the pit, the walk-off.\n\nI shoot available light almost exclusively. No flash in the pit, no staging the crowd. If a frame looks like it happened, it's because it did.\n\nBased in [your city], travelling for anything worth travelling for.",
  aboutFacts: [
    { label: "Gear", value: "List your bodies and fast primes here" },
    { label: "Delivery", value: "Same-night selects, full gallery in 72 hours" },
    { label: "Licensing", value: "Editorial and commercial, quoted per use" },
    { label: "Insured", value: "Public liability — add your details" }
  ],

  /* --- Contact section --- */
  contactEyebrow: "Contact",
  contactTitle: "Let's\ntalk",
  contactLede: "Email is best. Include the dates, the location and what you need — pit access, full-day coverage, portraits, licensing.",
  contactFacts: [
    { label: "Phone", value: "Add a number, or delete this row" },
    { label: "Response", value: "Within 24 hours, usually sooner" }
  ]
};

/* --------------------------------------------------------------------------
   WHAT APPEARS ON THE SITE

   false removes that block from the page. Anything not listed is shown,
   so leaving a key out is safe.
   -------------------------------------------------------------------------- */
window.SHOW = {
  marquee:        true,   // Festival names ticker (homepage)
  approach:       true,   // “How I work” block (homepage)
  homeFacts:      true,   // Facts list (homepage)
  homeCta:        true,   // Closing pitch (homepage)
  catClubs:       true,   // Clubs — card and section
  catPortraits:   true,   // Portraits — card and section
  catWeddings:    true,   // Weddings — card and section
  catFood:        true,   // Food — card and section
  aboutPortrait:  true,   // Photo of you (About page)
  aboutFacts:     true,   // Facts list (About page)
  contactFacts:   true,   // Extra contact rows
  contactForm:    true   // Enquiry form
};
