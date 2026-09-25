/**
 * Interactive Bilingual Engine (English & Bangla)
 * With Fully Draggable Floating Button & Global Instant Toggle
 */

const I18N_DATA = {
  en: {
    nav_work: "Work",
    nav_case_studies: "Case Studies",
    nav_reviews: "Reviews",
    nav_pricing: "Pricing",
    nav_blog: "Blog",
    nav_careers: "Careers",
    nav_personal_brand: "Personal Branding",
    btn_talk: "Let's Talk!",
    btn_talk_sub: "Book a Strategy Call",

    hero_trusted: "Trusted by",
    hero_served: "Served 50+",
    hero_yc: "YC Companies",
    hero_creator: "Creator of",
    hero_videos: "Videos",
    hero_title: '<span class="hero-line-1">Frames That</span> <span class="hero-line-2">Tell Stories.</span>',
    hero_cta: "Get your Product Video",
    hero_get_yours: "Get Yours Next",
    reviews_badge: "50+ founder reviews",

    proof_1: "The fastest ‘yes’ we’ve ever seen from prospects.",
    proof_2: "They turned complexity into clarity fast.",
    proof_3: "MZ Media was Too fast and efficient",
    proof_4: "Honestly the first video team that didn't make me chase them for updates.",
    proof_5: "Felt like we hired in-house, not an agency. Big difference.",
    proof_6: "Top-tier work, delivered faster than anyone else we've tried.",
    proof_7: "We've tried a bunch of video teams. None come close to them.",
    proof_8: "Sent them a rough idea. They came back with something we couldn't have imagined.",

    engine_badge: "The 3-Pillar Creative Engine",
    engine_title: "Engineered for Maximum Retention & Conversion",
    engine_sub: "Every frame is calibrated using behavioral psychology, dynamic kinetic motion, and high-impact visual hooks that convert passive viewers into buyers.",
    
    card1_tag: "01 • FIRST 3 SECONDS",
    card1_badge: "HIGH INTENT",
    card1_title: "Kinetic Hook Architecture",
    card1_desc: "We engineer rapid visual pattern interrupts, dynamic 3D typography, and punchy spatial sound design that command instant focus and stop the scroll in under 3 seconds.",
    card1_pill1: "⚡ 3s Pattern Interrupt",
    card1_pill2: "🎯 Zero Drop-Off",
    card1_pill3: "🔊 Binaural SFX",

    card2_tag: "02 • RETENTION ENGINE",
    card2_badge: "PSYCHOLOGY",
    card2_title: "Cognitive Story Structure",
    card2_desc: "We distill complex technical features into intuitive, emotionally engaging narratives that keep audiences captivated from opening frame right through to the CTA.",
    card2_pill1: "🧠 Cognitive Flow",
    card2_pill2: "📊 High Watch-Time",
    card2_pill3: "✨ Zero Jargon",

    card3_tag: "03 • CONVERSION ACCELERATION",
    card3_badge: "DIRECT ROI",
    card3_title: "Action-Driven Conversions",
    card3_desc: "Every sound cue, camera sweep, and callout is built to trigger buyer action—motivating prospects to book sales demos, start free trials, or share with executives.",
    card3_pill1: "💰 3.8x Avg ROAS",
    card3_pill2: "🚀 Multi-Format Ready",
    card3_pill3: "🤝 High-Intent Leads",

    work_title: "The videos we ship.",
    work_sub: "What are you launching?",
    tab_product: "Product Release",
    tab_feature: "Feature Launch",
    tab_investor: "Investor & Pitch",
    tab_ads: "High-Converting Ads",

    faq_title: "Frequently Asked Questions",
    faq_1_q: "How fast can you deliver?",
    faq_1_a: "The turnaround time is roughly 2 weeks. We have 50+ in-house editors across dedicated teams, so we don't rely on freelancers that slow you down.",
    faq_2_q: "Do you work with early-stage startups or only established companies?",
    faq_2_a: "Both. Whether you're pre-launch or scaling past Series B, we've worked with companies at every stage.",
    faq_3_q: "Who owns the final files?",
    faq_3_a: "You own everything the moment we deliver, from the source files and raw exports to every hook and cutdown.",
    faq_4_q: "How many revisions do I get?",
    faq_4_a: "We offer revisions until you're happy with the result. Most clients wrap it up in one or two rounds, but there's no hard limit.",
    faq_5_q: "Do you work with non-YC startups?",
    faq_5_a: "Yes. YC is just where a lot of our roster happens to come from. If you're building SaaS and you have a product worth showing, we're in.",

    cta_title: "let's build yours",
    cta_sub: "Answer a few quick questions and we'll lock you in.",
    footer_switch: "SaaS Video",
    footer_to: "To Personal Branding"
  },
  bn: {
    nav_work: "কাজসমূহ",
    nav_case_studies: "কেস স্টাডি",
    nav_reviews: "রিভিউ",
    nav_pricing: "প্রাইসিং",
    nav_blog: "ব্লগ",
    nav_careers: "ক্যারিয়ার",
    nav_personal_brand: "পার্সোনাল ব্র্যান্ডিং",
    btn_talk: "কথা বলুন!",
    btn_talk_sub: "একটি মিটিং বুক করুন",

    hero_trusted: "যাঁদের আস্থা অর্জন করেছি",
    hero_served: "কাজ করেছি ৫০+",
    hero_yc: "YC স্টার্টআপের সাথে",
    hero_creator: "নির্মাতা",
    hero_videos: "ভিডিও",
    hero_title: '<span class="hero-line-1">ফ্রেমে ধরা</span> <span class="hero-line-2">গল্পগুলো।</span>',
    hero_cta: "আপনার প্রোডাক্ট ভিডিও তৈরি করুন",
    hero_get_yours: "পরেরটি আপনার হোক",
    reviews_badge: "৫০+ ক্লায়েন্ট রিভিউ",

    proof_1: "প্রস্পেক্টদের কাছ থেকে এত দ্রুত 'হ্যাঁ' আমরা আগে কখনো পাইনি।",
    proof_2: "জটিল বিষয়গুলোকে তারা খুব দ্রুত সহজ ও চমৎকার করে তুলেছে।",
    proof_3: "কাজের গতি ও কোয়ালিটি ছিল অবিশ্বাস্য রকম ফাস্ট ও নিখুঁত।",
    proof_4: "সত্যি বলতে এরাই প্রথম টিম যাদের আপডেটের জন্য পেছনে ছুটতে হয়নি।",
    proof_5: "মনে হয়েছে ইন-হাউস টিম নিয়োগ দিয়েছি, কোনো সাধারণ এজেন্সি নয়।",
    proof_6: "সেরা মানের কাজ, ডেলিভারির গতি অন্যদের চেয়ে অনেক বেশি।",
    proof_7: "আমরা অনেক ভিডিও টিমের সাথে কাজ করেছি, এদের ধারেকাছে কেউ নেই।",
    proof_8: "আমরা শুধু প্রাথমিক আইডিয়া দিয়েছিলাম, তারা অবিশ্বাস্য আউটপুট তৈরি করেছে।",

    engine_badge: "৩-ধাপের ক্রিয়েটিভ ইঞ্জিন",
    engine_title: "সর্বোচ্চ রিটেনশন ও কনভার্শনের জন্য নির্মিত",
    engine_sub: "প্রতিটি ফ্রেম নিখুঁতভাবে তৈরি—আচরণগত সাইকোলজি, ডায়নামিক মোশন ও শক্তিশালী ভিজ্যুয়াল হুকের সমন্বয়ে, যা দর্শককে সরাসরি কাস্টমারে রূপান্তর করে।",
    
    card1_tag: "০১ • প্রথম ৩ সেকেন্ড",
    card1_badge: "হাই ইনটেন্ট",
    card1_title: "কাইনেটিক হুক আর্কিটেকচার",
    card1_desc: "প্রথম ৩ সেকেন্ডেই স্ক্রোল থামানোর জন্য আমরা দ্রুত ভিজ্যুয়াল প্যাটার্ন ইন্টারাপ্ট, ৩ডি টাইপোগ্রাফি এবং পাঞ্চি সাউন্ড ডিজাইন ব্যবহার করি।",
    card1_pill1: "⚡ ৩ সে. প্যাটার্ন ইন্টারাপ্ট",
    card1_pill2: "🎯 জিরো ড্রপ-অফ",
    card1_pill3: "🔊 বাইনরল সাউন্ড",

    card2_tag: "০২ • রিটেনশন ইঞ্জিন",
    card2_badge: "সাইকোলজি",
    card2_title: "কগনিটিভ স্টোরি স্ট্রাকচার",
    card2_desc: "জটিল ফিচারগুলোকে আমরা সহজ ও আকর্ষণীয় গল্পে রূপান্তর করি, যা দর্শকদের প্রথম ফ্রেম থেকে শেষ মুহূর্ত পর্যন্ত মুগ্ধ করে রাখে।",
    card2_pill1: "🧠 সহজ সাবলীল ধারা",
    card2_pill2: "📊 সর্বোচ্চ ওয়াচ-টাইম",
    card2_pill3: "✨ জটিলতামুক্ত",

    card3_tag: "০৩ • কনভার্শন অ্যাকসিলারেশন",
    card3_badge: "ডিরেক্ট আরওআই",
    card3_title: "অ্যাকশন-ড্রাইভেন কনভার্শন",
    card3_desc: "প্রতিটি সাউন্ড কিউ, ক্যামেরা সুইপ এবং কলআউট এমনভাবে তৈরি যাতে দর্শক সরাসরি সেলস ডেমো বুক করে, ফ্রি ট্রায়াল শুরু করে বা ডিসিশন মেকারকে ফরোয়ার্ড করে।",
    card3_pill1: "💰 ৩.৮ গুণ আরওএএস",
    card3_pill2: "🚀 মাল্টি-ফরম্যাট রেডি",
    card3_pill3: "🤝 প্রিমিয়াম লিডস",

    work_title: "আমরা যে ধরনের ভিডিও বানাই",
    work_sub: "আপনি কী লঞ্চ করতে যাচ্ছেন?",
    tab_product: "প্রোডাক্ট রিলিজ",
    tab_feature: "ফিচার লঞ্চ",
    tab_investor: "ইনভেস্টর ও পিচ",
    tab_ads: "হাই-কনভার্টিং বিজ্ঞাপন",

    faq_title: "সাধারণ জিজ্ঞাসাসমূহ (FAQ)",
    faq_1_q: "কত দ্রুত ডেলিভারি দেওয়া সম্ভব?",
    faq_1_a: "আমাদের সাধারণ ডেলিভারি সময় প্রায় ২ সপ্তাহ। আমাদের সম্পূর্ণ ইন-হাউস টিম রয়েছে, তাই কোনো ফ্রিল্যান্সারের ওপর নির্ভর করে সময় নষ্ট হয় না।",
    faq_2_q: "আপনারা কি আর্লি-স্টেজ স্টার্টআপের সাথে কাজ করেন নাকি শুধু প্রতিষ্ঠিত কোম্পানির সাথে?",
    faq_2_a: "উভয়ের সাথেই। আপনি প্রি-লঞ্চ স্টেজে থাকুন কিংবা সিরিজ বি স্কেলিং করুন—আমরা প্রতিটি স্টেজের কোম্পানির সাথেই সফলভাবে কাজ করে আসছি।",
    faq_3_q: "ফাইনাল ফাইলের মালিকানা কার থাকবে?",
    faq_3_a: "ডেলিভারি পাওয়ার সাথে সাথেই সমস্ত সোর্স ফাইল, র এক্সপোর্ট এবং প্রতিটা হুকের শতভাগ মালিকানা আপনার থাকবে।",
    faq_4_q: "কতবার রিভিশন দেওয়া যাবে?",
    faq_4_a: "যতক্ষণ না আপনি শতভাগ সন্তুষ্ট হচ্ছেন, আমরা রিভিশন প্রদান করি। কোনো বাধা-ধরা লিমিট নেই।",
    faq_5_q: "আপনারা কি নন-ওয়াইসি স্টার্টআপের সাথেও কাজ করেন?",
    faq_5_a: "অবশ্যই। আপনার যদি চমৎকার কোনো প্রোডাক্ট বা সফটওয়্যার থাকে যা বিশ্বকে দেখানো প্রয়োজন, তবে আমরা একসাথে কাজ করতে সম্পূর্ণ প্রস্তুত।",

    cta_title: "চলুন আপনারটি তৈরি করি",
    cta_sub: "কয়েকটি সহজ প্রশ্নের উত্তর দিন, আমরা দ্রুত আপনার প্রজেক্ট শুরু করব।",
    footer_switch: "SaaS ভিডিও",
    footer_to: "পার্সোনাল ব্র্যান্ডিং-এ যান"
  }
};

