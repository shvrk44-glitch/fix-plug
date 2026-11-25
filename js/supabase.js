/**
 * FIX-PLUG Supabase Backend Integration Client
 * Provides persistent database operations for Customer Requests, Artisan Applications & Contact Inquiries
 * Includes transparent offline / fallback buffering to prevent lead loss.
 */

const FIX_PLUG_SUPABASE_CONFIG = window.FIX_PLUG_SUPABASE_CONFIG || {
  url: localStorage.getItem("fixplug_supabase_url") || "",
  anonKey: localStorage.getItem("fixplug_supabase_anon_key") || ""
};

class FixPlugBackend {
  constructor(config) {
    this.url = (config && config.url) ? config.url.replace(/\/$/, "") : "";
    this.anonKey = (config && config.anonKey) ? config.anonKey : "";
  }

  isConfigured() {
    return Boolean(this.url && this.anonKey && this.url.includes("supabase.co"));
  }

  /**
   * Universal Supabase REST insert helper (Direct REST API, zero external npm bundle dependency)
   */
  async insert(table, record) {
    // Always buffer to local storage first (NDPA-compliant audit trail & offline safety)
    this.bufferLocally(table, record);

    if (!this.isConfigured()) {
      console.info(`[FIX-PLUG Backend] Supabase not yet configured. Record buffered in local store for table: ${table}.`);
      return { success: true, offline: true, data: record };
    }

    try {
      const endpoint = `${this.url}/rest/v1/${table}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": this.anonKey,
          "Authorization": `Bearer ${this.anonKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Supabase Error] ${table} insert failed (${response.status}):`, errorText);
        return { success: false, error: errorText, offline: true };
      }

      console.info(`[FIX-PLUG Backend] Successfully persisted record to Supabase table: ${table}`);
      return { success: true, offline: false };
    } catch (err) {
      console.warn(`[FIX-PLUG Backend Network Alert] Could not reach Supabase, data preserved locally:`, err);
      return { success: true, offline: true, error: err.message };
    }
  }

  bufferLocally(table, record) {
    try {
      const key = `fixplug_buffer_${table}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ ...record, _buffered_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.warn("Local storage write failed:", e);
    }
  }

  async submitCustomerRequest(data) {
    const payload = {
      name: data.name,
      phone: data.phone,
      area: data.area,
      trade: data.trade,
      description: data.description,
      status: "pending",
      source: "web_request_form"
    };
    return this.insert("customer_requests", payload);
  }

  async submitArtisanApplication(data) {
    const payload = {
      name: data.name,
      phone: data.phone,
      trade: data.trade,
      area: data.area,
      experience: data.experience,
      certification: data.certification || "",
      status: "under_review"
    };
    return this.insert("artisan_applications", payload);
  }

  async submitContactInquiry(data) {
    const payload = {
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      category: data.category || "general",
      message: data.message
    };
    return this.insert("contact_inquiries", payload);
  }
}

const fixPlugBackend = new FixPlugBackend(FIX_PLUG_SUPABASE_CONFIG);

if (typeof window !== "undefined") {
  window.FixPlugBackend = FixPlugBackend;
  window.fixPlugBackend = fixPlugBackend;
}
