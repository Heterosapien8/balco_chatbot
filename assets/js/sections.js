/* ── sections.js: HTML content for each page section ── */
/* Each exported string is injected into index.html by main.js  */

const CDN = "https://www.balcomedicalcentre.com";

export const heroHTML = `
<section class="hero">
  <div class="hero-content">
    <p class="hero-tag">A Unit of Vedanta Medical Research Foundation</p>
    <h1 class="hero-title">Comprehensive <span>Cancer Care</span><br/>Under One Roof</h1>
    <p class="hero-desc">BALCO Medical Centre is Chhattisgarh's premier cancer hospital — combining world-class oncology expertise with compassionate, affordable care for every patient.</p>
    <div class="hero-btns">
      <a href="#" class="hero-btn-primary"><i class="fa fa-calendar-check"></i> Book Appointment</a>
      <a href="#" class="hero-btn-secondary"><i class="fa fa-stethoscope"></i> Our Specialities</a>
    </div>
  </div>
  <div class="hero-badges">
    <p>Accredited by</p>
    <div class="badge-logos">
      <div class="badge-logo"><img src="${CDN}/package/images/nabh.png" alt="NABH"/></div>
      <div class="badge-logo" style="background:#0d1f4e"><img src="${CDN}/package/images/NABL_Logo.png" alt="NABL"/></div>
    </div>
  </div>
</section>`;

export const statsHTML = `
<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat-item"><div class="stat-num">15,000+</div><div class="stat-label">Patients Treated</div></div>
    <div class="stat-item"><div class="stat-num">35+</div><div class="stat-label">Specialist Doctors</div></div>
    <div class="stat-item"><div class="stat-num">15+</div><div class="stat-label">Specialities</div></div>
    <div class="stat-item"><div class="stat-num">24/7</div><div class="stat-label">Emergency Care</div></div>
    <div class="stat-item"><div class="stat-num">10+</div><div class="stat-label">Awards Won</div></div>
  </div>
</div>`;

const SPECS = [
  ["fa-flask", "Medical Oncology"],
  ["fa-cut", "Surgical Oncology"],
  ["fa-radiation", "Radiation Oncology"],
  ["fa-tint", "Haematology"],
  ["fa-baby", "Paediatric Oncology"],
  ["fa-atom", "Nuclear Medicine"],
  ["fa-heart", "Pain & Palliative Care"],
  ["fa-microscope", "Laboratory Services"],
  ["fa-x-ray", "Radiology"],
  ["fa-procedures", "Anesthesia & ICU"],
  ["fa-vial", "Transfusion Medicine"],
  ["fa-stethoscope", "Internal Medicine"],
];
export const specialitiesHTML = `
<section class="section">
  <div class="section-inner">
    <div class="section-head">
      <h2>Our Specialities</h2>
      <div class="section-divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
      <p>World-class oncology expertise across all major cancer specialities under one roof.</p>
    </div>
    <div class="specialities-grid">
      ${SPECS.map(
        ([icon, name]) => `
      <div class="spec-card">
        <div class="spec-icon"><i class="fa ${icon}"></i></div>
        <h4>${name}</h4>
      </div>`,
      ).join("")}
    </div>
    <div class="see-all-wrap"><a href="#" class="btn-see-all">View All Specialities <i class="fa fa-arrow-right"></i></a></div>
  </div>
</section>`;

const DOCS = [
  ["dr-bhawna-sirohi", "Dr. Bhawna Sirohi", "Medical Oncology"],
  ["dr-gourav-gupta", "Dr. Gourav Gupta", "Radiation Oncology"],
  ["dr-diwakar-pandey", "Dr. Diwakar Pandey", "Surgical Oncology"],
  ["dr-deba-dulal-biswal", "Dr. Deba Dulal Biswal", "Medical Oncology"],
  ["dr-dibyendu-de", "Dr. Dibyendu De", "Haemato Oncology"],
  ["dr-jay-kumar-rai", "Dr. Jay Kumar Rai", "Nuclear Medicine"],
];
export const doctorsHTML = `
<section class="section section-alt">
  <div class="section-inner">
    <div class="section-head">
      <h2>Our Doctors</h2>
      <div class="section-divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
      <p>Meet our team of dedicated oncology specialists committed to your recovery.</p>
    </div>
    <div class="doctors-grid">
      ${DOCS.map(
        ([slug, name, dept]) => `
      <div class="doc-card" onclick="location.href='${CDN}/doctors/${slug}'">
        <div class="doc-photo"><img src="${CDN}/uploads/doctor/${slug}.jpg" alt="${name}" onerror="this.src='https://placehold.co/200x200/e8eef8/1a3a8f?text=Doctor'"/></div>
        <div class="doc-info"><h3>${name}</h3><span>${dept}</span></div>
        <a href="${CDN}/appointment/doctor/${slug}" class="doc-btn">Book Appointment</a>
      </div>`,
      ).join("")}
    </div>
    <div class="see-all-wrap"><a href="${CDN}/doctors" class="btn-see-all">Meet All Doctors <i class="fa fa-arrow-right"></i></a></div>
  </div>
</section>`;

