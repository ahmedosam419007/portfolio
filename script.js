/* =========================================================
   Ahmed Osama — Portfolio
   Vanilla JS: no dependencies
   ========================================================= */

(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- current year ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- typewriter ---------- */
  var typedEl = $("#typed");
  if (typedEl) {
    var phrases = [
      "scalable backends.",
      "clean REST APIs.",
      "cloud functions.",
      "AI-powered tools."
    ];

    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      (function type() {
        var phraseIndex = 0;
        var charIndex = 0;
        var deleting = false;

        function tick() {
          var word = phrases[phraseIndex];
          charIndex += deleting ? -1 : 1;
          typedEl.textContent = word.slice(0, charIndex);

          var delay = deleting ? 38 : 82;

          if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1700; // hold the full word
          } else if (deleting && charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 420;
          }
          window.setTimeout(tick, delay);
        }
        tick();
      })();
    }
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
