/* =========================================================
   Ahmed Osam — Portfolio
   Vanilla JS: language toggle (EN/AR + RTL), typing, UI
   ========================================================= */

(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typingToken = 0;

  /* ---------- language (EN / AR + RTL) ---------- */

  var TITLES = {
    en: "Ahmed Osam — Software Engineer · Flutter, Web & AI",
    ar: "أحمد أسام — مهندس برمجيات · فلاتر وويب وذكاء اصطناعي"
  };

  var PHRASES = {
    en: ["Flutter apps.", "web experiences.", "AI-powered tools.", "embedded ideas."],
    ar: ["تطبيقات فلاتر.", "تجارب ويب.", "أدوات ذكاء اصطناعي.", "أنظمة مدمجة."]
  };

  var html = document.documentElement;
  var langBtn = $("#langBtn");

  function currentLang() {
    return html.getAttribute("data-lang") === "ar" ? "ar" : "en";
  }

  function startTyping() {
    var typedEl = $("#typed");
    if (!typedEl) return;

    var phrases = PHRASES[currentLang()];
    var token = ++typingToken; // invalidates any previous typing loop

    if (reduceMotion) {
      typedEl.textContent = phrases[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    (function tick() {
      if (token !== typingToken) return; // language changed, stop this loop

      var word = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      typedEl.textContent = word.slice(0, charIndex);

      var delay = deleting ? 38 : 82;

      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 420;
      }
      window.setTimeout(tick, delay);
    })();
  }

  function applyLang(lang) {
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.title = TITLES[lang];
    if (langBtn) langBtn.textContent = lang === "ar" ? "EN" : "عربي";
    try { localStorage.setItem("portfolio-lang", lang); } catch (e) {}
    startTyping();
  }

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      applyLang(currentLang() === "ar" ? "en" : "ar");
    });
  }

  /* sync button label / title / typing with the language already set in <head> */
  applyLang(currentLang());

  /* ---------- current year ---------- */

  var year = String(new Date().getFullYear());
  ["year", "yearAr"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  /* ---------- header + scroll progress ---------- */

  var header = $("#header");
  var progress = $("#scrollProgress");
  var root = document.documentElement;

  function onScroll() {
    var y = window.scrollY || root.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 10);

    if (progress) {
      var max = root.scrollHeight - root.clientHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */

  var menuBtn = $("#menuBtn");
  var navLinks = $("#navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    $$("#navLinks a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */

  var revealEls = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- active nav link while scrolling ---------- */

  var sections = $$("main section[id]");
  var anchors = $$("#navLinks a");

  if (sections.length && anchors.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        anchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
