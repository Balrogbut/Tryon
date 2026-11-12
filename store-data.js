/* Shared by the shop (index.html) and the admin page (admin.html).
   Everything is kept in this browser only: there is no server yet. */
(function () {
  "use strict";

  // Flat measurements in cm. chest = pit to pit, length = high shoulder point to hem.
  const CHARTS = {
    men: [
      { id: "S", chest: 48, length: 68, shoulder: 43, sleeve: 20 },
      { id: "M", chest: 52, length: 71, shoulder: 45.5, sleeve: 21 },
      { id: "L", chest: 56, length: 74, shoulder: 48, sleeve: 22 },
      { id: "XL", chest: 60, length: 77, shoulder: 50.5, sleeve: 23 },
      { id: "XXL", chest: 64, length: 79, shoulder: 53, sleeve: 24 },
    ],
    women: [
      { id: "XS", chest: 42, length: 59, shoulder: 35.5, sleeve: 15 },
      { id: "S", chest: 45, length: 61, shoulder: 37, sleeve: 15.5 },
      { id: "M", chest: 48, length: 63, shoulder: 38.5, sleeve: 16 },
      { id: "L", chest: 52, length: 65, shoulder: 40.5, sleeve: 17 },
      { id: "XL", chest: 56, length: 67, shoulder: 42.5, sleeve: 18 },
      { id: "XXL", chest: 61, length: 69, shoulder: 44.5, sleeve: 19 },
    ],
    kids: [
      { id: "4-5Y", kids: true, chest: 33, length: 44, shoulder: 27, sleeve: 11.5 },
      { id: "6-7Y", kids: true, chest: 36, length: 49, shoulder: 29.5, sleeve: 13 },
      { id: "8-9Y", kids: true, chest: 39, length: 54, shoulder: 32, sleeve: 14.5 },
      { id: "10-11Y", kids: true, chest: 42, length: 58, shoulder: 34.5, sleeve: 16 },
      { id: "12-13Y", kids: true, chest: 45, length: 62, shoulder: 37, sleeve: 17.5 },
    ],
  };
  const C = { brick: { name: "Brick", hex: "#a8452f" }, navy: { name: "Navy", hex: "#22355c" }, forest: { name: "Forest", hex: "#2f6048" }, charcoal: { name: "Charcoal", hex: "#2e3036" }, ecru: { name: "Ecru", hex: "#e6e1d3" }, mustard: { name: "Mustard", hex: "#c79a2b" }, sky: { name: "Sky", hex: "#7fa6c9" }, rose: { name: "Rose", hex: "#c9788a" } };
  const stockAll = (chart, n) => Object.fromEntries(CHARTS[chart].map((r) => [r.id, n]));

  // Example products. Replace them from the admin page.
  const DEFAULT_PRODUCTS = [
    { id: "tee-classic-m", name: "Classic Crew Tee", group: "men", price: 1890, pattern: "plain", colours: [C.navy, C.charcoal, C.ecru, C.forest], chart: CHARTS.men, stock: stockAll("men", 12), desc: "Midweight cotton jersey. Straight cut, ribbed crew collar." },
    { id: "tee-breton-m", name: "Breton Stripe Tee", group: "men", price: 2290, pattern: "stripes", colours: [C.navy, C.brick, C.forest], chart: CHARTS.men, stock: stockAll("men", 8), desc: "2.5 cm yarn-dyed stripes on an ecru ground." },
    { id: "tee-heather-m", name: "Heather Tee", group: "men", price: 2090, pattern: "heather", colours: [C.charcoal, C.forest, C.navy], chart: CHARTS.men, stock: stockAll("men", 10), desc: "Mélange yarn for a soft, flecked surface." },
    { id: "tee-classic-w", name: "Everyday Tee", group: "women", price: 1790, pattern: "plain", colours: [C.rose, C.ecru, C.navy, C.mustard], chart: CHARTS.women, stock: stockAll("women", 12), desc: "Light cotton jersey with a slightly shorter body." },
    { id: "tee-breton-w", name: "Marinière Tee", group: "women", price: 2190, pattern: "stripes", colours: [C.navy, C.rose, C.forest], chart: CHARTS.women, stock: stockAll("women", 9), desc: "Classic stripe, cut for a closer shoulder." },
    { id: "tee-heather-w", name: "Soft Heather Tee", group: "women", price: 1990, pattern: "heather", colours: [C.sky, C.rose, C.charcoal], chart: CHARTS.women, stock: stockAll("women", 7), desc: "Brushed mélange jersey." },
    { id: "tee-play-k", name: "Playground Tee", group: "kids", price: 1190, pattern: "plain", colours: [C.mustard, C.sky, C.brick, C.forest], chart: CHARTS.kids, stock: stockAll("kids", 15), desc: "Sturdy cotton that survives the wash. Roomy cut to grow into." },
    { id: "tee-stripe-k", name: "Little Stripe Tee", group: "kids", price: 1390, pattern: "stripes", colours: [C.brick, C.navy, C.forest], chart: CHARTS.kids, stock: stockAll("kids", 10), desc: "Stripes for small people." },
  ];
  const DEFAULT_SETTINGS = { name: "Darzi", tagline: "See how it fits before you buy.", whatsapp: "", delivery: 250, freeOver: 5000 };

  const read = (k, d) => { try { const v = localStorage.getItem("darzi." + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  const write = (k, v) => { try { localStorage.setItem("darzi." + k, JSON.stringify(v)); return true; } catch { return false; } };

  const store = {
    CHARTS, COLOURS: Object.values(C), DEFAULT_PRODUCTS,
    products() { const p = read("products", null); return Array.isArray(p) && p.length ? p : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)); },
    saveProducts(list) { return write("products", list); },
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
      const id = "s" + Math.random().toString(36).slice(2, 8), o = opts || {};
      const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
      const second = lum(hex) > 0.55 ? "#3a3d44" : "#ece8dc";
      let defs = "", fill = hex;
      if (product.pattern === "stripes") { defs = `<pattern id="${id}" width="10" height="16" patternUnits="userSpaceOnUse"><rect width="10" height="16" fill="${second}"/><rect width="10" height="8" fill="${hex}"/></pattern>`; fill = `url(#${id})`; }
      else if (product.pattern === "heather") { defs = `<pattern id="${id}" width="7" height="9" patternUnits="userSpaceOnUse"><rect width="7" height="9" fill="${hex}"/><rect x="1" y="1" width="1" height="3" fill="#fff" opacity=".22"/><rect x="4" y="5" width="1" height="3" fill="#000" opacity=".16"/><rect x="6" y="2" width="1" height="2" fill="#fff" opacity=".14"/></pattern>`; fill = `url(#${id})`; }
      const body = "M70 22c8 9 32 9 40 0l34 12 26 34-22 18-16-16v96H48V70L32 86 10 68l26-34z";
      const print = product.print ? `<image href="${product.print}" x="66" y="56" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>` : "";
      return `<svg viewBox="0 0 180 180" role="img" aria-label="${store.esc(o.label || product.name)}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs><path d="${body}" fill="${fill}"/><path d="${body}" fill="none" stroke="#10141b" stroke-opacity=".28" stroke-width="1.2" stroke-linejoin="round"/><path d="M70 22c8 9 32 9 40 0" fill="none" stroke="${hex}" stroke-width="5" stroke-linecap="round"/><path d="M70 22c8 9 32 9 40 0" fill="none" stroke="#10141b" stroke-opacity=".22" stroke-width="5.6" stroke-linecap="round" stroke-dasharray="1 2"/>${print}</svg>`;
    },
  };
  window.DarziStore = store;
})();
