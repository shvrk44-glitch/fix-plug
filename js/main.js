/**
 * FIX-PLUG Main Application JavaScript
 * Coordinates Mobile Drawer, WhatsApp Links, FAQ Accordions, and Language State
 */

const FIX_PLUG_CONFIG = {
  // Configurable dedicated WhatsApp Business Number (change here to update across site)
  whatsappNumber: "2348020000000", // Placeholder until official SIM is live
  displayPhone: "+234 802 000 0000",
  email: "hello@fixplug.ng",
  kanoOffice: "Kano, Nigeria",
  currentLang: "en"
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initFAQ();
  initLanguage();
  initWhatsAppLinks();
  updateFooterYear();
});

// Mobile Drawer Navigation
function initMobileNav() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      drawer.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    } else {
      drawer.classList.add("open");
      menuBtn.classList.add("open");
      menuBtn.setAttribute("aria-expanded", "true");
    }
  });

  // Close when clicking any nav link
  const navLinks = drawer.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Interactive FAQ Accordions
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close other opened items for clean accordion UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("open");
          const otherBtn = otherItem.querySelector(".faq-question");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        questionBtn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// WhatsApp Link Generator
function initWhatsAppLinks() {
  const whatsappButtons = document.querySelectorAll("[data-wa-type]");
  whatsappButtons.forEach(btn => {
    const type = btn.getAttribute("data-wa-type");
    let defaultMsg = "Hello FIX-PLUG, I would like to make an inquiry.";
    if (type === "customer") {
      defaultMsg = "Hello FIX-PLUG, I need a verified tradesperson in Kano.";
    } else if (type === "artisan") {
      defaultMsg = "Hello FIX-PLUG, I am an artisan in Kano and I want to join your verified network.";
    } else if (type === "dispute") {
      defaultMsg = "Hello FIX-PLUG Support, I have a question about my recent job.";
    }

    const encoded = encodeURIComponent(defaultMsg);
    btn.setAttribute("href", `https://wa.me/${FIX_PLUG_CONFIG.whatsappNumber}?text=${encoded}`);
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
  });
}

// Language Switcher (English / Hausa)
function initLanguage() {
  const langToggleBtn = document.getElementById("langToggle");
  if (!langToggleBtn) return;

  const savedLang = localStorage.getItem("fixplug_lang") || "en";
  setLanguage(savedLang);

  langToggleBtn.addEventListener("click", () => {
    const nextLang = FIX_PLUG_CONFIG.currentLang === "en" ? "ha" : "en";
    setLanguage(nextLang);
  });
}

function setLanguage(lang) {
  if (!window.FIX_PLUG_I18N || !window.FIX_PLUG_I18N[lang]) return;
  FIX_PLUG_CONFIG.currentLang = lang;
  localStorage.setItem("fixplug_lang", lang);

  const langToggleBtn = document.getElementById("langToggle");
  if (langToggleBtn) {
    langToggleBtn.textContent = lang === "en" ? "HAUSA" : "ENGLISH";
    langToggleBtn.setAttribute("aria-label", `Switch to ${lang === "en" ? "Hausa" : "English"}`);
  }

  // Update elements that have data-i18n attribute
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (window.FIX_PLUG_I18N[lang][key]) {
      el.textContent = window.FIX_PLUG_I18N[lang][key];
    }
  });
}

// Current Year Auto-updater
function updateFooterYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

window.FIX_PLUG_CONFIG = FIX_PLUG_CONFIG;
