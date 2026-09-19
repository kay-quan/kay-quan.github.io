/* ==========================================================================
   PHOTOS.JS — the content of the site.

   Easiest way to edit this is tools/editor.html, which writes this file
   for you. Hand-editing is fine too — keep the same shape and the editor
   will still load it.

   w and h are the image's pixel dimensions. They reserve the right shape
   before the photo downloads, so the gallery never jumps while loading.
   ========================================================================== */

window.HERO = {
  src: "assets/img/hero/hero.jpg",
  alt: "Crowd lit by stage light at a festival main stage"
};

window.PHOTOS = [

  /* --- FESTIVALS --- */
  { src: "assets/img/festivals/mainstage-01.jpg", w: 3000, h: 2000, title: "Main stage, last song", event: "Osheaga 2025", category: "festivals", featured: true },
  { src: "assets/img/festivals/crowd-01.jpg", w: 2000, h: 3000, title: "Front barricade", event: "Osheaga 2025", category: "festivals", featured: true },
  { src: "assets/img/festivals/lights-01.jpg", w: 3000, h: 2000, title: "Haze and hard light", event: "Osheaga 2025", category: "festivals", featured: true },
  { src: "assets/img/festivals/portrait-backstage-01.jpg", w: 2000, h: 2500, title: "Backstage, ten minutes out", event: "Osheaga 2025", category: "festivals" },
  { src: "assets/img/festivals/sunset-01.jpg", w: 3000, h: 1700, title: "Golden hour over the field", event: "Bonnaroo 2025", category: "festivals", featured: true },
  { src: "assets/img/festivals/guitarist-01.jpg", w: 2000, h: 3000, title: "Second guitarist, stage left", event: "Bonnaroo 2025", category: "festivals", featured: true },
  { src: "assets/img/festivals/pit-01.jpg", w: 3000, h: 2000, title: "Pit opening up", event: "Bonnaroo 2025", category: "festivals" },
  { src: "assets/img/festivals/confetti-01.jpg", w: 3000, h: 2000, title: "Confetti drop", event: "Bonnaroo 2025", category: "festivals", featured: true },
  { src: "assets/img/festivals/dj-01.jpg", w: 2400, h: 3000, title: "Booth silhouette", event: "Electric Forest 2024", category: "festivals", featured: true },
  { src: "assets/img/festivals/crowd-02.jpg", w: 3000, h: 2000, title: "Twenty thousand hands", event: "Electric Forest 2024", category: "festivals", featured: true },
  { src: "assets/img/festivals/lasers-01.jpg", w: 3000, h: 1600, title: "Laser wash", event: "Electric Forest 2024", category: "festivals" },
  { src: "assets/img/festivals/rain-01.jpg", w: 2000, h: 3000, title: "Rain set", event: "Electric Forest 2024", category: "festivals" },
  { src: "assets/img/festivals/singer-01.jpg", w: 3000, h: 2000, title: "Reaching into the crowd", event: "Field Day 2024", category: "festivals", featured: true },
  { src: "assets/img/festivals/detail-01.jpg", w: 2200, h: 2200, title: "Setlist, taped down", event: "Field Day 2024", category: "festivals" },
  { src: "assets/img/festivals/wide-01.jpg", w: 3000, h: 1500, title: "Site wide, blue hour", event: "Field Day 2024", category: "festivals" },

  /* --- PORTRAITS --- */
  { src: "assets/img/portraits/portrait-01.jpg", w: 2000, h: 2500, title: "Studio, single strobe", category: "portraits" },
  { src: "assets/img/portraits/portrait-02.jpg", w: 2000, h: 3000, title: "Window light", category: "portraits" },
  { src: "assets/img/portraits/portrait-03.jpg", w: 3000, h: 2000, title: "On location, overcast", category: "portraits" },
  { src: "assets/img/portraits/portrait-04.jpg", w: 2200, h: 2200, title: "Close crop", category: "portraits" },
  { src: "assets/img/portraits/portrait-05.jpg", w: 2000, h: 2800, title: "Environmental", category: "portraits" },
  { src: "assets/img/portraits/portrait-06.jpg", w: 3000, h: 2000, title: "Available light", category: "portraits" },

  /* --- WEDDINGS --- */
  { src: "assets/img/weddings/wedding-01.jpg", w: 3000, h: 2000, title: "First look", category: "weddings" },
  { src: "assets/img/weddings/wedding-02.jpg", w: 2000, h: 3000, title: "Getting ready", category: "weddings" },
  { src: "assets/img/weddings/wedding-03.jpg", w: 3000, h: 2000, title: "Ceremony, back row", category: "weddings" },
  { src: "assets/img/weddings/wedding-04.jpg", w: 2400, h: 3000, title: "The toast", category: "weddings" },
  { src: "assets/img/weddings/wedding-05.jpg", w: 3000, h: 1700, title: "Last dance", category: "weddings" },
  { src: "assets/img/weddings/wedding-06.jpg", w: 2200, h: 2200, title: "Rings and paperwork", category: "weddings" },

  /* --- FOOD --- */
  { src: "assets/img/food/food-01.jpg", w: 2400, h: 3000, title: "Plated, overhead", category: "food" },
  { src: "assets/img/food/food-02.jpg", w: 3000, h: 2000, title: "Pass, service", category: "food" },
  { src: "assets/img/food/food-03.jpg", w: 2200, h: 2200, title: "Hero dish", category: "food" },
  { src: "assets/img/food/food-04.jpg", w: 2000, h: 3000, title: "Hands and steam", category: "food" },
  { src: "assets/img/food/food-05.jpg", w: 3000, h: 2000, title: "Table, natural light", category: "food" },
  { src: "assets/img/food/food-06.jpg", w: 2400, h: 3000, title: "Drinks, low key", category: "food" },

];

/* The scrolling band of festival names on the homepage. */
window.MARQUEE = ["Tahoe Live", "Countdown"];
