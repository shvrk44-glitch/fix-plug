/**
 * FIX-PLUG Internationalization (i18n) Dictionary
 * Languages: English (en), Hausa (ha), Nigerian Pidgin (pi)
 */

const FIX_PLUG_I18N = {
  en: {
    tagline: "Vetted tradespeople. Simple booking. Fair pay.",
    subtagline: "Electrical, plumbing, and handyman support in Kano. We are actively onboarding & vetting tradespeople while taking priority booking requests today.",
    btn_request: "Request a tradesperson",
    btn_join: "Join as an artisan",
    btn_whatsapp: "Message on WhatsApp",
    badge_kano: "Early Access in Kano",
    promise_1_title: "In-Person Vetting Standard",
    promise_1_desc: "Every artisan must pass government ID checks, practical skill tests, and Kano guarantor verification before being approved for dispatch.",
    promise_2_title: "Transparent & Fair",
    promise_2_desc: "Upfront quotes agreed before work starts. Fair pay for the artisan, honest value for the customer, with no surprise add-ons.",
    promise_3_title: "Reliable & Local",
    promise_3_desc: "We cover all areas in Kano—Nassarawa, Fagge, Tarauni, Dala, Gwale, Kano Municipal, and beyond. They turn up when promised.",
    step_1: "Tell us what you need",
    step_1_desc: "Submit your request in 30 seconds via WhatsApp or our simple form. Describe the issue.",
    step_2: "We assign a verified pro",
    step_2_desc: "We match you with a vetted local tradesperson specialized in your exact problem.",
    step_3: "Clear quote & inspection",
    step_3_desc: "The pro arrives, checks the work, and gives you a fair, transparent price before starting.",
    step_4: "Job done right",
    step_4_desc: "You inspect the completed work and pay fair value. If an issue arises, our coordinator team reviews and helps mediate a resolution."
  },
  ha: {
    tagline: "Kwararrun ma'aikatan hannu da aka tantance. Saukin nema. Halaltaccen biya.",
    subtagline: "Kwararrun masu aikin famfo, wutar lantarki, gyare-gyaren gida da masu aikin shara da goge-goge a Kano. Ba zamba, ba tsadar karya, ba guduwa ba tare da an gama aiki ba.",
    btn_request: "Nemi ma'aikaci yanzu",
    btn_join: "Shiga a matsayin mai sana'a",
    btn_whatsapp: "Tuntube mu a WhatsApp",
    badge_kano: "Za a kaddamar a Kano nan kusa",
    promise_1_title: "An Tantance su ido da ido",
    promise_1_desc: "Muna duba katin shaida, jarrabawar aiki a aikace, da kuma shaidar tsaye kafin ma'aikaci ya fita aiki.",
    promise_2_title: "A Bayyane ba boye-boye",
    promise_2_desc: "Farashi a bayyane tun farko. Hakkin mai aiki a bayyane, gaskiya ga mai gida. Babu boyayyun kudi.",
    promise_3_title: "Abin Dogaro a Kano",
    promise_3_desc: "Muna aiki a dukkan yankunan Kano—Nassarawa, Fagge, Tarauni, Dala, Gwale, da kewaye. Suna zuwa a kan lokaci.",
    step_1: "Fada mana abin da kake bukata",
    step_1_desc: "Aika bukatarka cikin dakika 30 ta WhatsApp ko fom dinmu mai sauki.",
    step_2: "Zamu hada ka da gwanin da aka tantance",
    step_2_desc: "Muna binciko kwararren da ya kware a kan matsalar da kake da ita a yankinka.",
    step_3: "Duba aiki da bayanin farashi",
    step_3_desc: "Mai aiki zai duba matsalar ya baka ingantaccen farashi a bayyane kafin a fara aiki.",
    step_4: "Aiki ya kammala cikin aminci",
    step_4_desc: "Zaka duba aiki ka biya kudin da aka dace. Idan akwai matsala, muna tare da kai."
  },
  pi: {
    tagline: "Verified artisan people. Easy booking. Correct pay.",
    subtagline: "Verified plumber, electrician, and handyman support for Kano. We dey onboard and vet artisans right now while we dey take priority booking requests today.",
    btn_request: "Request artisan now",
    btn_join: "Register as artisan",
    btn_whatsapp: "Chat on WhatsApp",
    badge_kano: "Early Access for Kano",
    promise_1_title: "Face-to-Face Vetting Standard",
    promise_1_desc: "Every artisan must pass government ID check, practical skill test, and Kano guarantor verification before dem go fit get dispatch.",
    promise_2_title: "Clean & Fair Price",
    promise_2_desc: "Clear upfront quote agreed before work start. Correct pay for artisan, honest value for customer, no surprise addition.",
    promise_3_title: "Trustworthy Kano Artisans",
    promise_3_desc: "We cover all areas for Kano—Nassarawa, Fagge, Tarauni, Dala, Gwale, Municipal, and everywhere. Dem dey turn up sharp sharp.",
    step_1: "Tell us wetin spoil",
    step_1_desc: "Send your request within 30 seconds on WhatsApp or our simple form. Tell us wetin happen.",
    step_2: "We assign a verified pro",
    step_2_desc: "We connect you sharp sharp with a vetted artisan specialized in that exact trade.",
    step_3: "Clear inspection & quote",
    step_3_desc: "The pro go arrive, inspect the job, and give you honest, transparent price before starting.",
    step_4: "Job done well-well",
    step_4_desc: "You inspect the finished job and pay fair value. If anything no clear, FIX-PLUG team dey with you."
  }
};

if (typeof window !== "undefined") {
  window.FIX_PLUG_I18N = FIX_PLUG_I18N;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = FIX_PLUG_I18N;
}
