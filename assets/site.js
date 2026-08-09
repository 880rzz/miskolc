/* =========================================================================
   IWE Miskolc — shared behaviour
   1. GDPR consent  (opt-in, granular, nothing non-essential loads first)
   2. Payback calculator (the "does this pay for itself" panel)
   3. Degree qualifier
   4. Scroll reveal
   No third-party script is loaded before consent. Nothing here phones home.
   ========================================================================= */
(function () {
  "use strict";

  /* --- storage with in-memory fallback (works in sandboxed previews) ---- */
  var mem = {};
  var store = {
    get: function (k) {
      try { return window.localStorage.getItem(k); } catch (e) { return mem[k] || null; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, v); } catch (e) { mem[k] = v; }
    }
  };

  var KEY = "iwe_consent_v1";

  /* ===================================================================== */
  /* 1. GDPR consent                                                        */
  /* ===================================================================== */

  var banner = document.getElementById("consent");

  function readConsent() {
    var raw = store.get(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function saveConsent(obj) {
    obj.ts = new Date().toISOString();
    obj.version = 1;
    store.set(KEY, JSON.stringify(obj));
    applyConsent(obj);
    if (banner) banner.setAttribute("data-open", "false");
  }

  /* Scripts are held in <template data-consent="analytics"> and only injected
     once the matching category is granted. Nothing runs before that. */
  function applyConsent(c) {
    ["analytics", "marketing"].forEach(function (cat) {
      if (!c[cat]) return;
      document.querySelectorAll('template[data-consent="' + cat + '"]').forEach(function (tpl) {
        if (tpl.dataset.loaded === "1") return;
        tpl.dataset.loaded = "1";
        var frag = tpl.content.cloneNode(true);
        frag.querySelectorAll("script").forEach(function (old) {
          var s = document.createElement("script");
          for (var i = 0; i < old.attributes.length; i++) {
            s.setAttribute(old.attributes[i].name, old.attributes[i].value);
          }
          s.textContent = old.textContent;
          old.parentNode.replaceChild(s, old);
        });
        document.body.appendChild(frag);
      });
    });
    document.documentElement.dataset.consent =
      (c.analytics ? "a" : "") + (c.marketing ? "m" : "") || "necessary";
  }

  if (banner) {
    var existing = readConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      window.setTimeout(function () { banner.setAttribute("data-open", "true"); }, 700);
    }

    var acceptAll = document.getElementById("consent-all");
    var rejectAll = document.getElementById("consent-none");
    var saveSel = document.getElementById("consent-save");
    var cbA = document.getElementById("consent-analytics");
    var cbM = document.getElementById("consent-marketing");

    if (acceptAll) acceptAll.addEventListener("click", function () {
      if (cbA) cbA.checked = true;
      if (cbM) cbM.checked = true;
      saveConsent({ necessary: true, analytics: true, marketing: true });
    });
    if (rejectAll) rejectAll.addEventListener("click", function () {
      if (cbA) cbA.checked = false;
      if (cbM) cbM.checked = false;
      saveConsent({ necessary: true, analytics: false, marketing: false });
    });
    if (saveSel) saveSel.addEventListener("click", function () {
      saveConsent({
        necessary: true,
        analytics: !!(cbA && cbA.checked),
        marketing: !!(cbM && cbM.checked)
      });
    });
  }

  /* "Cookie settings" link in the footer re-opens the banner. */
  document.querySelectorAll("[data-open-consent]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var c = readConsent() || { analytics: false, marketing: false };
      var a = document.getElementById("consent-analytics");
      var m = document.getElementById("consent-marketing");
      if (a) a.checked = !!c.analytics;
      if (m) m.checked = !!c.marketing;
      if (banner) banner.setAttribute("data-open", "true");
    });
  });

  /* ===================================================================== */
  /* 2. Payback calculator                                                  */
  /* ===================================================================== */

  var calc = document.getElementById("calc");
  if (calc) {
    var salary = document.getElementById("calc-salary");
    var uplift = document.getElementById("calc-uplift");
    var upliftVal = document.getElementById("calc-uplift-val");
    var outGain = document.getElementById("out-gain");
    var outMonths = document.getElementById("out-months");
    var outFive = document.getElementById("out-five");

    var COST = parseFloat(calc.dataset.cost || "6610");     // 3 × €2,000 + €610
    var locale = calc.dataset.locale || "en";
    var neverTxt = calc.dataset.never || "—";
    var monthsTxt = calc.dataset.months || "months";

    var money = new Intl.NumberFormat(locale === "ar" ? "en" : locale, {
      style: "currency", currency: "EUR", maximumFractionDigits: 0
    });

    function run() {
      var s = Math.max(0, parseFloat(salary.value) || 0);
      var u = parseFloat(uplift.value) || 0;
      if (upliftVal) upliftVal.textContent = "+" + u + "%";

      var gain = s * (u / 100);
      var months = gain > 0 ? Math.ceil(COST / gain) : 0;
      var five = gain * 60 - COST;

      if (outGain) outGain.textContent = money.format(Math.round(gain));
      if (outMonths) outMonths.textContent = months > 0 && months < 600
        ? months + " " + monthsTxt
        : neverTxt;
      if (outFive) outFive.textContent = money.format(Math.round(five));
    }

    [salary, uplift].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", run);
    });
    run();
  }

  /* ===================================================================== */
  /* 3. Degree qualifier                                                    */
  /* ===================================================================== */

  var chips = document.getElementById("degree-chips");
  var verdict = document.getElementById("degree-verdict");
  if (chips && verdict) {
    var vTitle = verdict.querySelector("strong");
    var vBody = verdict.querySelector("p");

    chips.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      chips.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      var state = btn.dataset.state;               // green | amber
      verdict.dataset.state = state;
      vTitle.textContent = verdict.dataset["title" + (state === "green" ? "Green" : "Amber")];
      vBody.textContent = verdict.dataset["body" + (state === "green" ? "Green" : "Amber")];
    });
  }

  /* ===================================================================== */
  /* 4. Scroll reveal                                                       */
  /* ===================================================================== */

  var targets = document.querySelectorAll(".reveal");
  if (targets.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }
})();
