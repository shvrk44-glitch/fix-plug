# FIX-PLUG Supabase Backend Setup

This directory contains the production database architecture for the FIX-PLUG platform.

## 🚀 1-Minute Quick Start

1. Create a free project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Open `supabase/schema.sql`, copy all contents, and click **RUN**.
4. That's it! Your tables, security policies (Row Level Security), triggers, and indexes are now live.

## 🔑 Connecting to the Web Frontend

In `js/supabase.js`, configure your project credentials:

```javascript
window.FIX_PLUG_SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY"
};
```

Or simply set them in your browser console:
```javascript
localStorage.setItem("fixplug_supabase_url", "https://YOUR_PROJECT_REF.supabase.co");
localStorage.setItem("fixplug_supabase_anon_key", "YOUR_ANON_KEY");
```

## 🛡️ Security (NDPA 2023 Compliant)
- **Row Level Security (RLS)** is strictly enabled on all tables.
- Public site visitors (`anon` role) can **only INSERT** new booking leads or artisan applications.
- Public visitors cannot read, list, modify, or delete any customer data.
- Only authenticated admins or backend service roles have SELECT and UPDATE privileges.
