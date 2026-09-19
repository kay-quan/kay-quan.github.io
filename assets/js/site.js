/* ===========================================================================
   site.js — all behaviour for the site.

   You shouldn't need to edit this file to add photos. Edit photos.js instead.

   What's in here:
     · nav          sticky state + mobile menu
     · parallax     hero image drifts slower than the page
     · reveal       fade content in on scroll
     · marquee      builds the scrolling festival names
     · grid         renders photo tiles + true masonry layout
     · filters      chip filtering, re-renders the grid
     · lightbox     fullscreen viewer, keyboard + swipe
   =========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var photos = window.PHOTOS || [];
  var TEXT = window.TEXT || {};

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ======================================================================
     MEDIA  —  image with a graceful placeholder when the file isn't there
     ====================================================================== */

  var PH_ICON =
    '<svg class="ph__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8a1 1 0 0 0 .84-.46l.92-1.42A1 1 0 0 1 9.9 3.6h4.2a1 1 0 0 1 .84.52l.92 1.42a1 1 0 0 0 .84.46h1.8A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/>' +
    '<circle cx="12" cy="12" r="3.4"/></svg>';

  /* The placeholder block. Shows the exact filename the page is looking for,
     so dropping the file in is unambiguous. */
  function placeholderHTML(src) {
    var name = String(src || "").split("/").pop();
    return '<div class="ph">' + PH_ICON +
           '<span class="ph__name">' + esc(name) + '</span>' +
           '<span class="ph__hint">Drop image here</span></div>';
  }

  /* Wire up load/error so the placeholder disappears the moment a real file
     resolves, and stays put when it 404s. */
  function bindMedia(wrapper) {
    var img = $("img", wrapper);
    if (!img) return;

    function ok() { wrapper.classList.add("has-image"); }
    function fail() { img.classList.add("is-missing"); }

    if (img.complete) {
      if (img.naturalWidth > 0) ok(); else fail();
    } else {
      img.addEventListener("load", ok, { once: true });
      img.addEventListener("error", fail, { once: true });
    }
  }

  /* ======================================================================
     TEXT  —  swap in the copy from content.js

     Every editable string lives in content.js. The words sitting in the HTML
     are a fallback for if that file fails to load, so nothing ever renders
     empty. Runs immediately rather than on DOMContentLoaded: this script sits
     at the end of <body>, so the DOM above it is already parsed, and doing it
     now avoids a visible flash of the old wording.

       data-text       plain text
       data-text-lines newlines become line breaks (for stacked headings)
       data-text-body  blank lines become separate paragraphs
       data-text-mail  sets the text and the mailto: link together
       data-text-href  sets just the link target
     ====================================================================== */

  function applyText() {
    if (!window.TEXT) return;

    $$("[data-text]").forEach(function (el) {
      var v = TEXT[el.dataset.text];
      if (typeof v === "string") el.textContent = v;
    });

    $$("[data-text-lines]").forEach(function (el) {
      var v = TEXT[el.dataset.textLines];
      if (typeof v !== "string") return;
      el.innerHTML = "";
      v.split("\n").forEach(function (line, i) {
        if (i) el.appendChild(document.createElement("br"));
        el.appendChild(document.createTextNode(line));
      });
    });

    $$("[data-text-body]").forEach(function (el) {
      var v = TEXT[el.dataset.textBody];
      if (typeof v !== "string") return;
      el.innerHTML = "";
      v.split(/\n\s*\n/).forEach(function (para) {
        if (!para.trim()) return;
        var p = document.createElement("p");
        p.textContent = para.trim();
        el.appendChild(p);
      });
    });

    $$("[data-text-mail]").forEach(function (el) {
      var v = TEXT[el.dataset.textMail];
      if (typeof v !== "string" || !v) return;
      el.textContent = v;
      el.setAttribute("href", "mailto:" + v);
    });

    $$("[data-text-href]").forEach(function (el) {
      var v = TEXT[el.dataset.textHref];
      if (typeof v === "string" && v) el.setAttribute("href", v);
    });

    /* Repeatable rows. Runs last so it wins over any per-key markup left
       inside the list from before these became editable lists. */
    $$("[data-text-list]").forEach(function (el) {
      var rows = TEXT[el.dataset.textList];
      if (!Array.isArray(rows)) return;   // absent: leave the HTML alone
      el.innerHTML = "";
      rows.forEach(function (row) {
        if (!row || (!row.label && !row.value)) return;
        var wrap = document.createElement("div");
        wrap.className = "facts__row";
        var dt = document.createElement("dt");
        dt.textContent = row.label || "";
        var dd = document.createElement("dd");
        dd.textContent = row.value || "";
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        el.appendChild(wrap);
      });
    });
  }

  /* ======================================================================
     VISIBILITY  —  optional blocks switched off in content.js

     Absent or true means shown, so a block that predates its switch never
     vanishes by accident. Only an explicit false removes anything.
     ====================================================================== */

  function applyVisibility() {
    var SHOW = window.SHOW || {};
    $$("[data-show]").forEach(function (el) {
      if (SHOW[el.dataset.show] === false) el.remove();
    });
  }

  applyText();
  applyVisibility();

  /* ======================================================================
     NAV
     ====================================================================== */

  function initNav() {
    var nav = $("#nav");
    var toggle = $(".nav__toggle");
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      /* Close the menu when a link is tapped, and on Escape */
      $$(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("menu-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
          document.body.classList.remove("menu-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    }
  }

  /* ======================================================================
     HERO  —  image + parallax drift
     ====================================================================== */

  function initHero() {
    var media = $("[data-hero-media]");
    if (!media) return;

    var hero = window.HERO || {};
    var src = hero.src || "assets/img/hero/hero.jpg";

    media.innerHTML =
      placeholderHTML(src) +
      '<img src="' + esc(src) + '" alt="' + esc(hero.alt || "") +
      '" fetchpriority="high" decoding="async">';

    bindMedia(media);

    if (reduceMotion) return;

    /* Drift the hero at ~30% of scroll speed. rAF-throttled, and we stop
       doing work once the hero is off screen. */
    var ticking = false;
    var heroEl = media.closest(".hero") || media.parentElement;

    function update() {
      ticking = false;
      var y = window.scrollY;
      if (y > heroEl.offsetHeight) return;
      media.style.transform = "translate3d(0," + (y * 0.3).toFixed(2) + "px,0)";
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });

    update();
  }

  /* ======================================================================
     REVEAL ON SCROLL
     ====================================================================== */

  var revealObserver = null;
  var revealFired = false;

  /* Last resort: show everything and stop trying to animate. */
  function revealAll() {
    if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
    $$("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
  }

  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealFired = true;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    observeReveals(document);

    /* Everything on this site starts at opacity 0 and is revealed by the
       observer. If the observer never delivers a callback — some embedded
       webviews, aggressive privacy extensions, a backgrounded tab that never
       composites — the gallery would simply stay blank. A photography site
       rendering nothing is a worse outcome than one that doesn't animate, so
       if nothing has been revealed shortly after load, drop the effect and
       show the page. */
    window.setTimeout(function () {
      if (!revealFired) revealAll();
    }, 1600);
  }

  function observeReveals(root) {
    var els = $$("[data-reveal]", root);
    if (!revealObserver) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    els.forEach(function (el) {
      if (!el.classList.contains("is-in")) revealObserver.observe(el);
    });
  }

  /* ======================================================================
     MARQUEE  —  duplicated once so the -50% loop is seamless
     ====================================================================== */

  function initMarquee() {
    var track = $("[data-marquee]");
    if (!track) return;

    var names = window.MARQUEE || [];
    if (!names.length) { track.closest(".marquee").remove(); return; }

    var run = names.map(function (n) {
      return '<span class="marquee__item">' + esc(n) + "</span>";
    }).join("");

    track.innerHTML = run + run;
    track.setAttribute("aria-hidden", "true");
  }

  /* ======================================================================
     GRID  —  render tiles, then lay out as masonry
     ====================================================================== */

  function tileHTML(photo, i) {
    var ratio = (photo.w || 3) + " / " + (photo.h || 2);
    var label = photo.title || "Photograph";
    var meta = photo.event || "";

    return (
      '<article class="tile" data-reveal style="--i:' + (i % 8) + '">' +
        '<button class="tile__btn" type="button" data-index="' + i + '" ' +
                'aria-label="Open ' + esc(label) + ' full screen">' +
          '<span class="tile__media" style="aspect-ratio:' + ratio + '">' +
            placeholderHTML(photo.src) +
            '<img src="' + esc(photo.src) + '" alt="' + esc(label) + '" ' +
                 'loading="lazy" decoding="async" ' +
                 'width="' + (photo.w || 3000) + '" height="' + (photo.h || 2000) + '">' +
          "</span>" +
          '<span class="tile__cap">' +
            '<span class="tile__cap-text">' +
              '<span class="tile__title">' + esc(label) + "</span>" +
              (meta ? '<span class="tile__meta">' + esc(meta) + "</span>" : "") +
            "</span>" +
            '<span class="index-num">' + pad(i + 1) + "</span>" +
          "</span>" +
        "</button>" +
      "</article>"
    );
  }

  /* Masonry.
     The grid uses 1px rows and no row-gap, so a tile's span is simply its
     content height plus the gap we want underneath it. Reading order stays
     left-to-right, which CSS `columns` cannot do, and the spacing is exact
     rather than rounded up to a row boundary. */
  function layout(grid) {
    var gap = parseFloat(getComputedStyle(grid).columnGap) || 0;

    $$(".tile", grid).forEach(function (tile) {
      var inner = tile.firstElementChild;
      if (!inner) return;
      var h = inner.getBoundingClientRect().height;
      if (!h) return;
      tile.style.gridRowEnd = "span " + Math.ceil(h + gap);
    });
  }

  var grids = [];

  function renderGrid(grid, list) {
    grid.innerHTML = list.map(tileHTML).join("");
    grid.__photos = list;

    $$(".tile__media", grid).forEach(bindMedia);

    /* Clicking a tile opens the lightbox against THIS grid's current list,
       so filtering and the arrow keys stay in sync. */
    $$(".tile__btn", grid).forEach(function (btn) {
      btn.addEventListener("click", function () {
        openLightbox(grid.__photos, parseInt(btn.dataset.index, 10), btn);
      });
    });

    layout(grid);
    observeReveals(grid);
  }

  function initGrids() {
    grids = $$("[data-grid]");
    if (!grids.length) return;

    grids.forEach(function (grid) {
      var list = selectPhotos(grid.dataset.grid, grid.dataset.limit);
      renderGrid(grid, list);
    });

    /* Re-run layout whenever the column width changes. */
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () {
        grids.forEach(layout);
      });
      grids.forEach(function (g) { ro.observe(g); });
    } else {
      window.addEventListener("resize", function () { grids.forEach(layout); });
    }

    /* Webfonts can shift caption metrics; relayout once they're in. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { grids.forEach(layout); });
    }

    window.addEventListener("load", function () { grids.forEach(layout); });
  }

  /* data-grid="festivals" | "featured" | "portraits" | ... | "all" */
  function selectPhotos(key, limit) {
    var list;
    if (key === "featured") {
      list = photos.filter(function (p) { return p.featured; });
    } else if (!key || key === "all") {
      list = photos.slice();
    } else {
      list = photos.filter(function (p) { return p.category === key; });
    }
    if (limit) list = list.slice(0, parseInt(limit, 10));
    return list;
  }

  /* ======================================================================
     FILTERS
     ====================================================================== */

  function initFilters() {
    $$("[data-filters]").forEach(function (bar) {
      var grid = $("#" + bar.dataset.filters);
      if (!grid) return;

      var base = selectPhotos(grid.dataset.grid, grid.dataset.limit);
      var field = bar.dataset.filterField || "event";

      /* Build the chips from whatever's actually in photos.js — add a new
         festival there and its chip appears here automatically. */
      var values = [];
      base.forEach(function (p) {
        var v = p[field];
        if (v && values.indexOf(v) === -1) values.push(v);
      });

      var countEl = bar.querySelector(".filters__count");

      var chips = ['<button class="chip" type="button" aria-pressed="true" data-value="">All</button>']
        .concat(values.map(function (v) {
          return '<button class="chip" type="button" aria-pressed="false" data-value="' +
                 esc(v) + '">' + esc(v) + "</button>";
        }));

      bar.insertAdjacentHTML("afterbegin", chips.join(""));

      function setCount(n) {
        if (countEl) countEl.textContent = n + (n === 1 ? " frame" : " frames");
      }
      setCount(base.length);

      bar.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;

        $$(".chip", bar).forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });

        var val = chip.dataset.value;
        var next = val
          ? base.filter(function (p) { return p[field] === val; })
          : base;

        renderGrid(grid, next);
        setCount(next.length);
      });
    });
  }

  /* ======================================================================
     LIGHTBOX
     ====================================================================== */

  var lb = {
    root: null, img: null, ph: null, title: null, meta: null, count: null,
    list: [], index: 0, opener: null
  };

  function buildLightbox() {
    if (lb.root) return;

    var el = document.createElement("div");
    el.className = "lb";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Photo viewer");
    el.innerHTML =
      '<div class="lb__bar">' +
        '<span class="lb__count"></span>' +
        '<button class="lb__close" type="button" aria-label="Close viewer">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
        "</button>" +
      "</div>" +
      '<div class="lb__stage">' +
        '<button class="lb__nav lb__nav--prev" type="button" aria-label="Previous photo">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
        "</button>" +
        '<img class="lb__img" alt="">' +
        '<button class="lb__nav lb__nav--next" type="button" aria-label="Next photo">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
        "</button>" +
      "</div>" +
      '<div class="lb__meta"><h2></h2><p></p></div>';

    document.body.appendChild(el);

    lb.root  = el;
    lb.img   = $(".lb__img", el);
    lb.title = $(".lb__meta h2", el);
    lb.meta  = $(".lb__meta p", el);
    lb.count = $(".lb__count", el);

    $(".lb__close", el).addEventListener("click", closeLightbox);
    $(".lb__nav--prev", el).addEventListener("click", function () { step(-1); });
    $(".lb__nav--next", el).addEventListener("click", function () { step(1); });

    /* Click the backdrop (but not the image or a control) to close */
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.classList.contains("lb__stage")) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!el.classList.contains("is-open")) return;
      if (e.key === "Escape")     { closeLightbox(); }
      if (e.key === "ArrowLeft")  { step(-1); }
      if (e.key === "ArrowRight") { step(1); }
      if (e.key === "Tab")        { trapTab(e); }
    });

    /* Swipe on touch */
    var startX = 0, startY = 0;
    el.addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
    }, { passive: true });

    el.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* Keep focus inside the dialog while it's open */
  function trapTab(e) {
    var focusable = $$("button", lb.root).filter(function (b) {
      return b.offsetParent !== null;
    });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function openLightbox(list, index, opener) {
    buildLightbox();
    lb.list = list;
    lb.opener = opener || null;
    document.body.classList.add("lightbox-open");
    lb.root.classList.add("is-open");
    show(index);
    $(".lb__close", lb.root).focus();
  }

  function closeLightbox() {
    if (!lb.root) return;
    lb.root.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    if (lb.opener) { lb.opener.focus(); lb.opener = null; }
  }

  function step(dir) {
    if (!lb.list.length) return;
    show((lb.index + dir + lb.list.length) % lb.list.length);
  }

  function show(i) {
    var photo = lb.list[i];
    if (!photo) return;
    lb.index = i;

    /* Drop any placeholder from the previous frame */
    var stale = $(".lb__stage .ph", lb.root);
    if (stale) stale.remove();

    lb.img.classList.remove("is-ready");
    lb.img.style.display = "";
    lb.img.alt = photo.title || "";

    lb.img.onload = function () { lb.img.classList.add("is-ready"); };
    lb.img.onerror = function () {
      /* No file yet — show the same placeholder treatment as the grid */
      lb.img.style.display = "none";
      lb.img.insertAdjacentHTML("beforebegin", placeholderHTML(photo.src));
    };
    lb.img.src = photo.src;

    lb.title.textContent = photo.title || "";
    lb.meta.textContent = photo.event || labelFor(photo.category);
    lb.count.textContent = pad(i + 1) + " / " + pad(lb.list.length);

    /* Warm the neighbours so arrowing through feels instant */
    [lb.list[i + 1], lb.list[i - 1]].forEach(function (p) {
      if (p) { var pre = new Image(); pre.src = p.src; }
    });
  }

  function labelFor(cat) {
    return ({
      festivals: "Festivals", clubs: "Clubs", portraits: "Portraits",
      weddings: "Weddings",  food: "Food"
    })[cat] || "";
  }

  /* ======================================================================
     CATEGORY CARDS  —  cover image pulled from the first photo in each set
     ====================================================================== */

  function initCards() {
    $$("[data-card-media]").forEach(function (holder) {
      var cat = holder.dataset.cardMedia;
      var first = photos.filter(function (p) { return p.category === cat; })[0];
      var src = first ? first.src : "assets/img/" + cat + "/cover.jpg";

      holder.innerHTML =
        placeholderHTML(src) +
        '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async">';

      bindMedia(holder);
    });
  }

  /* ======================================================================
     ODDS AND ENDS
     ====================================================================== */

  function initYear() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ====================================================================== */

  function init() {
    initNav();
    initHero();
    initMarquee();

    /* Before the grids: renderGrid() hands its new tiles to the reveal
       observer, so the observer has to exist first or the tiles snap in
       with no animation. */
    initReveal();

    initGrids();
    initFilters();
    initCards();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
