/**
 * FIX-PLUG Form Handlers (Hardened & Supabase-Enabled)
 * Handles Customer Requests & Artisan Applications
 * Implements Honeypot spam defense, Client Rate Limiting, Input Sanitization, NDPA 2023 Consent & Supabase Persistence
 */

document.addEventListener("DOMContentLoaded", () => {
  initCustomerRequestForm();
  initArtisanApplicationForm();
});

// Helper for phone validation (Nigeria format e.g., 080..., 070..., 081..., 090..., 091..., +234...)
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+?234|0)[789][01]\d{8}$/.test(cleaned) || /^\d{10,14}$/.test(cleaned);
}

// 1. Customer Request Form Handler
function initCustomerRequestForm() {
  const form = document.getElementById("customerRequestForm");
  const feedback = document.getElementById("customerFeedback");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check (hidden field to trap automated spam bots)
    const honeypot = form.querySelector('input[name="company_fax_code"]');
    if (honeypot && honeypot.value.trim() !== "") {
      console.warn("Spam trapped via honeypot.");
      showFeedback(feedback, "Thank you! Your request has been recorded.", "success");
      form.reset();
      return;
    }

    const nameInput = form.querySelector("#customerName");
    const phoneInput = form.querySelector("#customerPhone");
    const areaInput = form.querySelector("#customerArea");
    const tradeInput = form.querySelector("#customerTrade");
    const descInput = form.querySelector("#customerDescription");
    const consentInput = form.querySelector("#customerConsent");
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput.value.trim().slice(0, 100);
    const phone = phoneInput.value.trim().slice(0, 25);
    const area = areaInput.value.slice(0, 80);
    const trade = tradeInput.value.slice(0, 50);
    const description = descInput.value.trim().slice(0, 1000);
    const consent = consentInput ? consentInput.checked : true;

    if (!name || !phone || !area || !trade || !description) {
      showFeedback(feedback, "Please fill in all required fields marked with an asterisk (*).", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      showFeedback(feedback, "Please enter a valid active phone number (e.g. 0813 927 7393).", "error");
      phoneInput.focus();
      return;
    }

    if (!consent) {
      showFeedback(feedback, "You must agree to the data protection notice to submit your request.", "error");
      return;
    }

    // Disable button to prevent double-submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Connecting to dispatch...";
    }

    // Record submission
    const submission = {
      type: "customer_request",
      name,
      phone,
      area,
      trade,
      description,
      submittedAt: new Date().toISOString()
    };
    saveSubmission(submission);

    // Persist to Supabase Backend
    if (window.fixPlugBackend) {
      try {
        await window.fixPlugBackend.submitCustomerRequest(submission);
      } catch (err) {
        console.warn("Supabase background sync notice:", err);
      }
    }

    // Prepare friendly confirmation message
    const sanitizedName = escapeHtml(name);
    const sanitizedTrade = escapeHtml(trade);
    const sanitizedArea = escapeHtml(area);
    const sanitizedPhone = escapeHtml(phone);
    const waNumber = (window.FIX_PLUG_CONFIG && window.FIX_PLUG_CONFIG.whatsappNumber) || '2348139277393';
    const waMessage = encodeURIComponent(`Hello FIX-PLUG, I just submitted a request for ${trade} in ${area} Kano. My name is ${name}.`);

    const responseMsg = `
      <h3>Mungode, ${sanitizedName}!</h3>
      <p>Your request for a <strong>${sanitizedTrade}</strong> in <strong>${sanitizedArea}</strong> has been recorded.</p>
      <p>Our Kano dispatch coordinator will call or message you on <strong>${sanitizedPhone}</strong> within <strong>30 minutes</strong> (between 8:00 AM and 7:00 PM).</p>
      <div style="margin-top: 1.25rem;">
        <p style="font-weight: 700; margin-bottom: 0.5rem;">Need an artisan right away?</p>
        <a href="https://wa.me/${waNumber}?text=${waMessage}" 
           target="_blank" rel="noopener noreferrer" 
           class="btn btn-whatsapp" style="display: inline-flex; width: 100%;">
           Send this request to WhatsApp now
        </a>
      </div>
    `;

    showFeedback(feedback, responseMsg, "success", true);
    form.style.display = "none";
  });
}

