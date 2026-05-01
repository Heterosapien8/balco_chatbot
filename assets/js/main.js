/* ── main.js: imports section HTML from sections.js and renders the page ── */

import {
  heroHTML,
  statsHTML,
  specialitiesHTML,
  doctorsHTML,
  awardsHTML,
  testimonialsHTML,
  newsHTML,
  partnersHTML,
  footerHTML,
} from "./sections.js";

/* ── Inject each section into its placeholder div ── */
const sections = {
  "slot-hero": heroHTML,
  "slot-stats": statsHTML,
  "slot-specialities": specialitiesHTML,
  "slot-doctors": doctorsHTML,
  "slot-awards": awardsHTML,
  "slot-testimonials": testimonialsHTML,
  "slot-news": newsHTML,
  "slot-partners": partnersHTML,
  "slot-footer": footerHTML,
};

Object.entries(sections).forEach(([id, html]) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
});