const AWARDS = [
  [
    "1732778693-hospital-of-the-year-east---oncology-award-at-the-economic-times-healthcare-awards-2024.JPG",
    "Hospital of the Year (East) – Oncology · ET Healthcare Awards 2024",
  ],
  [
    "1667822239mohfw-for-best-infection-control-practices.jpg",
    "MoHFW Award for Best Infection Control Practices",
  ],
  ["1690621796nabl-certified.jpg", "NABL Certified Laboratory"],
  ["1690621889nabh-certified.jpg", "NABH Accredited Hospital"],
];
export const awardsHTML = `
<section class="awards-section">
  <div class="section-inner">
    <div class="section-head">
      <h2>Awards &amp; Accreditation</h2>
      <div class="section-divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
      <p>Recognised nationally for excellence in cancer care and hospital management.</p>
    </div>
    <div class="awards-grid">
      ${AWARDS.map(
        ([file, label]) => `
      <div class="award-card">
        <img src="${CDN}/uploads/awards/${file}" alt="${label}" onerror="this.style.display='none'"/>
        <p>${label}</p>
      </div>`,
      ).join("")}
    </div>
    <div class="see-all-wrap"><a href="#" class="btn-see-all">View All Awards <i class="fa fa-arrow-right"></i></a></div>
  </div>
</section>`;

const TESTIS = [
  [
    "Brajesh Mittal",
    "Superb hospital with trusted treatment, very helpful staff, best doctors. If you are around Chhattisgarh and looking for cancer care, this is the place.",
  ],
  [
    "Roshan Sonwani",
    "Excellent hospital with one of the best doctors I have consulted. Definitely recommend everyone for cancer treatment. World-class facilities.",
  ],
  [
    "Siddharth Baliram Singh",
    "Dr. Jay Rai explained every benefit of Lutetium therapy. We could see a great difference in my father's condition. Thank you BALCO team!",
  ],
  [
    "Deepesh Singh",
    "All staff and doctors are cooperative and the facilities provided by the hospital are truly world class. Very impressed with the level of care.",
  ],
];
export const testimonialsHTML = `
<section class="section section-alt">
  <div class="section-inner">
    <div class="section-head">
      <h2>What Our Patients Say</h2>
      <div class="section-divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
      <p>Real stories of hope, healing and gratitude from patients and their families.</p>
    </div>
    <div class="testi-grid">
      ${TESTIS.map(
        ([name, text]) => `
      <div class="testi-card">
        <div class="testi-quote">"</div>
        <p>${text}</p>
        <h4>${name}</h4>
      </div>`,
      ).join("")}
    </div>
  </div>
</section>`;