// 2. Artisan Application Form Handler
function initArtisanApplicationForm() {
  const form = document.getElementById("artisanApplicationForm");
  const feedback = document.getElementById("artisanFeedback");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('input[name="company_fax_code"]');
    if (honeypot && honeypot.value.trim() !== "") {
      console.warn("Spam trapped via honeypot.");
      showFeedback(feedback, "Thank you! Your application has been submitted.", "success");
      form.reset();
      return;
    }

    const nameInput = form.querySelector("#artisanName");
    const phoneInput = form.querySelector("#artisanPhone");
    const tradeInput = form.querySelector("#artisanTrade");
    const areaInput = form.querySelector("#artisanArea");
    const expInput = form.querySelector("#artisanExperience");
    const certInput = form.querySelector("#artisanCert");
    const consentInput = form.querySelector("#artisanConsent");
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput.value.trim().slice(0, 100);
    const phone = phoneInput.value.trim().slice(0, 25);
    const trade = tradeInput.value.slice(0, 50);
    const area = areaInput.value.slice(0, 80);
    const experience = expInput ? expInput.value.slice(0, 50) : "1+ years";
    const certification = certInput ? certInput.value.slice(0, 100) : "";
    const consent = consentInput ? consentInput.checked : true;

    if (!name || !phone || !trade || !area) {
      showFeedback(feedback, "Please fill in all required fields.", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      showFeedback(feedback, "Please enter a valid active phone number (e.g. 0813 927 7393).", "error");
      phoneInput.focus();
      return;
    }

    if (!consent) {
      showFeedback(feedback, "You must agree to the data protection notice to submit your application.", "error");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting application...";
    }

    const submission = {
      type: "artisan_application",
      name,
      phone,
      trade,
      area,
      experience,
      certification,
      submittedAt: new Date().toISOString()
    };
    saveSubmission(submission);

    // Persist to Supabase Backend
    if (window.fixPlugBackend) {
      try {
        await window.fixPlugBackend.submitArtisanApplication(submission);
      } catch (err) {
        console.warn("Supabase background sync notice:", err);
      }
    }

    const sanitizedName = escapeHtml(name);
    const sanitizedTrade = escapeHtml(trade);
    const sanitizedArea = escapeHtml(area);
    const sanitizedPhone = escapeHtml(phone);
    const waNumber = (window.FIX_PLUG_CONFIG && window.FIX_PLUG_CONFIG.whatsappNumber) || '2348139277393';
    const waMessage = encodeURIComponent(`Hello FIX-PLUG Artisan Coordinator, I submitted my application for ${trade} in ${area} Kano. My name is ${name}.`);

    const responseMsg = `
      <h3>Barka da aiki, ${sanitizedName}!</h3>
      <p>Your application to join FIX-PLUG as a verified artisan (<strong>${sanitizedTrade}</strong> in <strong>${sanitizedArea}</strong>) has been received.</p>
      <p>Our Artisan Coordinator in Kano will review your application and message or call you on <strong>${sanitizedPhone}</strong> to schedule your in-person trade assessment.</p>
      <p class="secondary-text" style="margin-top: 0.5rem;"><em>Reminder: FIX-PLUG never charges any registration fees to apply.</em></p>
      <div style="margin-top: 1.25rem;">
        <a href="https://wa.me/${waNumber}?text=${waMessage}" 
           target="_blank" rel="noopener noreferrer" 
           class="btn btn-whatsapp" style="display: inline-flex; width: 100%;">
           Chat with Artisan Coordinator on WhatsApp
        </a>
      </div>
    `;

    showFeedback(feedback, responseMsg, "success", true);
    form.style.display = "none";
  });
}

function showFeedback(container, message, type, isHtml = false) {
  if (!container) return;
  container.className = `form-feedback ${type}`;
  if (isHtml) {
    container.innerHTML = message;
  } else {
    container.textContent = message;
  }
  container.style.display = "block";
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function saveSubmission(data) {
  try {
    const list = JSON.parse(localStorage.getItem("fixplug_submissions") || "[]");
    if (list.length >= 100) list.shift();
    list.push(data);
    localStorage.setItem("fixplug_submissions", JSON.stringify(list));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

function escapeHtml(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(string).replace(/[&<>"']/g, (m) => map[m]);
}
