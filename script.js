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
  var scrollMax = 1;
  var headerLit = false;

  /* Cache the page length instead of reading scrollHeight on every scroll
     event (that read forces a fresh layout on mobile). */
  function measureScroll() {
    scrollMax = Math.max(1, root.scrollHeight - root.clientHeight);
  }
  measureScroll();
  window.addEventListener("resize", measureScroll, { passive: true });
  window.addEventListener("load", measureScroll);
  if ("ResizeObserver" in window) {
    new ResizeObserver(measureScroll).observe(document.body);
  }

  function onScroll() {
    var y = window.scrollY || root.scrollTop;
    var lit = y > 10;
    if (header && lit !== headerLit) {
      headerLit = lit;
      header.classList.toggle("scrolled", lit);
    }

    if (progress) {
      var pct = y > scrollMax ? 1 : y / scrollMax;
      progress.style.transform = "scaleX(" + pct.toFixed(4) + ")";
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

  var sections = $$("section[id]");
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

/* =========================================================
   FX layer — robot cursor, 3D camera, hologram, ambient sound
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  /* Phones / small screens skip the scroll-linked 3D camera work: every
     per-frame style write there costs a repaint on a mid-range GPU. */
  var liteMode = window.innerWidth <= 900 || !finePointer;
  var root = document.documentElement;

  /* ---------- robot cursor ---------- */

  var robot = document.getElementById("cursorRobot");

  if (robot && finePointer && !reduceMotion) {
    root.classList.add("robot-cursor");

    var rx = -100, ry = -100;
    var tx = -100, ty = -100;
    var rafId = null;
    var robotIsActive = false;

    function robotLoop() {
      rx += (tx - rx) * 0.24;
      ry += (ty - ry) * 0.24;
      robot.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      rafId = window.requestAnimationFrame(robotLoop);
    }

    document.addEventListener("pointermove", function (e) {
      tx = e.clientX - 22;
      ty = e.clientY - 22;
      robot.classList.add("visible");

      var target = e.target;
      var isActive = !!(target && target.closest && target.closest("a, button, .project-card, .skill-card, .holo-browser"));
      if (isActive !== robotIsActive) {
        robotIsActive = isActive;
        robot.classList.toggle("is-active", isActive);
      }
    }, { passive: true });

    document.addEventListener("pointerdown", function () {
      robot.classList.add("is-down");
    });
    document.addEventListener("pointerup", function () {
      robot.classList.remove("is-down");
    });
    document.documentElement.addEventListener("mouseleave", function () {
      robot.classList.remove("visible");
    });

    rafId = window.requestAnimationFrame(robotLoop);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        rafId = window.requestAnimationFrame(robotLoop);
      }
    });
  }

  /* ---------- hero editor tilt ---------- */

  var heroWrap = document.querySelector(".hero-card");
  var editor = document.querySelector(".hero-card .editor");

  if (heroWrap && editor && finePointer && !reduceMotion) {
    heroWrap.addEventListener("pointermove", function (e) {
      var r = heroWrap.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      editor.style.transform =
        "rotateX(" + (-py * 8).toFixed(2) + "deg) rotateY(" + (px * 10).toFixed(2) + "deg)";
    });
    heroWrap.addEventListener("pointerleave", function () {
      editor.style.transform = "";
    });
  }

  /* ---------- project cards: tilt + pointer glare ---------- */

  if (finePointer && !reduceMotion) {
    Array.prototype.forEach.call(document.querySelectorAll(".project-card"), function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
        card.classList.add("is-tilting");
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  /* ---------- interactive background squares ---------- */

  var bgGrid = document.getElementById("bgGrid");
  var gridTiles = [];
  var activeGridTile = null;
  var gridCols = 0;
  var gridRows = 0;
  var gridSize = 56;
  var gridGap = 12;
  var gridPad = 16;

  function buildGrid() {
    if (!bgGrid) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var size = w < 640 ? 44 : 56;
    var gap = w < 640 ? 10 : 12;
    var pad = 16;
    var cols = Math.ceil((w - pad * 2 + gap) / (size + gap));
    var rows = Math.ceil((h - pad * 2 + gap) / (size + gap));

    gridSize = size;
    gridGap = gap;
    gridPad = pad;
    gridCols = cols;
    gridRows = rows;
    bgGrid.style.gridTemplateColumns = "repeat(" + cols + ", " + size + "px)";
    bgGrid.style.gridAutoRows = size + "px";
    bgGrid.style.gap = gap + "px";
    bgGrid.style.padding = pad + "px";

    var frag = document.createDocumentFragment();
    for (var i = 0; i < cols * rows; i++) {
      var tile = document.createElement("span");
      tile.className = "bg-sq";
      frag.appendChild(tile);
    }
    bgGrid.innerHTML = "";
    bgGrid.appendChild(frag);
    gridTiles = bgGrid.children;
    activeGridTile = null;
  }

  function lightTile(index) {
    var tile = gridTiles[index];
    if (!tile || tile === activeGridTile) return;
    if (activeGridTile) activeGridTile.classList.remove("lit");
    tile.classList.add("lit");
    activeGridTile = tile;
  }

  function spark(x, y) {
    if (!gridCols) return;
    var r = bgGrid.getBoundingClientRect();
    var innerW = gridCols * gridSize + (gridCols - 1) * gridGap;
    var startX = r.left + gridPad + (r.width - gridPad * 2 - innerW) / 2;
    var startY = r.top + gridPad;
    var col = Math.floor((x - startX) / (gridSize + gridGap));
    var row = Math.floor((y - startY) / (gridSize + gridGap));
    if (col < 0 || row < 0 || col >= gridCols || row >= gridRows) return;
    lightTile(row * gridCols + col);
  }

  buildGrid();

  var gridRaf = false;
  var gridX = 0;
  var gridY = 0;

  function queueSpark(x, y) {
    gridX = x;
    gridY = y;
    if (gridRaf) return;
    gridRaf = true;
    window.requestAnimationFrame(function () {
      gridRaf = false;
      spark(gridX, gridY);
    });
  }

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    queueSpark(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("pointerdown", function (e) {
    spark(e.clientX, e.clientY);
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", function () {
    if (!activeGridTile) return;
    activeGridTile.classList.remove("lit");
    activeGridTile = null;
  });

  var lastGridScroll = -1;

  function scrollSpark() {
    if (finePointer || !gridTiles.length) return;
    var y = window.scrollY || root.scrollTop;
    if (Math.abs(y - lastGridScroll) < 90) return;
    lastGridScroll = y;
    var seed = Math.floor(y / 90) * 37;
    lightTile(seed % gridTiles.length);
  }

  var gridResizeTimer = null;
  window.addEventListener("resize", function () {
    if (gridResizeTimer) window.clearTimeout(gridResizeTimer);
    gridResizeTimer = window.setTimeout(buildGrid, 180);
  });

  /* ---------- scroll-driven camera + hologram ---------- */

  var hero = document.querySelector(".hero");
  var holoSection = document.getElementById("hologram");
  var holoFrame = document.getElementById("holoFrame");
  var holoStage = document.getElementById("holoStage");
  var holoCube = document.getElementById("holoCube");
  var holoScreen = document.querySelector(".holo-screen");
  var holoScans = document.querySelectorAll(".holo-scan");
  var scrollTicking = false;

  function setHoloView() {
    if (!holoCube) return;
    holoCube.style.setProperty("--hl-w", holoCube.clientWidth + "px");
    holoCube.style.setProperty("--hl-h", holoCube.clientHeight + "px");
    if (holoScreen) holoCube.style.setProperty("--holo-view", holoScreen.clientHeight + "px");
  }

  setHoloView();

  function lightUpStage() {
    if (!holoStage || holoStage.classList.contains("is-lit")) return;
    holoStage.classList.add("is-lit");
    holoStage.classList.add("is-scrolling");
  }

  if (holoStage && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        holoStage.classList.toggle("in-view", entry.isIntersecting);
        if (entry.isIntersecting) lightUpStage();
      });
    }, { threshold: 0.12 }).observe(holoStage);
  } else if (holoStage) {
    holoStage.classList.add("in-view");
    lightUpStage();
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function scrollFrame() {
    scrollTicking = false;
    var y = window.scrollY || root.scrollTop;

    if (!liteMode) {
      root.style.setProperty("--sy", String(Math.round(y)));

      if (hero && !reduceMotion && y < 1400) {
        hero.style.transform = "translate3d(0," + (y * 0.055).toFixed(1) + "px,0)";
        hero.style.opacity = String(1 - Math.min(y / 1200, 0.35));
      }

      if (holoSection && holoFrame) {
        var rect = holoSection.getBoundingClientRect();
        var vh = window.innerHeight || root.clientHeight;
        var progress = clamp01((vh - rect.top) / (rect.height + vh));
        var ry = -14 + progress * 28;

        holoFrame.style.setProperty("--hry", ry.toFixed(2) + "deg");

        for (var si = 0; si < holoScans.length; si++) {
          holoScans[si].style.top = (progress * 100).toFixed(1) + "%";
          holoScans[si].style.opacity = progress > 0 && progress < 1 ? "1" : "0";
        }
      }
    }

    if (holoStage && !holoStage.classList.contains("is-lit")) {
      var vh2 = window.innerHeight || root.clientHeight;
      var stageRect = holoStage.getBoundingClientRect();
      if (stageRect.top < vh2 * 0.82 && stageRect.bottom > vh2 * 0.06) lightUpStage();
    }

    scrollSpark();
  }

  function requestScrollFrame() {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(scrollFrame);
    }
  }

  window.addEventListener("scroll", requestScrollFrame, { passive: true });
  window.addEventListener("resize", function () {
    setHoloView();
    requestScrollFrame();
  });
  scrollFrame();

  /* ---------- hologram pointer tilt ---------- */

  if (holoSection && holoFrame && finePointer && !reduceMotion) {
    holoSection.addEventListener("pointermove", function (e) {
      if (holoStage && holoStage.classList.contains("is-dragging")) return;
      var r = holoSection.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      holoFrame.style.setProperty("--hpx", (px * 9).toFixed(2) + "deg");
      holoFrame.style.setProperty("--hpy", (-py * 7).toFixed(2) + "deg");
    });
    holoSection.addEventListener("pointerleave", function () {
      holoFrame.style.setProperty("--hpx", "0deg");
      holoFrame.style.setProperty("--hpy", "0deg");
    });
  }

  /* ---------- hologram drag-to-spin ---------- */

  var holoSpinMs = 44000;
  var holoDragDegPerPx = 0.55;
  var holoDrag = null;

  function getHoloSpin() {
    if (!holoCube || !holoCube.getAnimations) return null;
    var anims = holoCube.getAnimations();
    for (var i = 0; i < anims.length; i++) {
      if (anims[i].animationName === "holoSpin") return anims[i];
    }
    return anims.length ? anims[0] : null;
  }

  function endHoloDrag() {
    var drag = holoDrag;
    holoDrag = null;
    if (!drag) return;
    if (drag.active && holoStage) holoStage.classList.remove("is-dragging");
    if (holoStage) {
      try { holoStage.releasePointerCapture(drag.pointerId); } catch (e) {}
    }
  }

  function onHoloDragEnd(e) {
    if (holoDrag && e.pointerId === holoDrag.pointerId) endHoloDrag();
  }

  if (holoStage && holoCube && !reduceMotion) {
    holoStage.addEventListener("pointerdown", function (e) {
      if (holoDrag) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      var anim = getHoloSpin();
      if (!anim) return;
      holoDrag = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTime: typeof anim.currentTime === "number" ? anim.currentTime : 0,
        anim: anim,
        active: false
      };
    });

    holoStage.addEventListener("pointermove", function (e) {
      if (!holoDrag || e.pointerId !== holoDrag.pointerId) return;
      var dx = e.clientX - holoDrag.startX;
      var dy = e.clientY - holoDrag.startY;

      if (!holoDrag.active) {
        if (Math.abs(dx) < 7 || Math.abs(dx) <= Math.abs(dy)) return;
        holoDrag.active = true;
        holoDrag.startTime = typeof holoDrag.anim.currentTime === "number" ? holoDrag.anim.currentTime : 0;
        holoStage.classList.add("is-dragging");
        // Touch pointers are already implicitly captured by their target. Moving
        // capture to the stage fires lostpointercapture on that target and would
        // end the drag instantly, so only capture mouse and pen explicitly.
        if (e.pointerType !== "touch") {
          try { holoStage.setPointerCapture(e.pointerId); } catch (err) {}
        }
      }

      if (e.cancelable) e.preventDefault();
      var delta = dx * holoDragDegPerPx * (holoSpinMs / 360);
      holoDrag.anim.currentTime = holoDrag.startTime + delta;
    }, { passive: false });

    window.addEventListener("pointerup", onHoloDragEnd, true);
    window.addEventListener("pointercancel", onHoloDragEnd, true);
    holoStage.addEventListener("lostpointercapture", function (e) {
      if (holoDrag && holoDrag.pointerId === e.pointerId) endHoloDrag();
    });
    holoStage.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  /* ---------- ambient sound ---------- */

  var soundBtn = document.getElementById("soundBtn");
  var audioCtx = null;
  var masterGain = null;
  var soundOn = false;

  function buildAudio() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;

    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);

    var filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;
    filter.connect(masterGain);

    [110, 164.81, 220].forEach(function (freq, i) {
      var osc = audioCtx.createOscillator();
      osc.type = i === 2 ? "sine" : "triangle";
      osc.frequency.value = freq;
      osc.detune.value = i * 4;
      var g = audioCtx.createGain();
      g.gain.value = i === 0 ? 0.5 : i === 1 ? 0.34 : 0.22;
      osc.connect(g);
      g.connect(filter);
      osc.start();
    });

    var lfo = audioCtx.createOscillator();
    var lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    return true;
  }

  function setSound(on) {
    if (!audioCtx && !buildAudio()) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    var t = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(t);
    masterGain.gain.setTargetAtTime(on ? 0.05 : 0, t, 0.3);
    soundOn = on;
    if (soundBtn) soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", function () { setSound(!soundOn); });
    document.addEventListener("visibilitychange", function () {
      if (!audioCtx) return;
      if (document.hidden) audioCtx.suspend();
      else if (soundOn) audioCtx.resume();
    });
  }
})();