const NEWS = [
  [
    "5190_main-photo-op.JPG",
    "Sep 18, 2026",
    "BMC Chhattisgarh Cancer Conclave – 4th Edition",
    "Naya Raipur, Chhattisgarh",
    "bmc-chhattisgarh-cancer-conclave---4th-edition",
  ],
  [
    "1205_website-slider.jpg",
    "Mar 23, 2025",
    "BMC Walkathon – Walk For A Life 2025",
    "Marine Drive, Raipur",
    "bmc-walkathon---walk-for-a-life-2025",
  ],
  [
    "1964_img-5201.JPG",
    "Oct 27, 2024",
    "Bike Rally – Breast Cancer Awareness Month",
    "The Marine Drive, Raipur",
    "bike-rally---breast-cancer-awareness-month",
  ],
  [
    "5785_dsc-8551.JPG",
    "Sep 20, 2024",
    "2nd Edition of BMC Chhattisgarh Cancer Conclave",
    "Mayfair Lake Resort, Naya Raipur",
    "2nd-edition-of-bmc-chhattisgarh-cancer-conclave",
  ],
];
export const newsHTML = `
<section class="section">
  <div class="section-inner">
    <div class="section-head">
      <h2>News &amp; Events</h2>
      <div class="section-divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
      <p>Stay updated with the latest happenings at BALCO Medical Centre.</p>
    </div>
    <div class="news-grid">
      ${NEWS.map(
        ([img, date, title, loc, slug]) => `
      <a class="news-card" href="${CDN}/events/${slug}">
        <img src="${CDN}/uploads/event/${img}" alt="${title}" onerror="this.src='https://placehold.co/400x160/e8eef8/1a3a8f?text=Event'"/>
        <div class="news-info"><p class="news-date">${date}</p><h3>${title}</h3><p>${loc}</p></div>
      </a>`,
      ).join("")}
    </div>
    <div class="see-all-wrap"><a href="${CDN}/events" class="btn-see-all">All Events <i class="fa fa-arrow-right"></i></a></div>
  </div>
</section>`;

const PARTNERS = [
  "tata.jpg",
  "balco.jpg",
  "vedanta.jpg",
  "cuddles.png",
  "cancer-logo.png",
  "milaap.png",
];
export const partnersHTML = `
<section class="section section-alt" style="padding-top:40px;padding-bottom:40px;">
  <div class="section-inner">
    <div class="section-head" style="margin-bottom:28px;">
      <h2>Our Partners</h2>
      <div class="section-divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
    </div>
    <div class="partners-bar">
      ${PARTNERS.map((f) => `<img src="${CDN}/package/images/partners/${f}" class="partner-logo" onerror="this.style.display='none'"/>`).join("")}
    </div>
  </div>
</section>`;

export const footerHTML = `
<footer>
  <div class="footer-main">
    <div class="footer-brand">
      <img src="${CDN}/package/images/footer-logo.png" alt="BALCO" onerror="this.style.display='none'"/>
      <p>Balco Medical Centre, Vedanta Medical Research Foundation,<br/>Sector 36, Atal Nagar, PO: Uparwara,<br/>Raipur, Chhattisgarh 493661</p>
      <div class="footer-socials">
        <a href="https://www.facebook.com/BALCOMedical/" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://twitter.com/BalcoMedical/" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com/balcomedical/" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.youtube.com/channel/UCjcmTU8rE1rKzDvNnL3dakg" target="_blank"><i class="fab fa-youtube"></i></a>
        <a href="https://in.linkedin.com/company/balcomedicalcentre" target="_blank"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Pages</h4>
      <ul>
        ${["Home", "About Us", "Specialities", "Doctors", "Facilities", "Academics", "Health Library"].map((p) => `<li><a href="#"><i class="fa fa-chevron-right" style="font-size:10px"></i> ${p}</a></li>`).join("")}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <ul>
        ${["Appointment", "Testimonials", "Contact Us", "Photo Gallery", "Press Release", "BMC Compliances", "Careers"].map((p) => `<li><a href="#"><i class="fa fa-chevron-right" style="font-size:10px"></i> ${p}</a></li>`).join("")}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Quick Contacts</h4>
      <div class="footer-contact-item"><i class="fa fa-phone"></i><a href="tel:07712237575">0771-2237575</a></div>
      <div class="footer-contact-item"><i class="fa fa-phone"></i><a href="tel:8282823333">+91 8282823333</a></div>
      <div class="footer-contact-item"><i class="fa fa-envelope"></i><a href="mailto:info.vmrf@vedanta.co.in">info.vmrf@vedanta.co.in</a></div>
      <div class="footer-contact-item"><i class="fa fa-clock"></i><span>OPD: Mon–Sat, 09:00–17:30</span></div>
      <div class="footer-contact-item"><i class="fa fa-clock"></i><span style="color:#4caf50">Emergency: 24 Hours</span></div>
    </div>
  </div>
  <div class="footer-bottom">
    Copyright &copy; 2026 Balco Medical Centre &nbsp;|&nbsp;
    <a href="#">Disclaimer</a><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a>
  </div>
</footer>`;