let currentLang = localStorage.getItem('site_lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const dict = I18N_DATA[lang] || I18N_DATA.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Update all switcher buttons
  document.querySelectorAll('.lang-opt').forEach(opt => {
    if (opt.getAttribute('data-lang') === lang) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Update floating label
  const floatingLabel = document.querySelector('#floating-current-lang');
  if (floatingLabel) {
    if (lang === 'en') {
      floatingLabel.textContent = 'English';
      floatingLabel.style.fontFamily = "'Coolvetica', sans-serif";
    } else {
      floatingLabel.textContent = '\u09AC\u09BE\u0982\u09B2\u09BE';
      floatingLabel.style.fontFamily = "'Hind Siliguri', sans-serif";
    }
  }
}

function toggleLanguage() {
  const next = currentLang === 'en' ? 'bn' : 'en';
  applyLanguage(next);
}

// Global Click Delegation (Guaranteeing 100% reliable trigger)
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.lang-switcher-btn, .lang-toggle-trigger');
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    toggleLanguage();
  }
}, true);

// Initialize Draggable Floating Widget
function initDraggableWidget() {
  const widget = document.getElementById('draggable-lang-widget');
  if (!widget) return;

  let isDragging = false;
  let startX, startY;
  let initialLeft, initialTop;
  let hasMoved = false;

  // Mouse drag events
  widget.addEventListener('mousedown', function (e) {
    // Only drag with left click
    if (e.button !== 0) return;

    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;

    const rect = widget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    widget.style.transition = 'none';
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    widget.style.left = initialLeft + 'px';
    widget.style.top = initialTop + 'px';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMoved = true;
      widget.classList.add('is-dragging');
    }

    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Viewport bounds clamp
    const maxLeft = window.innerWidth - widget.offsetWidth - 10;
    const maxTop = window.innerHeight - widget.offsetHeight - 10;

    newLeft = Math.max(10, Math.min(newLeft, maxLeft));
    newTop = Math.max(10, Math.min(newTop, maxTop));

    widget.style.left = newLeft + 'px';
    widget.style.top = newTop + 'px';
  }

  function onMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    widget.classList.remove('is-dragging');
    widget.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    // If it was just a click without dragging, toggle language
    if (!hasMoved) {
      toggleLanguage();
    }
  }

  // Touch drag events (for Mobile / Tablets)
  widget.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    isDragging = true;
    hasMoved = false;
    startX = touch.clientX;
    startY = touch.clientY;

    const rect = widget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    widget.style.transition = 'none';
    widget.style.bottom = 'auto';
    widget.style.right = 'auto';
    widget.style.left = initialLeft + 'px';
    widget.style.top = initialTop + 'px';
  }, { passive: true });

  widget.addEventListener('touchmove', function (e) {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMoved = true;
      widget.classList.add('is-dragging');
    }

    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    const maxLeft = window.innerWidth - widget.offsetWidth - 10;
    const maxTop = window.innerHeight - widget.offsetHeight - 10;

    newLeft = Math.max(10, Math.min(newLeft, maxLeft));
    newTop = Math.max(10, Math.min(newTop, maxTop));

    widget.style.left = newLeft + 'px';
    widget.style.top = newTop + 'px';
  }, { passive: true });

  widget.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;
    widget.classList.remove('is-dragging');
    widget.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    if (!hasMoved) {
      toggleLanguage();
    }
  });
}

// Immediate run
function init() {
  applyLanguage(currentLang);
  initDraggableWidget();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
