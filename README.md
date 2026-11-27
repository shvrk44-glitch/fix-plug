# FIX-PLUG Website (Phase 1 Launch)

> **Verified tradespeople. Simple booking. Fair pay.**  
> Built strictly according to the **FIX-PLUG Website PRD v1.0 (20 November 2026)**.

---

## 1. Project Overview & Architecture

FIX-PLUG is built as a hyper-fast, zero-dependency, static and lightly-dynamic website designed from the ground up for the Kano market.

- **Payload budget:** < 40 KB total transferred CSS/JS/HTML (well below the 1 MB PRD limit).
- **Network target:** Fast LCP (< 1.2s) even on low-to-mid-range smartphones on 3G/4G in Kano.
- **Mobile First:** Designed for 360 px viewports with minimum 44 px touch targets.
- **Accessibility:** 100% WCAG AA contrast compliance.

---

## 2. Brand & Design System Implementation

| Element | Specification | Code Implementation |
| :--- | :--- | :--- |
| **Page Background** | Cream `#F3EBE0` | `--color-cream: #F3EBE0;` |
| **Text & Dark Surfaces** | Near-black `#0A0A0A` | `--color-near-black: #0A0A0A;` |
| **Buttons & Primary Accents** | Copper `#B6855A` | `--color-copper: #B6855A;` |
| **Secondary Accents / Borders** | Slate `#8192A2` | `--color-slate: #8192A2;` |
| **Contrast Enforcement** | Never copper/slate body text on cream. Near-black text on copper buttons. | `.btn-copper { background: #B6855A; color: #0A0A0A; }` |
| **Typography** | Inter, system font fallback | `'Inter', system-ui, -apple-system, sans-serif` |
| **Logo** | Horizontal with intersecting wrench & screwdriver 'X' | Clean vector SVG in `assets/logo.svg` |

---

## 3. Directory & Page Structure

```
fix-plug/
├── index.html                  # 1. Homepage (10-second value prop, promises, 4 steps, dual CTAs)
├── customers/index.html        # 2. For Customers (Trade coverage, what happens next, FAQ, request form)
├── artisans/index.html         # 3. For Artisans (Offer, verification gates, commission policy, intake form)
├── trust/index.html            # 4. Trust & Verification (The 5 Verification Gates & dispute resolution)
├── about/index.html            # 5. About (Why Kano, the domestic service gap, team, core values)
├── contact/index.html          # 6. Contact (WhatsApp business direct, email, Google Business, partners)
├── privacy/index.html          # 7. Privacy Notice (NDPA 2023 compliance & Phase 1 service terms)
├── css/
│   ├── style.css               # Core layout, variables, responsive typography, header/footer
│   └── components.css          # Form inputs, buttons, cards, mobile drawer, WhatsApp float
├── js/
│   ├── main.js                 # Global drawer, FAQ accordions, WhatsApp link generator
│   ├── forms.js                # Customer & artisan form handling, honeypot spam protection, local store
│   └── i18n.js                 # English and Hausa translation strings dictionary
├── assets/
│   ├── logo.svg                # Brand logo with wrench & screwdriver 'X'
│   ├── favicon.svg             # Favicon badge
│   └── og-image.svg            # 1200x630 share card for WhatsApp, LinkedIn, X
├── sitemap.xml                 # XML sitemap for Google Search Console
├── robots.txt                  # Search engine crawl directives
├── server.js                   # Local zero-dependency development server
└── README.md                   # This documentation
```

---

## 4. How to Run Locally

You can preview the website locally using standard Node.js without installing any dependencies:

```bash
# Navigate to the project directory
cd fix-plug

# Start the built-in development server
node server.js
```

Open your browser to: **`http://localhost:3000`**

---

## 5. Deployment Options (Zero Cost, 100% Free SSL)

This site requires no compilation or build tools. Deploy it directly from the repository using either Netlify or GitHub Pages.

### Option A: Netlify (Recommended)
1. Sign in to [Netlify](https://app.netlify.com/) and create a new site by importing this GitHub repository.
2. Set the build command to `None` and the publish directory to `.` (the repository root).
3. Deploy the site. To use a custom domain, add it in the site's **Domain management** settings and configure the DNS records as Netlify specifies.

### Option B: GitHub Pages
1. In the repository, open **Settings** > **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**, then choose the `main` branch and `/ (root)` folder; click **Save**.
3. Wait for the deployment to finish. The site will be available at `https://shvrk44-glitch.github.io/fix-plug/`.
4. For a custom domain, enter it in the **Custom domain** field in Pages settings and configure the DNS records at your domain provider according to GitHub's instructions.

---

## 6. How the Comms & Marketing Co-Founder Can Edit Content

- **Updating the WhatsApp Business Number:**
  Open `js/main.js` and edit `whatsappNumber`:
  ```javascript
  const FIX_PLUG_CONFIG = {
    whatsappNumber: "234803XXXXXXX", // Replace with official SIM
  ...
  ```
  Every WhatsApp button on all pages automatically uses this number!

- **Editing Hausa & English Text:**
  Open `js/i18n.js` to refine or expand native Hausa translations.

- **Editing Page Copy:**
  Each page is written in clean, semantic HTML. Text can be modified directly with any code editor or web CMS.

---

## 7. Data Protection & NDPA 2023 Compliance
- Forms collect only necessary contact fields (Name, Phone, Area in Kano, Trade, Issue Description).
- **Zero ID uploads:** As required by Section 8 of the PRD, no ID images or ID numbers are collected on the public website. Document checks happen physically in person.
- Honeypot fields (`company_fax_code`) silently intercept bot spam without adding user friction (no annoying CAPTCHAs).
- Consent checkboxes explicitly link to the `/privacy/` policy.
