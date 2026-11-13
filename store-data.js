/* Shared by the shop (index.html) and the admin page (admin.html).
   Everything is kept in this browser only: there is no server yet. */
(function () {
  "use strict";

  // Flat measurements of the finished garment in cm.
  // Tops: chest = pit to pit, length = high shoulder point to hem, shoulder = seam to seam, sleeve = shoulder seam to cuff.
  // Trousers: waist and hip = straight across the front, length = outside leg, hem = across the leg opening.
  const top = (id, chest, length, shoulder, sleeve, kids) => (kids ? { id, kids: true, chest, length, shoulder, sleeve } : { id, chest, length, shoulder, sleeve });
  const leg = (id, waist, hip, length, hem, kids) => (kids ? { id, kids: true, waist, hip, length, hem } : { id, waist, hip, length, hem });
  const CHARTS = {
    tee: {
      men: [top("S", 48, 68, 43, 20), top("M", 52, 71, 45.5, 21), top("L", 56, 74, 48, 22), top("XL", 60, 77, 50.5, 23), top("XXL", 64, 79, 53, 24)],
      women: [top("XS", 42, 59, 35.5, 15), top("S", 45, 61, 37, 15.5), top("M", 48, 63, 38.5, 16), top("L", 52, 65, 40.5, 17), top("XL", 56, 67, 42.5, 18), top("XXL", 61, 69, 44.5, 19)],
      kids: [top("4-5Y", 33, 44, 27, 11.5, 1), top("6-7Y", 36, 49, 29.5, 13, 1), top("8-9Y", 39, 54, 32, 14.5, 1), top("10-11Y", 42, 58, 34.5, 16, 1), top("12-13Y", 45, 62, 37, 17.5, 1)],
    },
    shirt: {
      men: [top("S", 53, 74, 44, 62), top("M", 56, 76, 46, 63.5), top("L", 60, 78, 48.5, 65), top("XL", 64, 80, 51, 66), top("XXL", 68, 82, 53.5, 67)],
      women: [top("XS", 45, 62, 36, 57), top("S", 48, 64, 37.5, 58), top("M", 51, 66, 39, 59), top("L", 55, 68, 41, 60), top("XL", 59, 70, 43, 61)],
      kids: [top("4-5Y", 35, 46, 28, 37, 1), top("6-7Y", 38, 51, 30.5, 42, 1), top("8-9Y", 41, 56, 33, 47, 1), top("10-11Y", 44, 60, 35.5, 51, 1)],
    },
    kurta: {
      men: [top("S", 54, 98, 44, 59), top("M", 57, 102, 46, 60.5), top("L", 61, 106, 48.5, 62), top("XL", 65, 110, 51, 63), top("XXL", 69, 112, 53.5, 64)],
      women: [top("XS", 46, 92, 36, 54), top("S", 49, 94, 37.5, 55), top("M", 52, 96, 39, 56), top("L", 56, 98, 41, 57), top("XL", 60, 100, 43, 58), top("XXL", 65, 102, 45, 59)],
      kids: [top("4-5Y", 35, 56, 28, 36, 1), top("6-7Y", 38, 62, 30.5, 41, 1), top("8-9Y", 41, 69, 33, 46, 1), top("10-11Y", 44, 75, 35.5, 50, 1)],
    },
    trousers: {
      men: [leg("S", 38, 50, 100, 18), leg("M", 41, 53, 102, 18.5), leg("L", 44, 56, 104, 19), leg("XL", 47.5, 59.5, 106, 19.5), leg("XXL", 51, 63, 107, 20)],
      women: [leg("XS", 32, 45, 96, 15), leg("S", 34.5, 47.5, 97, 15.5), leg("M", 37, 50, 98, 16), leg("L", 40.5, 53.5, 99, 16.5), leg("XL", 44, 57, 100, 17), leg("XXL", 48, 61, 101, 17.5)],
      kids: [leg("4-5Y", 25, 33, 56, 11.5, 1), leg("6-7Y", 26.5, 36, 65, 12.5, 1), leg("8-9Y", 28, 39, 74, 13.5, 1), leg("10-11Y", 30, 42, 82, 14.5, 1)],
    },
  };
  const TYPES = { tee: "T-shirt", shirt: "Shirt", kurta: "Kurta", trousers: "Trousers" };
  // The columns of a size chart, with the range a real garment falls in (used to catch typing mistakes).
  const FIELDS = {
    top: [{ k: "chest", label: "Chest", round: true, min: 20, max: 90 }, { k: "length", label: "Length", min: 25, max: 130 }, { k: "shoulder", label: "Shoulder", min: 18, max: 70 }, { k: "sleeve", label: "Sleeve", min: 5, max: 75 }],
    trousers: [{ k: "waist", label: "Waist", round: true, min: 15, max: 80 }, { k: "hip", label: "Hips", round: true, min: 20, max: 90 }, { k: "length", label: "Length", min: 30, max: 125 }, { k: "hem", label: "Hem", min: 8, max: 40 }],
  };
  const C = { brick: { name: "Brick", hex: "#a8452f" }, navy: { name: "Navy", hex: "#22355c" }, forest: { name: "Forest", hex: "#2f6048" }, charcoal: { name: "Charcoal", hex: "#2e3036" }, ecru: { name: "Ecru", hex: "#e6e1d3" }, mustard: { name: "Mustard", hex: "#c79a2b" }, sky: { name: "Sky", hex: "#7fa6c9" }, rose: { name: "Rose", hex: "#c9788a" }, khaki: { name: "Khaki", hex: "#a39672" }, white: { name: "White", hex: "#f4f3ee" } };
  const P = (id, name, type, group, price, pattern, colours, n, desc) => { const chart = JSON.parse(JSON.stringify(CHARTS[type][group])); return { id, name, type, group, price, pattern, colours, chart, stock: Object.fromEntries(chart.map((r) => [r.id, n])), desc }; };

  // Example products. Replace them from the admin page.
  const DEFAULT_PRODUCTS = [
    P("tee-classic-m", "Classic Crew Tee", "tee", "men", 1890, "plain", [C.navy, C.charcoal, C.ecru, C.forest], 12, "Midweight cotton jersey. Straight cut, ribbed crew collar."),
    P("shirt-oxford-m", "Oxford Shirt", "shirt", "men", 3490, "plain", [C.sky, C.white, C.navy], 8, "Cotton oxford cloth with a button-down front and long sleeves."),
    P("kurta-classic-m", "Everyday Kurta", "kurta", "men", 3990, "plain", [C.white, C.ecru, C.charcoal, C.navy], 10, "Cotton kurta with a band collar, short placket and side slits."),
    P("trouser-chino-m", "Straight Chino", "trousers", "men", 3290, "plain", [C.khaki, C.navy, C.charcoal], 9, "Cotton twill, straight through the leg."),
    P("tee-breton-m", "Breton Stripe Tee", "tee", "men", 2290, "stripes", [C.navy, C.brick, C.forest], 8, "2.5 cm yarn-dyed stripes on an ecru ground."),
    P("tee-classic-w", "Everyday Tee", "tee", "women", 1790, "plain", [C.rose, C.ecru, C.navy, C.mustard], 12, "Light cotton jersey with a slightly shorter body."),
    P("kurta-lawn-w", "Lawn Kurta", "kurta", "women", 4290, "plain", [C.rose, C.sky, C.mustard, C.white], 10, "Light lawn cotton, band collar, knee length with side slits."),
    P("shirt-stripe-w", "Striped Shirt", "shirt", "women", 3290, "stripes", [C.navy, C.rose], 7, "A crisp striped shirt with long sleeves."),
    P("trouser-straight-w", "Straight Trouser", "trousers", "women", 2990, "plain", [C.charcoal, C.khaki, C.navy], 9, "Mid-rise, straight leg."),
    P("tee-heather-w", "Soft Heather Tee", "tee", "women", 1990, "heather", [C.sky, C.rose, C.charcoal], 7, "Brushed mélange jersey."),
    P("tee-play-k", "Playground Tee", "tee", "kids", 1190, "plain", [C.mustard, C.sky, C.brick, C.forest], 15, "Sturdy cotton that survives the wash. Roomy cut to grow into."),
    P("kurta-eid-k", "Festive Kurta", "kurta", "kids", 2490, "plain", [C.white, C.sky, C.mustard], 10, "A soft cotton kurta for Eid and family days."),
    P("trouser-play-k", "Pull-on Trouser", "trousers", "kids", 1590, "plain", [C.navy, C.khaki], 12, "Elastic waist, room to move."),
  ];
  // Fabrics, as a mill specifies them: weight in GSM and bending length in cm. The try-on uses these to hang and swing the cloth.
  const FABRICS = {
    lawn: { label: "Lawn", gsm: 70, bend: 1.6 }, jersey: { label: "Jersey knit", gsm: 150, bend: 1.9 }, poplin: { label: "Poplin", gsm: 120, bend: 2.2 }, oxford: { label: "Oxford", gsm: 150, bend: 2.6 },
    linen: { label: "Linen", gsm: 180, bend: 3.2 }, twill: { label: "Twill", gsm: 260, bend: 3.6 }, denim: { label: "Denim", gsm: 400, bend: 5.0 },
  };
  const TYPE_FABRIC = { tee: "jersey", shirt: "poplin", kurta: "poplin", trousers: "twill" };
  const PRODUCT_FABRIC = { "shirt-oxford-m": { type: "oxford", count: "40s" }, "kurta-classic-m": { type: "poplin", count: "50s" }, "kurta-lawn-w": { type: "lawn", count: "80s" }, "shirt-stripe-w": { type: "poplin", count: "60s" }, "kurta-eid-k": { type: "lawn", count: "60s" }, "tee-heather-w": { type: "jersey", gsm: 130 } };
  for (const p of DEFAULT_PRODUCTS) if (PRODUCT_FABRIC[p.id]) p.fabric = PRODUCT_FABRIC[p.id];
  const DEFAULT_SETTINGS = { name: "Darzi", tagline: "See how it fits before you buy.", whatsapp: "", delivery: 250, freeOver: 5000 };

  const read = (k, d) => { try { const v = localStorage.getItem("darzi." + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  const write = (k, v) => { try { localStorage.setItem("darzi." + k, JSON.stringify(v)); return true; } catch { return false; } };

  const store = {
    CHARTS, TYPES, COLOURS: Object.values(C), DEFAULT_PRODUCTS, FABRICS,
    // A product's fabric with every number filled in: its own where the shop gave them, otherwise the usual ones for that cloth.
    fabricOf(p) {
      const own = p.fabric && FABRICS[p.fabric.type] ? p.fabric : PRODUCT_FABRIC[p.id] || { type: TYPE_FABRIC[TYPES[p.type] ? p.type : "tee"] }, base = FABRICS[own.type];
      const num = (x, lo, hi) => { const n = Number(x); return x != null && x !== "" && n >= lo && n <= hi ? n : null; };
      return { type: own.type, label: base.label, gsm: num(own.gsm, 30, 600) || base.gsm, bend: num(own.bend, 0.5, 9) || (num(own.drape, 10, 98) ? null : base.bend), drape: num(own.drape, 10, 98), count: own.count ? String(own.count).slice(0, 12) : "" };
    },
    fabricText(p) { const f = this.fabricOf(p); return `${f.label}, ${f.gsm} GSM` + (f.count ? `, ${f.count} yarn` : ""); },
    typeOf(p) { return TYPES[p.type] ? p.type : "tee"; },
    fields(type) { return type === "trousers" ? FIELDS.trousers : FIELDS.top; },
    chartFor(type, group) { return JSON.parse(JSON.stringify((CHARTS[type] || CHARTS.tee)[group] || CHARTS.tee.men)); },
    products() {
      const p = read("products", null); if (!Array.isArray(p) || !p.length) return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
      // A catalogue saved before shirts, kurtas and trousers existed gets the new example products added once.
      if (read("catalogVersion", 1) < 2) { for (const d of DEFAULT_PRODUCTS) if (!p.some((x) => x.id === d.id)) p.push(JSON.parse(JSON.stringify(d))); write("products", p); write("catalogVersion", 2); }
      return p;
    },
    saveProducts(list) { write("catalogVersion", 2); return write("products", list); },
    resetProducts() { try { localStorage.removeItem("darzi.products"); } catch { /* nothing to remove */ } },
    settings() { return { ...DEFAULT_SETTINGS, ...read("settings", {}) }; },
    saveSettings(s) { return write("settings", s); },
    cart() { const c = read("cart", []); return Array.isArray(c) ? c : []; },
    saveCart(c) { return write("cart", c); },
    orders() { const o = read("orders", []); return Array.isArray(o) ? o : []; },
    saveOrders(o) { return write("orders", o); },
    money(n) { return "Rs " + Math.round(n).toLocaleString("en-PK"); },
    esc(t) { return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); },

    // A flat drawing of the garment in its colour and pattern, used wherever a product photo would go.
    shirtSvg(product, hex, opts) {
      const id = "s" + Math.random().toString(36).slice(2, 8), o = opts || {}, type = store.typeOf(product);
      const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
      const second = lum(hex) > 0.55 ? "#3a3d44" : "#ece8dc", ink = lum(hex) > 0.55 ? "#10141b" : "#ffffff";
      let defs = "", fill = hex;
      if (product.pattern === "stripes") { const vertical = type === "shirt"; defs = `<pattern id="${id}" width="${vertical ? 12 : 10}" height="${vertical ? 10 : 16}" patternUnits="userSpaceOnUse"><rect width="12" height="16" fill="${second}"/><rect width="${vertical ? 6 : 12}" height="${vertical ? 16 : 8}" fill="${hex}"/></pattern>`; fill = `url(#${id})`; }
      else if (product.pattern === "heather") { defs = `<pattern id="${id}" width="7" height="9" patternUnits="userSpaceOnUse"><rect width="7" height="9" fill="${hex}"/><rect x="1" y="1" width="1" height="3" fill="#fff" opacity=".22"/><rect x="4" y="5" width="1" height="3" fill="#000" opacity=".16"/><rect x="6" y="2" width="1" height="2" fill="#fff" opacity=".14"/></pattern>`; fill = `url(#${id})`; }
      const line = `fill="none" stroke="${ink}" stroke-opacity=".45" stroke-width="1.1" stroke-linecap="round"`;
      let body, extra = "";
      if (type === "trousers") {
        body = "M56 14h68l8 150h-34L90 62l-8 102H48z";
        extra = `<path d="M56 24h68" ${line}/><path d="M92 24v30" ${line}/>`;
      } else if (type === "kurta") {
        body = "M74 12c6 6 26 6 32 0l28 10 30 92-17 6-19-52v102H52V68l-19 52-17-6 30-92z";
        extra = `<path d="M90 17v34" ${line}/><circle cx="90" cy="27" r="1.3" fill="${ink}" opacity=".6"/><circle cx="90" cy="37" r="1.3" fill="${ink}" opacity=".6"/><circle cx="90" cy="47" r="1.3" fill="${ink}" opacity=".6"/><path d="M52 138v32M128 138v32" ${line}/>`;
      } else if (type === "shirt") {
        body = "M72 18l18 8 18-8 28 10 32 96-17 6-21-56v88H50V74l-21 56-17-6 32-96z";
        extra = `<path d="M90 26v136" ${line}/><path d="M72 18l8 18 10-10 10 10 8-18" ${line}/>` + [44, 66, 88, 110, 132].map((y) => `<circle cx="90" cy="${y}" r="1.4" fill="${ink}" opacity=".6"/>`).join("");
      } else {
        body = "M70 22c8 9 32 9 40 0l34 12 26 34-22 18-16-16v96H48V70L32 86 10 68l26-34z";
        extra = `<path d="M70 22c8 9 32 9 40 0" fill="none" stroke="${hex}" stroke-width="5" stroke-linecap="round"/><path d="M70 22c8 9 32 9 40 0" fill="none" stroke="#10141b" stroke-opacity=".22" stroke-width="5.6" stroke-linecap="round" stroke-dasharray="1 2"/>`;
      }
      const print = product.print && type !== "trousers" ? `<image href="${product.print}" x="68" y="${type === "tee" ? 56 : 62}" width="44" height="44" preserveAspectRatio="xMidYMid meet"/>` : "";
      return `<svg viewBox="0 0 180 180" role="img" aria-label="${store.esc(o.label || product.name)}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs><path d="${body}" fill="${fill}"/><path d="${body}" fill="none" stroke="#10141b" stroke-opacity=".3" stroke-width="1.2" stroke-linejoin="round"/>${extra}${print}</svg>`;
    },
  };
  window.DarziStore = store;
})();
