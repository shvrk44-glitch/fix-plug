/**
 * FIX-PLUG Main Application JavaScript
 * Coordinates Mobile Drawer, WhatsApp Links, FAQ Accordions, and 3-Language System (English, Hausa, Pidgin)
 */

const FIX_PLUG_CONFIG = {
  // Artisan Coordinator WhatsApp (Official)
  whatsappNumber: "2348139277393",
  displayPhone: "0813 927 7393",
  coordinatorPhone: "0813 927 7393",
  email: "fix-plug.ng@gmail.com",
  founderEmail: "shark.systems44@gmail.com",
  instagram: "fixplug",
  instagramUrl: "https://instagram.com/fixplug",
  kanoOffice: "Kano, Nigeria",
  coverage: "We cover all areas in Kano",
  currentLang: "en"
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initFAQ();
  initLanguage();
  initWhatsAppLinks();
  updateFooterYear();
  initContactLinks();
});

// Mobile Drawer Navigation (iOS Style)
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
      defaultMsg = "Hello FIX-PLUG Coordinator, I am an artisan in Kano and I want to join your verified network.";
    } else if (type === "dispute") {
      defaultMsg = "Hello FIX-PLUG Support, I have a question about my recent job.";
    }

    const encoded = encodeURIComponent(defaultMsg);
    btn.setAttribute("href", `https://wa.me/${FIX_PLUG_CONFIG.whatsappNumber}?text=${encoded}`);
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
  });
}

// 3-Language System (English, Hausa, Pidgin)
function initLanguage() {
  const savedLang = localStorage.getItem("fixplug_lang") || "en";
  setLanguage(savedLang);

  // iOS Segmented Control buttons
  const segmentBtns = document.querySelectorAll(".segment-btn[data-lang]");
  segmentBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const chosenLang = btn.getAttribute("data-lang");
      setLanguage(chosenLang);
    });
  });

  // Legacy single toggle button fallback (cycles through EN -> HA -> PI)
  const legacyToggle = document.getElementById("langToggle");
  if (legacyToggle) {
    legacyToggle.addEventListener("click", () => {
      const order = ["en", "ha", "pi"];
      const nextIndex = (order.indexOf(FIX_PLUG_CONFIG.currentLang) + 1) % order.length;
      setLanguage(order[nextIndex]);
    });
  }
}

function setLanguage(lang) {
  if (!window.FIX_PLUG_I18N || !window.FIX_PLUG_I18N[lang]) {
    lang = "en";
  }
  FIX_PLUG_CONFIG.currentLang = lang;
  localStorage.setItem("fixplug_lang", lang);

  // Update active state in segmented controls
  const segmentBtns = document.querySelectorAll(".segment-btn[data-lang]");
  segmentBtns.forEach(btn => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    }
  });

  // Update legacy toggle button label if present
  const legacyToggle = document.getElementById("langToggle");
  if (legacyToggle) {
    const labels = { en: "HAUSA", ha: "PIDGIN", pi: "ENGLISH" };
    legacyToggle.textContent = labels[lang] || "LANG";
  }

  // Update elements that have data-i18n attribute
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (window.FIX_PLUG_I18N[lang] && window.FIX_PLUG_I18N[lang][key]) {
      el.textContent = window.FIX_PLUG_I18N[lang][key];
    }
  });
}

// Dynamic email/instagram elements updater
function initContactLinks() {
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.setAttribute("href", `mailto:${FIX_PLUG_CONFIG.email}`);
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
window.setLanguage = setLanguage;
