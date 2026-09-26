/* Bombay Soda — interactions, bottles, fizz and the intro */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.remove("no-js");

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }

  /* ---------- Seeded random ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Flavours ---------- */
  var PALETTES = {
    classic: ["#7ac943", "#f7c21b", "#f39a1e", "#2b2a6b", "#e8231a", "#ef5a24"],
    water: ["#ffffff", "#bfe3f7", "#2fa8e0", "#8fd0f0"]
  };

  // Flavours from the Bombay Cold-Drinks (BCD) menu. Each gets its own colours and particle effect (fx, optional fx2).
  var FLAVOURS = [
    {
      id: "kashmiri", name: "Kashmiri Soda", hi: "कश्मीरी सोडा", short: "KASHMIRI", kind: "Masala soda",
      tag: "Our best masala soda. Our secret masala and fresh lemon, blended just right. The name says Kashmir, the taste is pure Bombay.",
      notes: ["Secret masala", "Fresh lemon", "Extra fizz"], comes: "masala and lemon",
      pair: "The heaviest meals of the week",
      meters: { fizz: 88, sweet: 25, masala: 96 },
      colors: ["#c9a227", "#e0b43a", "#8c6d1f", "#e85d2e", "#b8452a", "#7ac943"],
      accent: "#d4a72c", accent2: "#b8452a", bg: "#fbf3dc", tone: "#8a6412", fx: "masala"
    },
    {
      id: "nimbu", name: "Nimbu Soda", hi: "नींबू सोडा", short: "NIMBU", kind: "Lemon soda",
      tag: "The zing of green lemon and a pinch of salt in sparkling bubbles. It swaps that tired, hot-day feeling for pure refreshment.",
      notes: ["Green lemon", "Salt", "Sparkling soda"], comes: "lemon and salt",
      pair: "Hot afternoons and street food",
      meters: { fizz: 95, sweet: 20, masala: 20 },
      colors: ["#5fa829", "#7ac943", "#b7d445", "#2f7d3b", "#d6f06f", "#9cc95a"],
      accent: "#6fbf2f", accent2: "#2f7d3b", bg: "#eef8df", tone: "#3f7d18", fx: "lime"
    },
    {
      id: "freshlime", name: "Freshlime Soda", hi: "फ्रेश लाइम सोडा", short: "FRESH LIME", kind: "Lemon soda",
      tag: "Made with yellow lemon, the sweet counterpart of Nimbu Soda. Light, sweet and lemony.",
      notes: ["Yellow lemon", "Light sweetness", "Sparkling soda"], comes: "lemon and salt",
      pair: "Any time of the day",
      meters: { fizz: 90, sweet: 62, masala: 10 },
      colors: ["#f4d23c", "#f7c21b", "#e9e36a", "#ffe066", "#b7d445", "#e8b530"],
      accent: "#ecc92a", accent2: "#b7d445", bg: "#fcf8dc", tone: "#8a7300", fx: "slice"
    },
    {
      id: "pudina", name: "Pudina Masala Soda", hi: "पुदीना मसाला सोडा", short: "PUDINA MASALA", kind: "Masala soda",
      tag: "The newest addition to the family. Fresh pudina (mint) and masala make a cool, refreshing fizz.",
      notes: ["Pudina (mint)", "Masala", "Lemon"], comes: "masala and lemon",
      pair: "Kebabs, tandoori and anything off the grill",
      meters: { fizz: 88, sweet: 25, masala: 72 },
      colors: ["#2e8b57", "#58b77a", "#9ed9a8", "#1f6b3a", "#3fae6a", "#7ac943"],
      accent: "#3fbf74", accent2: "#1f6b3a", bg: "#e7f6ea", tone: "#1a6b35", fx: "leaf", fx2: "masala"
    },
    {
      id: "aawlazeera", name: "Aawla Zeera Soda", hi: "आंवला जीरा सोडा", short: "AAWLA ZEERA", kind: "Masala soda",
      tag: "A sweet masala soda made with Indian spices, with the taste of aawla (amla) and zeera (cumin), finished with lemon.",
      notes: ["Aawla (amla)", "Zeera (cumin)", "Indian spices"], comes: "masala and lemon",
      pair: "After a big family lunch",
      meters: { fizz: 80, sweet: 58, masala: 78 },
      colors: ["#9cc24a", "#c8dc7a", "#7a4a21", "#a8692c", "#d9a441", "#5c6b2e"],
      accent: "#a3c247", accent2: "#a8692c", bg: "#f3f5df", tone: "#5d6a17", fx: "amla", fx2: "seed"
    },
    {
      id: "orange", name: "Orange Soda", hi: "ऑरेंज सोडा", short: "ORANGE", kind: "Sweet soda",
      tag: "The freshness and goodness of orange in every bubble. Served chilled, it's a taste you won't forget.",
      notes: ["Orange", "Sweet", "Chilled"], comes: "nothing but ice-cold fizz",
      pair: "Parties, kids and sunny days",
      meters: { fizz: 90, sweet: 82, masala: 5 },
      colors: ["#f08a24", "#ffb35c", "#e8601c", "#ffd08a", "#f7c21b", "#d9480f"],
      accent: "#f28c28", accent2: "#e8601c", bg: "#fff0e0", tone: "#b8500e", fx: "orange"
    },
    {
      id: "orangemasala", name: "Orange Masala Soda", hi: "ऑरेंज मसाला सोडा", short: "ORANGE MASALA", kind: "Masala soda",
      tag: "For people who love orange but won't give up their masala. Orange, lemon and masala in one bottle.",
      notes: ["Orange", "Masala", "Lemon"], comes: "masala and lemon",
      pair: "Samosas, pakoras and chaat",
      meters: { fizz: 88, sweet: 55, masala: 72 },
      colors: ["#f08a24", "#ffb35c", "#e8601c", "#8c3b1f", "#f7c21b", "#b8452a"],
      accent: "#ef7d22", accent2: "#b8452a", bg: "#fdeedd", tone: "#a8430e", fx: "orange", fx2: "masala"
    },
    {
      id: "roohafza", name: "Roohafza Soda", hi: "रूह अफ़ज़ा सोडा", short: "ROOHAFZA", kind: "Sweet soda",
      tag: "The sweet taste of roohafza with soda bubbles. We tuned the flavour so it's one you'll want again and again.",
      notes: ["Roohafza", "Rose", "Sweet"], comes: "nothing but ice-cold fizz",
      pair: "Festive tables and summer evenings",
      meters: { fizz: 82, sweet: 88, masala: 5 },
      colors: ["#e8231a", "#c2185b", "#ff5c5c", "#b0121b", "#f48fb1", "#ff8a80"],
      accent: "#e53935", accent2: "#b0121b", bg: "#fdeaea", tone: "#a3121b", fx: "petal"
    },
    {
      id: "roohafzalemon", name: "Roohafza Lemon Soda", hi: "रूह अफ़ज़ा लेमन सोडा", short: "ROOHAFZA LEMON", kind: "Sweet soda",
      tag: "Roohafza Soda with added lemon, for a light, salty, lemony twist.",
      notes: ["Roohafza", "Lemon", "Pinch of salt"], comes: "nothing but ice-cold fizz",
      pair: "Warm afternoons",
      meters: { fizz: 85, sweet: 66, masala: 15 },
      colors: ["#e8231a", "#ff5c5c", "#f7c21b", "#b0121b", "#f4d23c", "#ff8a80"],
      accent: "#e8433a", accent2: "#f2b01e", bg: "#fdeee6", tone: "#a3121b", fx: "petal", fx2: "slice"
    },
    {
      id: "icecream", name: "Icecream Soda", hi: "आइसक्रीम सोडा", short: "ICE CREAM", kind: "Sweet soda",
      tag: "Not real ice cream, but the taste of it: creamy vanilla flavour inside blissful bubbles.",
      notes: ["Vanilla", "Creamy", "Sweet"], comes: "nothing but ice-cold fizz",
      pair: "Desserts, and every kid's favourite",
      meters: { fizz: 85, sweet: 92, masala: 5 },
      colors: ["#f2c98a", "#f7a8c4", "#8fd0f0", "#e8b56e", "#b5e0b0", "#d98fb0"],
      accent: "#f0b35e", accent2: "#8fd0f0", bg: "#eef6fb", tone: "#9a5f14", fx: "scoop"
    },
    {
      id: "icecreammasala", name: "Icecream Masala Soda", hi: "आइसक्रीम मसाला सोडा", short: "ICE CREAM MASALA", kind: "Masala soda",
      tag: "For those who don't settle for sweet. Vanilla ice cream soda with lemon and masala.",
      notes: ["Vanilla", "Lemon", "Masala"], comes: "masala and lemon",
      pair: "Late-night snacks",
      meters: { fizz: 85, sweet: 60, masala: 66 },
      colors: ["#f2c98a", "#e8b56e", "#d9a441", "#8fd0f0", "#b8452a", "#f7a8c4"],
      accent: "#e3a24e", accent2: "#b8452a", bg: "#f7f1e6", tone: "#8a5214", fx: "scoop", fx2: "masala"
    }
  ];

  /* ---------- Bottle SVGs ---------- */
  var uid = 0;
  // PET bottle: green cap, short neck, sloped shoulders, slight waist, straight body
  var SODA_BODY = "M48 56 H92 V64 C92 78 122 96 122 140 C122 172 120 190 117 204 C114 218 115 234 122 250 V330 Q122 346 106 346 H34 Q18 346 18 330 V250 C25 234 26 218 23 204 C20 190 18 172 18 140 C18 96 48 78 48 64 Z";
  var CAP = "#5fbf2a", CAP_RING = "#3f9422";

  function sodaBottle(o) {
    o = o || {};
    var id = "sb" + (++uid);
    var r = rng(o.seed || 7);
    var pal = o.palette || PALETTES.classic;
    var dots = [];
    var sizes = [12, 10, 8, 6.5, 5, 4, 3, 2.2], counts = [8, 12, 16, 22, 30, 38, 46, 56];
    sizes.forEach(function (base, si) {
      for (var k = 0, t = 0; k < counts[si] && t < counts[si] * 14; t++) {
        var rad = base * (0.85 + r() * 0.3), x = 8 + r() * 124, y = 58 + r() * 292, ok = true;
        for (var q = 0; q < dots.length; q++) {
          var d = dots[q], dx = d.x - x, dy = d.y - y, m = d.r + rad + 1.8;
          if (dx * dx + dy * dy < m * m) { ok = false; break; }
        }
        if (ok) { dots.push({ x: x, y: y, r: rad }); k++; }
      }
    });
    var dotSvg = dots.map(function (d) {
      var band = (d.x * 0.5 + d.y * 0.9 + r() * 80) / (124 * 0.5 + 350 * 0.9 + 80);
      var c = pal[Math.min(pal.length - 1, Math.floor(band * pal.length))];
      return '<circle cx="' + d.x.toFixed(1) + '" cy="' + d.y.toFixed(1) + '" r="' + d.r.toFixed(1) + '" fill="' + c + '"/>';
    }).join("");
    var bubs = "";
    var nb = o.bubbles == null ? 12 : o.bubbles;
    for (var i = 0; i < nb; i++) {
      var br = 1.6 + r() * 3.2;
      bubs += '<circle class="bottle__bub" cx="' + (30 + r() * 80).toFixed(1) + '" cy="' + (250 + r() * 90).toFixed(1) + '" r="' + br.toFixed(1) +
        '" fill="' + pal[Math.floor(r() * pal.length)] + '" style="--d:-' + (r() * 5).toFixed(2) + "s;--t:" + (3 + r() * 3).toFixed(2) + 's"/>';
    }
    var label = "";
    if (o.label) {
      label =
        '<g clip-path="url(#' + id + 'c)">' +
        '<rect x="0" y="206" width="140" height="44" fill="#1d5e2f"/>' +
        '<rect x="0" y="206" width="140" height="3" fill="#b8e22f"/><rect x="0" y="247" width="140" height="3" fill="#b8e22f"/>' +
        '<text x="70" y="226" text-anchor="middle" font-family="Unbounded, Arial Black, sans-serif" font-weight="800" font-size="13" fill="#fff" textLength="62" lengthAdjust="spacingAndGlyphs">BOMBAY SODA</text>' +
        '<text x="70" y="240" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="7" letter-spacing="1.2" fill="#d6f06f">' + o.label + "</text>" +
        "</g>";
    }
    var straw = "";
    if (o.straw) {
      var sr = rng(5), sd = "";
      for (var k2 = 0; k2 < 11; k2++) {
        var ty = 16 - k2 * 6.6, tx = 66 - k2 * 0.9 + (sr() - 0.5) * 3;
        sd += '<circle cx="' + tx.toFixed(1) + '" cy="' + ty.toFixed(1) + '" r="' + (1.4 + sr() * 1.6).toFixed(1) + '" fill="' + pal[Math.floor(sr() * pal.length)] + '"/>';
      }
      straw = '<path d="M67 30 L57 -56" stroke="#d9dde0" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="M67 30 L57 -56" stroke="#fff" stroke-width="8" stroke-linecap="round"/>' + sd;
    }
    return (
      '<svg viewBox="' + (o.straw ? "0 -62 140 422" : "0 0 140 360") + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.alt || "Bombay Soda bottle") + '">' +
      "<defs>" +
      '<clipPath id="' + id + 'c"><path d="' + SODA_BODY + '"/></clipPath>' +
      '<linearGradient id="' + id + 's" x1="0" x2="1">' +
      '<stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".14" stop-color="#fff" stop-opacity=".55"/>' +
      '<stop offset=".28" stop-color="#fff" stop-opacity=".05"/><stop offset=".74" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      "</defs>" +
      '<ellipse cx="70" cy="350" rx="46" ry="6" fill="#102a1b" opacity=".16"/>' +
      straw +
      '<g clip-path="url(#' + id + 'c)"><rect x="0" y="0" width="140" height="360" fill="#fff"/>' + dotSvg + bubs + "</g>" +
      label +
      '<path d="' + SODA_BODY + '" fill="url(#' + id + 's)"/>' +
      '<path d="M28 150 C24 180 26 196 30 206 M30 252 C27 280 27 305 28 322" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M58 72 C80 82 104 100 112 128" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>' +
      '<path d="M22 204 C60 212 80 212 118 204" fill="none" stroke="#102a1b" stroke-opacity=".1" stroke-width="1.5"/>' +
      '<path d="M22 250 C60 242 80 242 118 250" fill="none" stroke="#102a1b" stroke-opacity=".1" stroke-width="1.5"/>' +
      '<path d="' + SODA_BODY + '" fill="none" stroke="#102a1b" stroke-opacity=".2" stroke-width="1.4"/>' +
      '<rect x="41" y="47" width="58" height="9" rx="3" fill="' + CAP_RING + '"/>' +
      '<g class="bottle__cap">' +
      '<rect x="43" y="13" width="54" height="37" rx="7" fill="' + CAP + '"/>' +
      '<g stroke="' + CAP_RING + '" stroke-opacity=".7" stroke-width="2">' +
      [50, 56, 62, 68, 74, 80, 86, 91].map(function (x) { return '<line x1="' + x + '" y1="21" x2="' + x + '" y2="45"/>'; }).join("") + "</g>" +
      '<rect x="43" y="13" width="54" height="7" rx="3.5" fill="#fff" opacity=".35"/>' +
      '<rect x="47" y="22" width="5" height="22" rx="2.5" fill="#fff" opacity=".25"/>' +
      "</g>" +
      "</svg>"
    );
  }

  var WATER_BODY = "M48 38 H72 V54 C72 72 100 78 100 102 V316 Q100 334 82 334 H38 Q20 334 20 316 V102 C20 78 48 72 48 54 Z";
  function waterBottle(o) {
    o = o || {};
    var id = "wb" + (++uid);
    var ribs = "";
    for (var y = 112; y < 322; y += 15) {
      ribs += '<path d="M21 ' + y + " Q60 " + (y + 5) + " 99 " + y + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>';
      ribs += '<path d="M21 ' + (y + 3) + " Q60 " + (y + 8) + " 99 " + (y + 3) + '" fill="none" stroke="#1b3f93" stroke-opacity=".08" stroke-width="1.5"/>';
    }
    var r = rng(o.seed || 3), drops = "";
    for (var k = 0; k < 16; k++) {
      drops += '<ellipse cx="' + (26 + r() * 68).toFixed(1) + '" cy="' + (96 + r() * 230).toFixed(1) + '" rx="' + (0.8 + r() * 1.6).toFixed(1) + '" ry="' + (1.2 + r() * 2).toFixed(1) + '" fill="#fff" opacity=".8"/>';
    }
    return (
      '<svg class="' + (o.cls || "") + '" viewBox="0 0 120 344" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.alt || "B-Spring drinking water bottle") + '">' +
      "<defs>" +
      '<clipPath id="' + id + 'c"><path d="' + WATER_BODY + '"/></clipPath>' +
      '<linearGradient id="' + id + 'g" x1="0" x2="1">' +
      '<stop offset="0" stop-color="#9fd3f2" stop-opacity=".75"/><stop offset=".22" stop-color="#fff" stop-opacity=".85"/>' +
      '<stop offset=".5" stop-color="#d9eefa" stop-opacity=".55"/><stop offset=".85" stop-color="#8cc8ec" stop-opacity=".7"/>' +
      '<stop offset="1" stop-color="#5aa9dc" stop-opacity=".85"/></linearGradient>' +
      '<linearGradient id="' + id + 'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc2ee" stop-opacity=".25"/><stop offset="1" stop-color="#2f8fd0" stop-opacity=".35"/></linearGradient>' +
      "</defs>" +
      '<ellipse cx="60" cy="338" rx="38" ry="5" fill="#0b2a6b" opacity=".18"/>' +
      '<path d="' + WATER_BODY + '" fill="url(#' + id + 'g)"/>' +
      '<g clip-path="url(#' + id + 'c)"><rect x="0" y="74" width="120" height="270" fill="url(#' + id + 'w)"/>' + ribs + drops +
      '<rect x="32" y="118" width="56" height="186" fill="#fff"/>' +
      '<rect x="32" y="118" width="56" height="16" fill="#1b3f93"/>' +
      '<text x="60" y="129" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="6" letter-spacing=".6" fill="#fff">PREMIUM WATER</text>' +
      '<text transform="translate(68 246) rotate(-90)" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="23" textLength="104" lengthAdjust="spacingAndGlyphs" fill="#1b3f93">B SPRING</text>' +
      '<rect x="32" y="252" width="56" height="52" fill="#1b3f93"/>' +
      '<text x="60" y="266" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="6.4" letter-spacing=".5" fill="#fff">MADE IN INDIA</text>' +
      '<g fill="#fff" opacity=".55"><rect x="38" y="272" width="44" height="2" rx="1"/><rect x="38" y="277" width="38" height="2" rx="1"/><rect x="38" y="282" width="42" height="2" rx="1"/><rect x="38" y="291" width="20" height="6" rx="1"/></g>' +
      '<rect x="32" y="118" width="56" height="186" fill="url(#' + id + 'g)" opacity=".35"/>' +
      "</g>" +
      '<rect x="27" y="112" width="5" height="190" rx="2.5" fill="#fff" opacity=".6"/>' +
      '<path d="' + WATER_BODY + '" fill="none" stroke="#1b3f93" stroke-opacity=".28" stroke-width="1.2"/>' +
      '<rect x="45" y="34" width="30" height="6" rx="2" fill="#e6eef5"/>' +
      '<rect x="43" y="10" width="34" height="26" rx="5" fill="#fff" stroke="#c9d6e2" stroke-width="1"/>' +
      '<g stroke="#b7c6d4" stroke-width="1.2">' + [48, 52, 56, 60, 64, 68, 72].map(function (x) { return '<line x1="' + x + '" y1="15" x2="' + x + '" y2="33"/>'; }).join("") + "</g>" +
      "</svg>"
    );
  }

  function renderBottles() {
    $$("[data-bottle]").forEach(function (el) {
      var kind = el.getAttribute("data-bottle");
      if (kind === "water") {
        el.innerHTML = waterBottle({ seed: +el.getAttribute("data-seed") || 3, cls: el.getAttribute("data-class") || "" });
        if (el.firstChild && el.getAttribute("data-class")) el.firstChild.setAttribute("class", el.getAttribute("data-class"));
        return;
      }
      var f = FLAVOURS.filter(function (x) { return x.id === kind; })[0] || FLAVOURS[0];
      el.innerHTML = sodaBottle({
        palette: kind === "logo" ? PALETTES.classic : f.colors,
        
        seed: +el.getAttribute("data-seed") || 7,
        label: el.hasAttribute("data-label") ? (kind === "logo" ? "SINCE 1979" : f.short) : null,
        bubbles: el.hasAttribute("data-bubbles") ? +el.getAttribute("data-bubbles") : 12,
        straw: el.hasAttribute("data-straw"),
        alt: "Bombay Soda " + (kind === "logo" ? "" : f.name) + " bottle"
      });
    });
  }

  // Canvas animations pause while the tab is hidden; restart them when it comes back.
  var ANIMATORS = [];
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) ANIMATORS.forEach(function (a) { if (a.visible) a.start(); });
  });

  /* ---------- Fizz background ---------- */
  function Fizz(canvas, opts) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.o = Object.assign({ colors: PALETTES.classic, density: 1, speed: 1, minR: 2, maxR: 20, glow: false, max: 90 }, opts || {});
    this.b = [];
    this.px = -9999; this.py = -9999;
    this.visible = true;
    this.t = 0;
    ANIMATORS.push(this);
    var self = this;
    this.resize();
    if ("ResizeObserver" in window) new ResizeObserver(function () { self.resize(); }).observe(canvas);
    else window.addEventListener("resize", function () { self.resize(); });
    var host = canvas.parentElement;
    host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      self.px = e.clientX - r.left; self.py = e.clientY - r.top;
    });
    host.addEventListener("pointerleave", function () { self.px = self.py = -9999; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; if (self.visible) self.start(); }, { rootMargin: "100px" }).observe(canvas);
    }
    if (reduceMotion) { this.draw(); } else { this.start(); }
  }
  Fizz.prototype.resize = function () {
    var r = this.c.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
    this.c.width = this.w * dpr; this.c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.round(Math.min(this.o.max, (this.w * this.h) / 15000 * this.o.density));
    while (this.b.length < target) this.b.push(this.spawn(true));
    this.b.length = target;
    if (reduceMotion) this.draw();
  };
  Fizz.prototype.setColors = function (colors) { this.o.colors = colors; var self = this; this.b.forEach(function (b) { b.col = self.pick(); }); };
  Fizz.prototype.pick = function () { var c = this.o.colors; return c[Math.floor(Math.random() * c.length)]; };
  Fizz.prototype.spawn = function (initial) {
    var o = this.o, k = Math.pow(Math.random(), 2.4);
    var r = o.minR + k * (o.maxR - o.minR);
    return {
      x: Math.random() * this.w, y: initial ? Math.random() * this.h : this.h + r + Math.random() * 60,
      r: r, v: (0.25 + Math.random() * 0.55 + k * 0.5) * o.speed,
      amp: 4 + Math.random() * 18, ph: Math.random() * 6.28, ox: 0, oy: 0,
      col: this.pick(), a: 0.35 + Math.random() * 0.55
    };
  };
  Fizz.prototype.start = function () {
    if (this.running || reduceMotion) return;
    this.running = true;
    var self = this, last = performance.now();
    function loop(now) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      var dt = Math.min(3, (now - last) / 16.67); last = now;
      self.step(dt); self.draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };
  Fizz.prototype.step = function (dt) {
    for (var i = 0; i < this.b.length; i++) {
      var b = this.b[i];
      b.y -= b.v * dt; b.ph += 0.02 * dt;
      var x = b.x + Math.sin(b.ph) * b.amp + b.ox, dx = x - this.px, dy = b.y - this.py;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130 && d > 0.1) { var f = (1 - d / 130) * 2.6 * dt; b.ox += (dx / d) * f; b.oy += (dy / d) * f; }
      b.ox *= 0.965; b.oy *= 0.94; b.y += b.oy * 0.4;
      if (b.y < -b.r - 20) this.b[i] = this.spawn(false);
    }
  };
  Fizz.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = this.o.glow ? "lighter" : "source-over";
    for (var i = 0; i < this.b.length; i++) {
      var b = this.b[i], x = b.x + Math.sin(b.ph) * b.amp + b.ox;
      ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, 6.2832);
      ctx.globalAlpha = b.a * 0.16; ctx.fillStyle = b.col; ctx.fill();
      ctx.globalAlpha = b.a; ctx.lineWidth = Math.max(1, b.r * 0.09); ctx.strokeStyle = b.col; ctx.stroke();
      if (b.r > 4) {
        ctx.beginPath(); ctx.arc(x - b.r * 0.38, b.y - b.r * 0.38, b.r * 0.22, 0, 6.2832);
        ctx.globalAlpha = b.a * 0.75; ctx.fillStyle = "#fff"; ctx.fill();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  };

  function initFizz() {
    $$("canvas[data-fizz]").forEach(function (c) {
      var kind = c.getAttribute("data-fizz");
      var opts = {
        classic: { colors: PALETTES.classic.concat(["#2f9a4c", "#b8e22f", "#1a6b35"]), density: 0.9 },
        soft: { colors: PALETTES.classic.concat(["#2f9a4c", "#b8e22f"]), density: 0.55, maxR: 14 },
        water: { colors: ["#ffffff", "#bfe3f7", "#8fd0f0"], density: 0.8, speed: 0.6, maxR: 12, glow: true },
        waterlight: { colors: ["#2fa8e0", "#1b3f93", "#8fd0f0"], density: 0.55, speed: 0.5, maxR: 12, glow: false },
        white: { colors: ["#ffffff"], density: 0.6, maxR: 16, glow: true }
      }[kind] || {};
      c._fizz = new Fizz(c, opts);
    });
  }

  /* ---------- Flavour particle field ---------- */
  function Field(canvas) {
    this.c = canvas; this.ctx = canvas.getContext("2d");
    this.p = []; this.f = FLAVOURS[0];
    this.px = this.py = -9999; this.visible = true;
    ANIMATORS.push(this);
    var self = this;
    this.resize();
    if ("ResizeObserver" in window) new ResizeObserver(function () { self.resize(); }).observe(canvas);
    canvas.parentElement.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect(); self.px = e.clientX - r.left; self.py = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", function () { self.px = self.py = -9999; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; if (self.visible) self.start(); }).observe(canvas);
  }
  Field.prototype.resize = function () {
    var r = this.c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
    this.c.width = this.w * dpr; this.c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.n = Math.round(Math.min(55, (this.w * this.h) / 22000));
    if (reduceMotion) this.draw();
  };
  Field.prototype.make = function (opt) {
    var z = 0.45 + Math.random() * 0.75;
    var shape = Math.random() < 0.62 ? (this.f.fx2 && Math.random() < 0.4 ? this.f.fx2 : this.f.fx) : "bubble";
    if (this.f.fx === "masala" && shape === "bubble" && Math.random() < 0.4) shape = "spark";
    var base = shape === "bubble" ? 3 + Math.random() * 10 : { spark: 5, seed: 9, slice: 16, lime: 15, orange: 16, berry: 9, leaf: 14, masala: 5, scoop: 11, amla: 9, petal: 10 }[shape] * (0.7 + Math.random() * 0.6);
    var fall = shape === "masala";
    var p = {
      shape: shape, z: z, s: base * z,
      x: Math.random() * this.w, y: opt && opt.initial ? Math.random() * this.h : (fall ? -20 - Math.random() * 40 : this.h + 40),
      vx: 0, vy: 0, rise: fall ? -(0.7 + Math.random() * 1.1) * z : (0.3 + Math.random() * 0.6) * z, fall: fall,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.04,
      ph: Math.random() * 6.28, amp: 0.3 + Math.random() * 0.8,
      a: 0, ta: 0.3 + z * 0.45, die: false,
      col: fall ? MASALA[Math.floor(Math.random() * MASALA.length)] : this.f.colors[Math.floor(Math.random() * this.f.colors.length)]
    };
    if (fall) {
      p.poly = [];
      for (var v = 0; v < 6; v++) p.poly.push([(v / 6) * 6.2832 + Math.random() * 0.6, 0.55 + Math.random() * 0.6]);
      p.ta = 0.55 + z * 0.4; p.amp *= 0.4;
    }
    if (opt && opt.sprinkle) {
      p.x = opt.x + (Math.random() - 0.5) * opt.spread; p.y = -10 - Math.random() * 120;
      p.vy = 2 + Math.random() * 5; p.vx = (Math.random() - 0.5) * 2; p.a = 1;
      return p;
    }
    if (opt && opt.burst) {
      var ang = Math.random() * 6.28, sp = 3 + Math.random() * 11;
      p.x = opt.x; p.y = opt.y; p.vx = Math.cos(ang) * sp; p.vy = Math.sin(ang) * sp; p.a = 1;
      p.vr = (Math.random() - 0.5) * 0.25;
    }
    return p;
  };
  Field.prototype.set = function (f, burst) {
    this.f = f;
    this.p.forEach(function (p) { p.die = true; });
    var i;
    for (i = 0; i < this.n; i++) this.p.push(this.make({ initial: true }));
    if (burst && !reduceMotion) {
      var bx = burst.x, by = burst.y;
      if (f.fx === "masala" || f.fx2 === "masala") {
        var spread = Math.min(this.w, 520);
        for (i = 0; i < 190; i++) { var mp = this.make({ sprinkle: true, x: bx, spread: spread }); if (mp.fall) this.p.push(mp); }
        for (i = 0; i < 24; i++) this.p.push(this.make({ burst: true, x: bx, y: by }));
      } else {
        for (i = 0; i < 46; i++) this.p.push(this.make({ burst: true, x: bx, y: by }));
      }
    }
    if (reduceMotion) { this.p = this.p.filter(function (p) { return !p.die; }); this.p.forEach(function (p) { p.a = p.ta; }); this.draw(); }
    else this.start();
  };
  Field.prototype.start = function () {
    if (this.running || reduceMotion) return;
    this.running = true;
    var self = this, last = performance.now();
    function loop(now) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      var dt = Math.min(3, (now - last) / 16.67); last = now;
      self.step(dt); self.draw(); requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };
  Field.prototype.step = function (dt) {
    var alive = [], live = 0;
    for (var i = 0; i < this.p.length; i++) {
      var p = this.p[i];
      p.vx *= Math.pow(0.95, dt); p.vy *= Math.pow(0.95, dt);
      p.ph += 0.02 * dt;
      var dx = p.x - this.px, dy = p.y - this.py, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140 && d > 0.1) { var f = (1 - d / 140) * 0.9 * dt; p.vx += (dx / d) * f; p.vy += (dy / d) * f; p.vr += (dx > 0 ? 1 : -1) * 0.002 * dt; }
      p.x += (p.vx + Math.sin(p.ph) * p.amp) * dt;
      p.y += (p.vy - p.rise) * dt;
      p.vr *= 0.99; p.rot += (p.vr + 0.004) * dt;
      p.a += ((p.die ? 0 : p.ta) - p.a) * 0.05 * dt;
      if (p.die && p.a < 0.02) continue;
      if (p.y < -60 || (p.fall && p.y > this.h + 40)) { if (p.die) continue; p = this.make(); }
      if (!p.die) live++;
      alive.push(p);
    }
    while (live < this.n) { alive.push(this.make()); live++; }
    this.p = alive;
  };
  Field.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.p.length; i++) {
      var p = this.p[i];
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, Math.min(1, p.a));
      DRAW[p.shape](ctx, p.s, p.col, p);
      ctx.restore();
    }
  };

  var MASALA = ["#8c3b1f", "#b8452a", "#d9a441", "#6b3a1f", "#e85d2e", "#5a2b17", "#c0392b", "#e0b04a"];
  function citrus(c, s, rim, flesh, seg) {
    c.fillStyle = rim; c.beginPath(); c.arc(0, 0, s, 0, 6.2832); c.fill();
    c.fillStyle = flesh; c.beginPath(); c.arc(0, 0, s * 0.88, 0, 6.2832); c.fill();
    c.fillStyle = seg;
    for (var i = 0; i < 9; i++) {
      var a0 = (i / 9) * 6.2832 + 0.07, a1 = ((i + 1) / 9) * 6.2832 - 0.07;
      c.beginPath(); c.moveTo(Math.cos((a0 + a1) / 2) * s * 0.1, Math.sin((a0 + a1) / 2) * s * 0.1);
      c.arc(0, 0, s * 0.78, a0, a1); c.closePath(); c.fill();
    }
    c.fillStyle = flesh; c.beginPath(); c.arc(0, 0, s * 0.1, 0, 6.2832); c.fill();
  }
  var DRAW = {
    masala: function (c, s, col, p) {
      c.fillStyle = col; c.beginPath();
      for (var k = 0; k < p.poly.length; k++) {
        var v = p.poly[k], x = Math.cos(v[0]) * s * v[1] * 1.6, y = Math.sin(v[0]) * s * v[1];
        if (k) c.lineTo(x, y); else c.moveTo(x, y);
      }
      c.closePath(); c.fill();
      c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.arc(-s * 0.3, -s * 0.2, s * 0.25, 0, 6.2832); c.fill();
    },
    bubble: function (c, s, col) {
      c.beginPath(); c.arc(0, 0, s, 0, 6.2832);
      var ga = c.globalAlpha; c.globalAlpha = ga * 0.18; c.fillStyle = col; c.fill(); c.globalAlpha = ga;
      c.lineWidth = Math.max(1, s * 0.12); c.strokeStyle = col; c.stroke();
      c.beginPath(); c.arc(-s * 0.35, -s * 0.35, s * 0.24, 0, 6.2832); c.fillStyle = "rgba(255,255,255,.7)"; c.fill();
    },
    spark: function (c, s, col) {
      var ga = c.globalAlpha; c.globalAlpha = ga * 0.25;
      c.fillStyle = col; c.beginPath(); c.arc(0, 0, s * 2.2, 0, 6.2832); c.fill();
      c.globalAlpha = ga; c.fillStyle = col; c.beginPath();
      c.moveTo(0, -s * 1.6); c.quadraticCurveTo(s * 0.2, -s * 0.2, s * 1.6, 0); c.quadraticCurveTo(s * 0.2, s * 0.2, 0, s * 1.6);
      c.quadraticCurveTo(-s * 0.2, s * 0.2, -s * 1.6, 0); c.quadraticCurveTo(-s * 0.2, -s * 0.2, 0, -s * 1.6); c.fill();
    },
    seed: function (c, s, col) {
      var g = c.createLinearGradient(0, -s * 0.4, 0, s * 0.4);
      g.addColorStop(0, "#d9a45a"); g.addColorStop(1, col);
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, s, s * 0.32, 0, 0, 6.2832); c.fill();
      c.strokeStyle = "rgba(60,30,10,.55)"; c.lineWidth = Math.max(0.6, s * 0.06);
      c.beginPath(); c.moveTo(-s * 0.8, -s * 0.08); c.quadraticCurveTo(0, -s * 0.16, s * 0.8, -s * 0.08); c.stroke();
      c.beginPath(); c.moveTo(-s * 0.8, s * 0.1); c.quadraticCurveTo(0, s * 0.18, s * 0.8, s * 0.1); c.stroke();
      c.beginPath(); c.moveTo(s, 0); c.lineTo(s * 1.35, -s * 0.05); c.stroke();
    },
    slice: function (c, s) { citrus(c, s, "#e9c21f", "#fff6c9", "#f6dc55"); },
    lime: function (c, s) { citrus(c, s, "#4f9a22", "#effad0", "#bfe06a"); },
    orange: function (c, s) { citrus(c, s, "#ee7d1a", "#ffe6c7", "#ffab4a"); },
    scoop: function (c, s, col) {
      c.fillStyle = "#fff6e2"; c.strokeStyle = "rgba(200,150,80,.35)"; c.lineWidth = Math.max(0.8, s * 0.06);
      c.beginPath(); c.arc(0, -s * 0.15, s, Math.PI * 0.9, Math.PI * 0.1);
      for (var k = 0; k <= 6; k++) { var x = s * 0.95 - (k / 6) * s * 1.9; c.lineTo(x, s * 0.35 + (k % 2 ? s * 0.28 : 0)); }
      c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "rgba(255,255,255,.9)"; c.beginPath(); c.arc(-s * 0.35, -s * 0.5, s * 0.22, 0, 6.2832); c.fill();
      var sp = ["#f7a8c4", "#8fd0f0", "#7ac943", "#f7c21b"];
      for (var j = 0; j < 4; j++) { c.save(); c.rotate(j * 1.7); c.fillStyle = sp[j]; c.fillRect(s * 0.15, -s * 0.2 - j * s * 0.12, s * 0.34, s * 0.1); c.restore(); }
    },
    amla: function (c, s) {
      var g = c.createRadialGradient(-s * 0.3, -s * 0.35, s * 0.1, 0, 0, s);
      g.addColorStop(0, "#eef7c4"); g.addColorStop(0.6, "#b9d65e"); g.addColorStop(1, "#86a834");
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, s, 0, 6.2832); c.fill();
      c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = Math.max(0.6, s * 0.06);
      for (var k = -2; k <= 2; k++) { c.beginPath(); c.ellipse(0, 0, Math.abs(k) * s * 0.3 + 0.01, s * 0.96, 0, 0, 6.2832); c.stroke(); }
    },
    petal: function (c, s, col) {
      var g = c.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, "#ffd0d6"); g.addColorStop(1, col);
      c.fillStyle = g; c.beginPath();
      c.moveTo(0, s); c.bezierCurveTo(s * 1.1, s * 0.3, s * 0.8, -s * 0.9, 0, -s * 0.6);
      c.bezierCurveTo(-s * 0.8, -s * 0.9, -s * 1.1, s * 0.3, 0, s); c.fill();
      c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = Math.max(0.6, s * 0.05);
      c.beginPath(); c.moveTo(0, s * 0.8); c.quadraticCurveTo(s * 0.1, 0, 0, -s * 0.4); c.stroke();
    },
    berry: function (c, s, col) {
      var g = c.createRadialGradient(-s * 0.3, -s * 0.4, s * 0.1, 0, 0, s * 1.1);
      g.addColorStop(0, "#9b4fa8"); g.addColorStop(0.5, col); g.addColorStop(1, "#1d0826");
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, s * 0.78, s, 0, 0, 6.2832); c.fill();
      c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.ellipse(-s * 0.28, -s * 0.42, s * 0.14, s * 0.26, -0.4, 0, 6.2832); c.fill();
      c.fillStyle = "#2a0d33"; c.beginPath(); c.arc(0, -s * 0.95, s * 0.14, 0, 6.2832); c.fill();
    },
    leaf: function (c, s, col) {
      var g = c.createLinearGradient(-s * 0.6, -s, s * 0.6, s);
      g.addColorStop(0, "#9ee6ae"); g.addColorStop(1, col);
      c.fillStyle = g; c.beginPath();
      c.moveTo(0, -s); c.bezierCurveTo(s * 0.75, -s * 0.55, s * 0.65, s * 0.55, 0, s);
      c.bezierCurveTo(-s * 0.65, s * 0.55, -s * 0.75, -s * 0.55, 0, -s); c.fill();
      c.strokeStyle = "rgba(230,255,235,.6)"; c.lineWidth = Math.max(0.7, s * 0.06);
      c.beginPath(); c.moveTo(0, -s * 0.9); c.lineTo(0, s * 1.15); c.stroke();
      for (var i = -2; i <= 2; i++) {
        var y = i * s * 0.3;
        c.beginPath(); c.moveTo(0, y); c.lineTo(s * 0.4, y - s * 0.22); c.moveTo(0, y); c.lineTo(-s * 0.4, y - s * 0.22); c.stroke();
      }
    }
  };

  /* ---------- Flavour lab ---------- */
  function initLab() {
    var lab = $("#flavours");
    if (!lab) return;
    var tabs = $("#labTabs"), stage = $("#labBottle"), info = $("#labInfo"), wave = $("#labWave");
    var field = new Field($("#labCanvas"));
    var current = -1, swapTimer;

    tabs.innerHTML = FLAVOURS.map(function (f, i) {
      return '<button class="lab__tab" role="tab" id="tab-' + f.id + '" aria-selected="false" aria-controls="labPanel" tabindex="-1" style="--c:' + f.accent + '" data-i="' + i + '">' +
        "<i></i><span>" + f.name + "<small>" + f.hi + "</small></span></button>";
    }).join("");

    var lineup = $("#lineup");
    if (lineup) {
      lineup.innerHTML = FLAVOURS.map(function (f, i) {
        return '<button type="button" data-i="' + i + '" aria-label="Show ' + f.name + '">' +
          sodaBottle({ palette: f.colors, cap: f.cap, seed: 20 + i, bubbles: 0, alt: f.name }) + "<span>" + f.name + "</span></button>";
      }).join("");
      $$("button", lineup).forEach(function (b) {
        b.addEventListener("click", function () { select(+b.getAttribute("data-i"), true); lab.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); });
      });
    }

    function fill(f, i) {
      $("#labHi").textContent = f.hi;
      $("#labName").textContent = f.name;
      $("#labTag").textContent = f.tag;
      $("#labNotes").innerHTML = f.notes.map(function (n) { return "<span>" + n + "</span>"; }).join("");
      $("#labPair").innerHTML = "<strong>Best with:</strong> " + f.pair;
      $("#labCount").textContent = String(i + 1).padStart(2, "0") + " / " + String(FLAVOURS.length).padStart(2, "0") + " · " + f.kind;
      $("#labServe").innerHTML = "<strong>600 mL bottle, serves two.</strong> Comes with " + f.comes + ".";
      ["fizz", "sweet", "masala"].forEach(function (k) { $("#m-" + k).style.setProperty("--v", Math.max(4, f.meters[k]) + "%"); });
    }

    function select(i, focus) {
      if (i === current) return;
      var f = FLAVOURS[i], first = current === -1;
      current = i;
      $$(".lab__tab", tabs).forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus({ preventScroll: true });
        if (on && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: t.offsetLeft - 20, behavior: "smooth" });
      });
      lab.style.setProperty("--accent", f.accent);
      lab.style.setProperty("--accent-2", f.accent2);
      lab.style.setProperty("--bg", f.bg);
      lab.style.setProperty("--tone", f.tone);
      $("#labPanel").setAttribute("aria-labelledby", "tab-" + f.id);

      var html = sodaBottle({ palette: f.colors, cap: f.cap, seed: 11 + i * 7, label: f.short, bubbles: 14, alt: "Bombay Soda " + f.name + " bottle" });
      var burstAt = function () {
        var sr = stage.getBoundingClientRect(), cr = $("#labCanvas").getBoundingClientRect();
        return { x: sr.left - cr.left + sr.width / 2, y: sr.top - cr.top + sr.height * 0.35 };
      };
      clearTimeout(swapTimer);
      if (first || reduceMotion) {
        stage.innerHTML = html; fill(f, i); field.set(f, reduceMotion ? null : burstAt());
        return;
      }
      stage.classList.remove("is-enter"); stage.classList.add("is-leave");
      info.classList.add("is-swap");
      wave.classList.remove("is-go"); void wave.offsetWidth; wave.classList.add("is-go");
      swapTimer = setTimeout(function () {
        stage.innerHTML = html;
        stage.classList.remove("is-leave"); void stage.offsetWidth; stage.classList.add("is-enter");
        fill(f, i); info.classList.remove("is-swap");
        field.set(f, burstAt());
      }, 380);
    }

    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".lab__tab"); if (b) select(+b.getAttribute("data-i"), false);
    });
    tabs.addEventListener("keydown", function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      else if (e.key === "End") { e.preventDefault(); select(FLAVOURS.length - 1, true); }
      else if (d) { e.preventDefault(); select((current + d + FLAVOURS.length) % FLAVOURS.length, true); }
    });
    $("#labPrev") && $("#labPrev").addEventListener("click", function () { select((current - 1 + FLAVOURS.length) % FLAVOURS.length); });
    $("#labNext") && $("#labNext").addEventListener("click", function () { select((current + 1) % FLAVOURS.length); });

    var start = 0, hash = (location.hash || "").replace("#", "");
    FLAVOURS.forEach(function (f, i) { if (f.id === hash) start = i; });
    select(start);
  }

  /* ---------- Intro ---------- */
  function initIntro() {
    var intro = $("#intro");
    if (!intro) return;
    if (doc.classList.contains("no-intro")) { intro.remove(); return; }
    document.body.classList.add("intro-lock");
    var canvas = $(".intro__burst", intro), ctx = canvas.getContext("2d");
    var done = false, timers = [];
    var dpr = Math.min(2, window.devicePixelRatio || 1), W, H;
    function size() { W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener("resize", size);

    var parts = [], rings = [], emitting = false, emitEnd = 0, origin = { x: W / 2, y: H / 2 }, raf;
    var cols = PALETTES.classic.concat(["#f6c445", "#b8e22f", "#2f9a4c", "#1a6b35"]);
    function emit(n, strong) {
      for (var i = 0; i < n; i++) {
        var k = Math.pow(Math.random(), 1.8);
        var ang = -Math.PI / 2 + (Math.random() - 0.5) * (strong ? 2.2 : 1.1);
        var sp = (strong ? 8 : 6) + Math.random() * (strong ? 16 : 12);
        parts.push({
          x: origin.x + (Math.random() - 0.5) * 10, y: origin.y,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          r: 2.5 + k * 15, a: 1, d: 0.005 + Math.random() * 0.008,
          c: cols[Math.floor(Math.random() * cols.length)], ph: Math.random() * 6.28,
          fill: Math.random() < 0.3, drop: Math.random() < 0.18
        });
      }
    }
    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      if (emitting && now < emitEnd) emit(4); else emitting = false;
      ctx.globalCompositeOperation = "source-over";
      rings = rings.filter(function (r) {
        r.r += (r.max - r.r) * 0.08; r.a *= 0.94;
        ctx.globalAlpha = r.a; ctx.strokeStyle = r.c; ctx.lineWidth = r.w;
        ctx.beginPath(); ctx.arc(origin.x, origin.y, r.r, 0, 6.2832); ctx.stroke();
        return r.a > 0.02;
      });
      parts = parts.filter(function (p) {
        p.vx *= 0.982; p.vy = p.vy * 0.982 + (p.drop ? 0.35 : -0.06); p.ph += 0.08;
        p.x += p.vx + Math.sin(p.ph) * 0.6; p.y += p.vy; p.a -= p.d;
        if (p.a <= 0 || p.y < -40 || p.y > H + 40) return false;
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        if (p.fill) { ctx.fillStyle = p.c; ctx.fill(); }
        else {
          ctx.fillStyle = p.c; ctx.globalAlpha = p.a * 0.18; ctx.fill();
          ctx.globalAlpha = p.a; ctx.lineWidth = Math.max(1, p.r * 0.1); ctx.strokeStyle = p.c; ctx.stroke();
          if (p.r > 5) { ctx.beginPath(); ctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.22, 0, 6.2832); ctx.fillStyle = "#fff"; ctx.globalAlpha = p.a * 0.8; ctx.fill(); }
        }
        return true;
      });
      ctx.globalAlpha = 1;
      if (!done || parts.length) raf = requestAnimationFrame(frame);
    }

    function pop() {
      var bottle = $(".intro__bottle", intro).getBoundingClientRect();
      origin = { x: bottle.left + bottle.width / 2, y: bottle.top + bottle.height * 0.1 };
      intro.classList.add("is-pop");
      rings.push({ r: 4, max: 220, a: 0.8, c: "#1a6b35", w: 2.5 }, { r: 2, max: 360, a: 0.7, c: "#b8e22f", w: 3 });
      emit(70, true); emitting = true; emitEnd = performance.now() + 900;
      raf = requestAnimationFrame(frame);
      if (navigator.vibrate) { try { navigator.vibrate(18); } catch (e) {} }
    }

    function finish() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      intro.classList.add("is-in", "is-logo", "is-out");
      document.dispatchEvent(new Event("intro:out"));
      try { sessionStorage.setItem("bs-intro", "1"); } catch (e) {}
      setTimeout(function () {
        document.body.classList.remove("intro-lock");
        cancelAnimationFrame(raf);
        intro.remove();
        document.dispatchEvent(new Event("intro:done"));
      }, 1050);
    }
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

    at(120, function () { intro.classList.add("is-in"); });
    at(1000, function () { intro.classList.add("is-shake"); });
    at(1600, pop);
    at(2250, function () { intro.classList.add("is-logo"); });
    at(4300, finish);

    $(".intro__skip", intro).addEventListener("click", finish);
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { finish(); document.removeEventListener("keydown", esc); } });
  }

  /* ---------- Nav ---------- */
  function initNav() {
    var nav = $("#nav");
    if (!nav) return;
    function onScroll() { nav.classList.toggle("is-solid", window.scrollY > 24); }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    var toggle = $(".nav__toggle", nav);
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav__links a", nav).forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    var vh = window.innerHeight, first = [];
    els.forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) first.push(e);
      else io.observe(e);
    });
    function showFirst() { setTimeout(function () { first.forEach(function (e) { e.classList.add("is-in"); }); }, 40); }
    if ($("#intro")) document.addEventListener("intro:out", function () { setTimeout(showFirst, 250); }, { once: true });
    else showFirst();
  }

  /* ---------- Parallax tilt on hero visuals ---------- */
  function initTilt() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    $$("[data-tilt]").forEach(function (el) {
      var host = el.closest("section") || el.parentElement;
      host.addEventListener("pointermove", function (e) {
        var r = host.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "translate3d(" + x * 24 + "px," + y * 18 + "px,0) rotate(" + x * 6 + "deg)";
      });
      host.addEventListener("pointerleave", function () { el.style.transform = ""; });
      el.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)";
    });
  }

  /* ---------- Site config ---------- */
  function initConfig() {
    var isPlaceholder = /^9?1?0+$/.test(SITE.whatsapp || "");
    $$("[data-phone]").forEach(function (a) { a.href = "tel:" + SITE.phoneTel; var t = $("[data-text]", a) || a; t.textContent = SITE.phoneDisplay; });
    $$("[data-wa]").forEach(function (a) {
      a.href = "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent("Hello Bombay Soda, I'd like to discuss a business enquiry.");
      a.target = "_blank"; a.rel = "noopener";
      var t = $("[data-text]", a); if (t) t.textContent = SITE.phoneDisplay;
    });
    $$("[data-email]").forEach(function (a) { a.href = "mailto:" + SITE.email; var t = $("[data-text]", a) || a; t.textContent = SITE.email; });
    $$("[data-fill]").forEach(function (el) { var k = el.getAttribute("data-fill"); if (SITE[k]) el.textContent = SITE[k]; });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    (SITE.branches || []).forEach(function (b, i) {
      var card = $('[data-branch="' + i + '"]'); if (!card) return;
      $("[data-b=name]", card).textContent = b.name;
      $("[data-b=city]", card).textContent = b.city;
      $("[data-b=address]", card).textContent = b.address;
      var dir = $("[data-b=maps]", card), call = $("[data-b=phone]", card);
      if (b.maps) { dir.href = b.maps; dir.removeAttribute("aria-disabled"); dir.target = "_blank"; dir.rel = "noopener"; }
      if (b.phone) { call.href = "tel:" + b.phone.replace(/\s/g, ""); call.removeAttribute("aria-disabled"); }
      var badge = $(".badge", card); if (badge && b.maps) badge.textContent = "Open";
    });
    return isPlaceholder;
  }

  /* ---------- Enquiry form ---------- */
  function initForm(waPlaceholder) {
    var form = $("#enquiry");
    if (!form) return;
    var status = $(".form__status", form);
    function message() {
      var d = new FormData(form);
      var lines = [
        "Hello Bombay Soda,",
        "",
        "Name: " + (d.get("name") || ""),
        "Business: " + (d.get("business") || ""),
        "City: " + (d.get("city") || ""),
        "Phone: " + (d.get("phone") || ""),
        "Interested in: " + (d.get("interest") || ""),
        "",
        (d.get("message") || "")
      ];
      return lines.join("\n").trim();
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var via = (e.submitter && e.submitter.value) || "whatsapp";
      if (via === "whatsapp") {
        if (waPlaceholder) { status.textContent = "WhatsApp isn't connected yet. Please use email for now."; return; }
        window.open("https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(message()), "_blank", "noopener");
        status.textContent = "Opening WhatsApp with your details…";
      } else {
        var d = new FormData(form);
        location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Business enquiry — " + (d.get("business") || d.get("name") || "")) + "&body=" + encodeURIComponent(message());
        status.textContent = "Opening your email app…";
      }
    });
  }

  /* ---------- Replay intro ---------- */
  function initReplay() {
    $$("[data-replay]").forEach(function (b) {
      b.addEventListener("click", function () {
        try { sessionStorage.removeItem("bs-intro"); } catch (e) {}
        location.href = "/";
      });
    });
  }


  /* ---------- Chilled glass shatter ---------- */
  function initShatter() {
    $$("[data-shatter]").forEach(function (sec) {
      var cv = $(".chill__glass", sec), hint = $(".chill__hint", sec), replay = $(".chill__replay", sec);
      if (!cv) return;
      if (reduceMotion) { cv.remove(); if (hint) hint.remove(); sec.classList.add("is-broken"); return; }
      var ctx = cv.getContext("2d"), W = 1, H = 1, dpr = 1, frost, state = "intact", geo, shards = [], bits = [], t0, ix, iy;

      function makeFrost() {
        frost = document.createElement("canvas");
        frost.width = Math.ceil(W * dpr); frost.height = Math.ceil(H * dpr);
        var f = frost.getContext("2d"), r = rng(99), i;
        f.setTransform(dpr, 0, 0, dpr, 0, 0);
        var g = f.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "rgba(233,247,253,0.97)"); g.addColorStop(0.5, "rgba(212,236,248,0.95)"); g.addColorStop(1, "rgba(234,248,238,0.97)");
        f.fillStyle = g; f.fillRect(0, 0, W, H);
        for (i = 0; i < (W * H) / 70; i++) { f.fillStyle = "rgba(255,255,255," + (r() * 0.55).toFixed(2) + ")"; f.fillRect(r() * W, r() * H, 1 + r() * 1.6, 1 + r() * 1.6); }
        var e = f.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.72);
        e.addColorStop(0, "rgba(255,255,255,0)"); e.addColorStop(1, "rgba(255,255,255,0.8)");
        f.fillStyle = e; f.fillRect(0, 0, W, H);
        f.strokeStyle = "rgba(255,255,255,.4)"; f.lineWidth = 26; f.beginPath(); f.moveTo(W * 0.08, H); f.lineTo(W * 0.32, 0); f.stroke();
        f.lineWidth = 8; f.beginPath(); f.moveTo(W * 0.17, H); f.lineTo(W * 0.41, 0); f.stroke();
        for (i = 0; i < (W * H) / 2200; i++) {
          var x = r() * W, y = r() * H, rad = 1 + Math.pow(r(), 2.2) * 8;
          f.beginPath(); f.ellipse(x, y, rad * 0.9, rad, 0, 0, 6.2832);
          f.fillStyle = "rgba(150,195,220,0.22)"; f.fill();
          f.strokeStyle = "rgba(255,255,255,0.75)"; f.lineWidth = 1; f.stroke();
          f.beginPath(); f.arc(x - rad * 0.3, y - rad * 0.35, rad * 0.28, 0, 6.2832); f.fillStyle = "rgba(255,255,255,.95)"; f.fill();
          if (rad > 5.5 && r() < 0.5) { f.fillStyle = "rgba(160,200,222,.22)"; f.fillRect(x - rad * 0.22, y + rad * 0.6, rad * 0.44, 12 + r() * 50); }
        }
      }
      function drawIntact() { ctx.clearRect(0, 0, W, H); ctx.drawImage(frost, 0, 0, W, H); }
      function size() {
        var b = sec.getBoundingClientRect();
        dpr = Math.min(2, window.devicePixelRatio || 1); W = Math.max(1, b.width); H = Math.max(1, b.height);
        cv.width = Math.ceil(W * dpr); cv.height = Math.ceil(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (state === "intact") { makeFrost(); drawIntact(); }
      }
      size();
      if ("ResizeObserver" in window) new ResizeObserver(function () { if (state === "intact") size(); }).observe(sec);

      function build(x, y) {
        var maxD = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) * 1.08;
        var rays = 18, rings = [0.07, 0.17, 0.3, 0.48, 0.72, 1], R = Math.random, i, j;
        var P = [];
        for (i = 0; i < rays; i++) {
          var a = ((i + (R() - 0.5) * 0.6) / rays) * Math.PI * 2;
          P.push(rings.map(function (k, jj) {
            var d = maxD * k * (jj === rings.length - 1 ? 1.2 : 0.85 + R() * 0.3), aa = a + (R() - 0.5) * 0.09;
            return [x + Math.cos(aa) * d, y + Math.sin(aa) * d];
          }));
        }
        var polys = [], ringOn = [];
        for (i = 0; i < rays; i++) {
          var n = (i + 1) % rays;
          polys.push([[x, y], P[i][0], P[n][0]]);
          ringOn.push(rings.map(function () { return R() < 0.75; }));
          for (j = 1; j < rings.length; j++) {
            var q = [P[i][j - 1], P[n][j - 1], P[n][j], P[i][j]];
            if (R() < 0.45) { polys.push([q[0], q[1], q[2]]); polys.push([q[0], q[2], q[3]]); } else polys.push(q);
          }
        }
        return { P: P, polys: polys, ringOn: ringOn, maxD: maxD };
      }
      function crack(x, y) {
        if (state !== "intact") return;
        state = "cracking"; ix = x; iy = y; geo = build(x, y); t0 = performance.now();
        sec.classList.add("is-cracking");
        if (navigator.vibrate) { try { navigator.vibrate([10, 30, 16]); } catch (e) {} }
        requestAnimationFrame(drawCrack);
      }
      function drawCrack(now) {
        var t = Math.min(1, (now - t0) / 460), reach = geo.maxD * 0.6 * (1 - Math.pow(1 - t, 3));
        drawIntact();
        ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
        geo.P.forEach(function (ray) {
          ctx.beginPath(); ctx.moveTo(ix, iy);
          var prev = [ix, iy], pd = 0;
          for (var j = 0; j < ray.length; j++) {
            var pt = ray[j], d = Math.hypot(pt[0] - ix, pt[1] - iy);
            if (d > reach) { var k = (reach - pd) / (d - pd); ctx.lineTo(prev[0] + (pt[0] - prev[0]) * k, prev[1] + (pt[1] - prev[1]) * k); break; }
            ctx.lineTo(pt[0], pt[1]); prev = pt; pd = d;
          }
          ctx.strokeStyle = "rgba(80,130,160,.45)"; ctx.lineWidth = 2.4; ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 1.1; ctx.stroke();
        });
        for (var j = 0; j < geo.P[0].length - 1; j++) {
          for (var i = 0; i < geo.P.length; i++) {
            if (!geo.ringOn[i][j]) continue;
            var a = geo.P[i][j], b = geo.P[(i + 1) % geo.P.length][j];
            if (Math.hypot(a[0] - ix, a[1] - iy) < reach * 0.92 && Math.hypot(b[0] - ix, b[1] - iy) < reach * 0.92) {
              ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
              ctx.strokeStyle = "rgba(80,130,160,.35)"; ctx.lineWidth = 2; ctx.stroke();
              ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1; ctx.stroke();
            }
          }
        }
        var fl = ctx.createRadialGradient(ix, iy, 0, ix, iy, 70);
        fl.addColorStop(0, "rgba(255,255,255," + (0.95 * (1 - t * 0.6)).toFixed(2) + ")"); fl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = fl; ctx.fillRect(ix - 70, iy - 70, 140, 140);
        ctx.restore();
        if (t < 1) requestAnimationFrame(drawCrack); else setTimeout(shatter, 140);
      }
      function shatter() {
        state = "shatter"; sec.classList.add("is-broken");
        shards = geo.polys.map(function (poly) {
          var cx = 0, cy = 0;
          poly.forEach(function (pt) { cx += pt[0]; cy += pt[1]; });
          cx /= poly.length; cy /= poly.length;
          var pts = poly.map(function (pt) { return [pt[0] - cx, pt[1] - cy]; });
          var bb = [1e9, 1e9, -1e9, -1e9];
          pts.forEach(function (pt) { bb[0] = Math.min(bb[0], pt[0]); bb[1] = Math.min(bb[1], pt[1]); bb[2] = Math.max(bb[2], pt[0]); bb[3] = Math.max(bb[3], pt[1]); });
          var dx = cx - ix, dy = cy - iy, d = Math.hypot(dx, dy) || 1, near = 1 - Math.min(1, d / geo.maxD);
          var sp = 3 + near * 20 + Math.random() * 5;
          return {
            pts: pts, bb: bb, cx: cx, cy: cy, ox: 0, oy: 0,
            vx: (dx / d) * sp + (Math.random() - 0.5) * 3, vy: (dy / d) * sp - 3 - Math.random() * 5,
            rot: 0, vr: (Math.random() - 0.5) * 0.3 * (0.4 + near), sc: 1, vs: 0.004 + near * 0.014, a: 1,
            delay: (d / geo.maxD) * 160
          };
        });
        bits = [];
        var cols = ["#ffffff", "#ffffff", "#dff3fc", "#e8231a", "#f39a1e", "#f7c21b", "#7ac943", "#2fa8e0"];
        for (var i = 0; i < 110; i++) {
          var ang = Math.random() * 6.2832, sp = 4 + Math.random() * 17;
          bits.push({ x: ix, y: iy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3, r: 1.5 + Math.random() * 4, a: 1, c: cols[Math.floor(Math.random() * cols.length)], tri: Math.random() < 0.55, rot: Math.random() * 6 });
        }
        t0 = performance.now();
        requestAnimationFrame(drawShatter);
      }
      function drawShard(sh) {
        ctx.save(); ctx.globalAlpha = Math.max(0, sh.a);
        ctx.translate(sh.cx + sh.ox, sh.cy + sh.oy); ctx.rotate(sh.rot); ctx.scale(sh.sc, sh.sc);
        ctx.beginPath();
        sh.pts.forEach(function (pt, k) { if (k) ctx.lineTo(pt[0], pt[1]); else ctx.moveTo(pt[0], pt[1]); });
        ctx.closePath();
        ctx.save(); ctx.clip();
        var x0 = Math.max(0, sh.cx + sh.bb[0]), y0 = Math.max(0, sh.cy + sh.bb[1]);
        var x1 = Math.min(W, sh.cx + sh.bb[2]), y1 = Math.min(H, sh.cy + sh.bb[3]);
        if (x1 > x0 && y1 > y0) ctx.drawImage(frost, x0 * dpr, y0 * dpr, (x1 - x0) * dpr, (y1 - y0) * dpr, x0 - sh.cx, y0 - sh.cy, x1 - x0, y1 - y0);
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 1.5 / sh.sc; ctx.stroke();
        ctx.strokeStyle = "rgba(90,140,170,.35)"; ctx.lineWidth = 0.8 / sh.sc; ctx.stroke();
        ctx.restore();
      }
      function drawShatter(now) {
        var el = now - t0, alive = false;
        ctx.clearRect(0, 0, W, H);
        shards.forEach(function (sh) {
          if (el > sh.delay) {
            sh.vy += 0.6; sh.vx *= 0.99; sh.ox += sh.vx; sh.oy += sh.vy; sh.rot += sh.vr; sh.sc += sh.vs;
            if (el > 260 + sh.delay) sh.a -= 0.028;
          }
          if (sh.a > 0 && sh.cy + sh.oy < H + 300) { alive = true; drawShard(sh); }
        });
        bits.forEach(function (b) {
          b.vy += 0.42; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.a -= 0.014; b.rot += 0.2;
          if (b.a <= 0) return;
          alive = true;
          ctx.save(); ctx.globalAlpha = b.a; ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.fillStyle = b.c;
          ctx.beginPath();
          if (b.tri) { ctx.moveTo(0, -b.r * 1.4); ctx.lineTo(b.r, b.r); ctx.lineTo(-b.r, b.r * 0.6); ctx.closePath(); }
          else ctx.arc(0, 0, b.r * 0.8, 0, 6.2832);
          ctx.fill();
          if (b.c === "#ffffff") { ctx.strokeStyle = "rgba(90,140,170,.45)"; ctx.lineWidth = 0.8; ctx.stroke(); }
          ctx.restore();
        });
        if (alive && el < 3200) requestAnimationFrame(drawShatter);
        else { state = "done"; ctx.clearRect(0, 0, W, H); cv.style.visibility = "hidden"; if (replay) replay.classList.add("is-on"); }
      }
      function reset() {
        state = "intact"; cv.style.visibility = ""; sec.classList.remove("is-cracking", "is-broken");
        if (replay) replay.classList.remove("is-on");
        size();
      }

      cv.addEventListener("click", function (e) {
        var b = cv.getBoundingClientRect(); crack(e.clientX - b.left, e.clientY - b.top);
      });
      if (hint) hint.addEventListener("click", function () { crack(W / 2, H / 2); });
      if (replay) replay.addEventListener("click", reset);
      if ("IntersectionObserver" in window) {
        var timer;
        new IntersectionObserver(function (en) {
          clearTimeout(timer);
          if (en[0].isIntersecting && state === "intact") timer = setTimeout(function () { crack(W * 0.5, H * 0.45); }, 1400);
        }, { threshold: 0.65 }).observe(sec);
      }
    });
  }

  /* ---------- B-Spring bottle splash ---------- */
  function initAqua() {
    var st = $("#aqua");
    if (!st) return;
    if (reduceMotion) { st.classList.add("is-bob"); return; }
    var cv = $(".aqua__splash", st), ctx = cv.getContext("2d"), W = 1, H = 1, dpr = 1, drops = [], running = false;
    function size() {
      var b = st.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, b.width); H = Math.max(1, b.height);
      cv.width = Math.ceil(W * dpr); cv.height = Math.ceil(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    if ("ResizeObserver" in window) new ResizeObserver(size).observe(st);
    function loop() {
      ctx.clearRect(0, 0, W, H);
      var line = H * 0.56;
      drops = drops.filter(function (d) {
        d.vy += 0.38; d.x += d.vx; d.y += d.vy;
        if (d.vy > 0 && d.y > line + 6) return false;
        var ang = Math.atan2(d.vy, d.vx), len = Math.min(3, 1 + Math.hypot(d.vx, d.vy) * 0.12);
        ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(ang);
        ctx.beginPath(); ctx.ellipse(0, 0, d.r * len, d.r, 0, 0, 6.2832);
        ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fill();
        ctx.strokeStyle = "rgba(47,168,224,.55)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
        return true;
      });
      if (drops.length) requestAnimationFrame(loop); else running = false;
    }
    function splash() {
      var line = H * 0.56;
      for (var i = 0; i < 80; i++) {
        var side = Math.random() < 0.5 ? -1 : 1, off = W * (0.06 + Math.random() * 0.12);
        drops.push({ x: W / 2 + side * off, y: line, vx: side * (1 + Math.random() * 5), vy: -(4 + Math.random() * 10), r: 1.4 + Math.random() * 3.6 });
      }
      st.classList.remove("is-splash"); void st.offsetWidth; st.classList.add("is-splash");
      if (!running) { running = true; requestAnimationFrame(loop); }
    }
    var timers = [];
    function drop() {
      timers.forEach(clearTimeout);
      st.classList.remove("is-drop", "is-bob"); void st.offsetWidth; st.classList.add("is-drop");
      timers = [setTimeout(splash, 640), setTimeout(function () { st.classList.remove("is-drop"); st.classList.add("is-bob"); }, 1200)];
    }
    drop();
    st.addEventListener("click", drop);
    st.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); drop(); } });
  }

  /* ---------- Boot ---------- */
  renderBottles();
  initNav();
  var waPlaceholder = initConfig();
  initForm(waPlaceholder);
  initReplay();
  initIntro();
  initFizz();
  initLab();
  initShatter();
  initAqua();
  initReveal();
  initTilt();
})();
