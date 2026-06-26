/* ============================================================
   View toggle: Static (original) <-> Motion (outpace-style)
   - Runs in <head> so the .motion class is set before paint
     (no flash of un-hidden content when motion is on).
   - Reveals elements on scroll via IntersectionObserver.
   - Remembers the choice in localStorage across pages.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "yp-view-mode";
  var root = document.documentElement;

  // Resolve all.html relative to motion.js itself, so the link is correct
  // from both top-level pages and nested detail pages.
  var selfSrc = (document.currentScript && document.currentScript.src) || "motion.js";
  var ALL_URL;
  try { ALL_URL = new URL("all.html", selfSrc).href; }
  catch (e) { ALL_URL = "all.html"; }
  // don't show the "all works" button when we're already on that page
  var ON_ALL_PAGE = /(^|\/)all\.html(\?|#|$)/.test(location.pathname + location.search + location.hash);

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // On phones we always run motion (no toggle is shown). On larger screens
  // motion is the default but a saved "static" choice is respected.
  var isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 520px)").matches);
  var mode = isMobile ? "motion" : (read() === "static" ? "static" : "motion");
  if (mode === "motion") root.classList.add("motion");

  // Elements that participate in the entrance choreography.
  var SELECTOR = [
    ".site-banner",
    ".site-header",
    "h2",
    "hr",
    ".card",
    ".cat-index li",
    ".detail-media",
    "#desc",
    ".cat-label",
    ".back-link"
  ].join(", ");

  var observer = null;

  function setStagger() {
    var grids = document.querySelectorAll(".card-grid");
    Array.prototype.forEach.call(grids, function (grid) {
      var cards = grid.querySelectorAll(".card");
      Array.prototype.forEach.call(cards, function (card, i) {
        card.style.setProperty("--i", i % 12);
      });
    });
    var lis = document.querySelectorAll(".cat-index li");
    Array.prototype.forEach.call(lis, function (li, i) {
      li.style.setProperty("--i", i % 12);
    });
  }

  function revealAll() {
    var els = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(els, function (el) {
      el.classList.add("in-view");
    });
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh && r.bottom > 0 && r.left < (window.innerWidth || 9999) && r.right > 0;
  }

  function reveal(el) {
    el.classList.add("in-view");
    if (observer) observer.unobserve(el);
  }

  function startObserving() {
    var els = document.querySelectorAll(SELECTOR);
    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });

    Array.prototype.forEach.call(els, function (el) {
      observer.observe(el);

      // An <img> with no reserved height is 0px tall until it loads, so the
      // observer's first pass sees it "out of view" and never reveals it.
      // Re-check once the image finishes loading.
      var img = (el.tagName === "IMG") ? el
              : (el.querySelector ? el.querySelector("img") : null);
      if (img && !img.complete) {
        img.addEventListener("load", function () {
          if (observer && inViewport(el)) reveal(el);
        }, { once: true });
        img.addEventListener("error", function () {
          if (observer && inViewport(el)) reveal(el);
        }, { once: true });
      }
    });

    // Final safety net: after everything has loaded, reveal anything that is
    // already on screen but somehow still hidden.
    window.addEventListener("load", function () {
      if (!observer) return;
      Array.prototype.forEach.call(document.querySelectorAll(SELECTOR), function (el) {
        if (!el.classList.contains("in-view") && inViewport(el)) reveal(el);
      });
    });
  }

  function stopObserving() {
    if (observer) { observer.disconnect(); observer = null; }
    var els = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(els, function (el) {
      el.classList.remove("in-view");
    });
  }

  function enterMotion() {
    root.classList.add("motion");
    setStagger();
    // double rAF: let the hidden state commit, then reveal in-view items
    requestAnimationFrame(function () {
      requestAnimationFrame(startObserving);
    });
  }

  function exitMotion() {
    stopObserving();
    root.classList.remove("motion");
  }

  // ---- toggle button --------------------------------------------------
  var btn, stateEl;

  function syncButton() {
    if (!btn) return;
    var on = mode === "motion";
    btn.setAttribute("aria-pressed", String(on));
    btn.classList.toggle("is-motion", on);
    stateEl.textContent = on ? "Motion" : "Static";
  }

  function setMode(next) {
    mode = next;
    write(next);
    if (next === "motion") enterMotion(); else exitMotion();
    syncButton();
  }

  function buildButton() {
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "view-toggle";
    btn.innerHTML =
      '<span class="vt-dot" aria-hidden="true"></span>' +
      '<span class="vt-label">View</span>' +
      '<span class="vt-state">Static</span>';
    stateEl = btn.querySelector(".vt-state");
    btn.addEventListener("click", function () {
      setMode(mode === "motion" ? "static" : "motion");
    });
    document.body.appendChild(btn);
    syncButton();
  }

  function buildAllButton() {
    if (ON_ALL_PAGE) return;
    var a = document.createElement("a");
    a.className = "all-works-btn";
    a.href = ALL_URL;
    a.innerHTML =
      '<span class="aw-icon" aria-hidden="true"></span>' +
      '<span class="aw-label">全部作品 All works</span>';
    document.body.appendChild(a);
  }

  function init() {
    if (!isMobile) buildButton();   // no Static/Motion toggle on phones
    buildAllButton();
    if (mode === "motion") enterMotion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
