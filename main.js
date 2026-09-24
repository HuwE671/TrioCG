/* Trio Capital Group — site behaviour */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  /* ---------- Navigation ---------- */
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  function closeNav() {
    body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && links) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (body.classList.contains("nav-open") && !links.contains(e.target) && e.target !== toggle) closeNav();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1080) closeNav(); });
  }

  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Home hero: one orchestrated load ---------- */
  var hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add("is-ready"); }); });

  /* ---------- Footer year ---------- */
  var yr = document.querySelectorAll("[data-year]");
  for (var y = 0; y < yr.length; y++) yr[y].textContent = new Date().getFullYear();

  /* ---------- Fit checker ---------- */
  var checker = document.getElementById("fit-checker");
  if (checker) {
    var qs = checker.querySelectorAll(".q");
    var bars = checker.querySelectorAll(".checker-progress span");
    var back = checker.querySelector(".checker-back");
    var nextBtn = checker.querySelector(".checker-next");
    var nav = checker.querySelector(".checker-nav");
    var result = checker.querySelector(".result");
    var idx = 0;

    function show(i) {
      idx = i;
      for (var n = 0; n < qs.length; n++) qs[n].hidden = n !== i;
      for (var b = 0; b < bars.length; b++) bars[b].classList.toggle("done", b < i);
      back.hidden = i === 0;
      nextBtn.textContent = i === qs.length - 1 ? "See my result" : "Next question";
      nextBtn.disabled = !qs[i].querySelector("input:checked");
    }
    function val(name) {
      var el = checker.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : "";
    }
    checker.addEventListener("change", function (e) {
      if (e.target.matches('.q input')) {
        nextBtn.disabled = false;
      }
    });
    back.addEventListener("click", function () { if (idx > 0) show(idx - 1); });
    nextBtn.addEventListener("click", function () {
      if (!qs[idx].querySelector("input:checked")) return;
      if (idx < qs.length - 1) { show(idx + 1); qs[idx].querySelector("input").focus(); }
      else finish();
    });

    function finish() {
      var a = { turnover: val("turnover"), profit: val("profit"), team: val("team"), location: val("location"), timing: val("timing") };
      var score = 0, notes = [];
      var add = function (cls, text, pts) { notes.push({ c: cls, t: text }); score += pts; };

      if (a.turnover === "over-2m") add("maybe", "Turnover above £2m is larger than our usual focus, but we'd still like to hear about it.", 1);
      else if (a.turnover === "under-250k") add("maybe", "Smaller businesses can be a fit when profit and the team are strong.", 1);
      else add("yes", "Your turnover sits within the range we focus on (up to £2m).", 2);

      if (a.profit === "yes") add("yes", "Consistent profit over three years is exactly what we look for.", 2);
      else if (a.profit === "mostly") add("maybe", "One weaker year is common. We'll want to understand what happened.", 1);
      else add("no", "We buy profitable businesses, so this may be one to revisit once profits are steady.", 0);

      if (a.team === "management") add("yes", "A management team already in place makes for a smooth handover.", 2);
      else if (a.team === "me-team") add("yes", "A capable team around you is a strong starting point. We can plan the handover together.", 2);
      else add("maybe", "If the business depends mainly on you, we'd plan a longer handover period to protect its value.", 1);

      if (a.location === "hampshire" || a.location === "nearby") add("yes", "You're within the area we cover.", 2);
      else add("no", "We focus on Hampshire and the surrounding counties, though we're open to a conversation.", 0);

      if (a.timing === "exploring") add("maybe", "Exploring early is sensible. The earlier we talk, the more options you have.", 1);
      else add("yes", "Your timing works well for us.", 2);

      var verdict, lead;
      var hardNo = a.profit === "no";
      if (!hardNo && score >= 9) {
        verdict = "Your business looks like a strong fit.";
        lead = "Based on your answers, it's worth having a confidential conversation. There's no obligation, and nothing is shared without your say-so.";
      } else if (!hardNo && score >= 6) {
        verdict = "It's worth a conversation.";
        lead = "Some of your answers sit outside our core criteria, but many businesses we speak to start here. A short call will tell us both quickly.";
      } else {
        verdict = "It may not be the right time yet.";
        lead = "That doesn't rule anything out. We're happy to talk through what would make your business ready to sell, whenever that might be.";
      }
      result.querySelector(".result-verdict").textContent = verdict;
      result.querySelector(".result-lead").textContent = lead;
      var ul = result.querySelector(".result-notes");
      ul.innerHTML = "";
      notes.forEach(function (n) { var li = document.createElement("li"); li.className = n.c; li.textContent = n.t; ul.appendChild(li); });

      /* Sale-readiness nudge: shown when answers point to gaps our business support can close */
      var ready = result.querySelector(".result-ready");
      if (ready) {
        var gaps = [];
        if (a.profit !== "yes") gaps.push("steadier, clearer financial reporting");
        if (a.team !== "management" && a.team !== "me-team") gaps.push("reducing how much the business relies on you");
        if (a.timing === "exploring" || a.turnover === "under-250k") gaps.push("getting processes and systems in place early");
        var showReady = gaps.length > 0 || score < 9;
        if (showReady) {
          ready.querySelector(".result-ready-text").textContent = gaps.length
            ? "Based on your answers, the biggest gains are likely to come from " + (gaps.length > 1 ? gaps.slice(0, -1).join(", ") + " and " + gaps[gaps.length - 1] : gaps[0]) + ". Our Sale-Ready Review looks at exactly these areas, and there's no obligation to sell."
            : "Our Sale-Ready Review looks at your business through a buyer's eyes and shows what to tackle first. There's no obligation to sell.";
        }
        ready.hidden = !showReady;
      }

      var params = new URLSearchParams({ turnover: a.turnover, profit: a.profit, team: a.team, location: a.location, timing: a.timing, fit: verdict });
      result.querySelector(".result-cta").href = "/contact?" + params.toString();

      for (var n = 0; n < qs.length; n++) qs[n].hidden = true;
      for (var b = 0; b < bars.length; b++) bars[b].classList.add("done");
      nav.hidden = true;
      result.hidden = false;
      result.querySelector(".result-verdict").focus();
    }
    checker.querySelector(".checker-restart").addEventListener("click", function () {
      var inputs = checker.querySelectorAll(".q input");
      for (var i = 0; i < inputs.length; i++) inputs[i].checked = false;
      result.hidden = true; nav.hidden = false; show(0);
    });
    show(0);
  }

  /* ---------- Multi-step enquiry form ---------- */
  var form = document.querySelector("form[data-multistep]");
  if (form) {
    var steps = form.querySelectorAll(".form-step");
    var stepper = document.querySelectorAll(".stepper li");
    var cur = 0;

    function goTo(i, focus) {
      cur = i;
      for (var s = 0; s < steps.length; s++) steps[s].hidden = s !== i;
      for (var t = 0; t < stepper.length; t++) {
        stepper[t].classList.toggle("active", t === i);
        stepper[t].classList.toggle("done", t < i);
        if (t === i) stepper[t].setAttribute("aria-current", "step"); else stepper[t].removeAttribute("aria-current");
      }
      if (focus) {
        var h = steps[i].querySelector("h2");
        if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
        var top = form.getBoundingClientRect().top + window.scrollY - 110;
        if (window.scrollY > top) window.scrollTo(0, top);
      }
    }

    function validField(el) {
      var wrap = el.closest(".field");
      var ok = true;
      if (el.type === "checkbox") ok = !el.required || el.checked;
      else if (el.required && !el.value.trim()) ok = false;
      else if (el.type === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) ok = false;
      else if (el.type === "tel" && el.value && el.value.replace(/[^\d]/g, "").length < 10) ok = false;
      if (wrap) wrap.classList.toggle("invalid", !ok);
      return ok;
    }
    function validStep(i) {
      var els = steps[i].querySelectorAll("input, select, textarea");
      var ok = true, first = null;
      for (var e = 0; e < els.length; e++) {
        if (els[e].classList.contains("hp-input") || els[e].type === "hidden") continue;
        if (!validField(els[e])) { ok = false; if (!first) first = els[e]; }
      }
      if (first) first.focus();
      return ok;
    }
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && wrap.classList.contains("invalid")) validField(e.target);
    });
    form.addEventListener("click", function (e) {
      var n = e.target.closest("[data-next]");
      var p = e.target.closest("[data-prev]");
      if (n) { e.preventDefault(); if (validStep(cur)) goTo(cur + 1, true); }
      if (p) { e.preventDefault(); goTo(cur - 1, true); }
    });
    form.addEventListener("submit", function (e) {
      for (var i = 0; i < steps.length; i++) {
        if (!validStep(i)) { e.preventDefault(); goTo(i, true); validStep(i); return; }
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    });

    /* Prefill from the fit checker */
    var q = new URLSearchParams(window.location.search);
    var map = {
      turnover: { "under-250k": "Under £250k", "250k-1m": "£250k – £1m", "1m-2m": "£1m – £2m", "over-2m": "Over £2m" },
      profit: { yes: "Profitable in each of the last 3 years", mostly: "Profitable in most of the last 3 years", no: "Not consistently profitable yet" },
      timing: { "12m": "Within 12 months", "1-3y": "In 1 to 3 years", exploring: "Just exploring options" },
      location: { hampshire: "Hampshire" }
    };
    function setSelect(name, text) {
      var el = form.querySelector('[name="' + name + '"]');
      if (!el || !text) return;
      for (var o = 0; o < el.options.length; o++) if (el.options[o].text === text || el.options[o].value === text) { el.selectedIndex = o; return; }
    }
    if (q.get("turnover")) setSelect("turnover", map.turnover[q.get("turnover")]);
    if (q.get("profit")) setSelect("profitability", map.profit[q.get("profit")]);
    if (q.get("timing")) setSelect("timeline", map.timing[q.get("timing")]);
    if (q.get("location") === "hampshire") setSelect("county", "Hampshire");
    var fitField = form.querySelector('[name="fit-checker-result"]');
    if (fitField && q.get("fit")) {
      fitField.value = q.get("fit");
      var banner = document.getElementById("prefill-note");
      if (banner) banner.hidden = false;
    }
    goTo(0, false);
  }

  /* ---------- Simple validation for single-step forms ---------- */
  var simple = document.querySelectorAll("form[data-validate]");
  Array.prototype.forEach.call(simple, function (f) {
    f.addEventListener("submit", function (e) {
      var els = f.querySelectorAll("[required]"), first = null;
      for (var i = 0; i < els.length; i++) {
        var el = els[i], wrap = el.closest(".field");
        var ok = el.type === "checkbox" ? el.checked : !!el.value.trim();
        if (ok && el.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
        if (wrap) wrap.classList.toggle("invalid", !ok);
        if (!ok && !first) first = el;
      }
      if (first) { e.preventDefault(); first.focus(); }
    });
  });
})();

/* Collect ticked chip values into their single hidden field (e.g. reasons-for-selling) */
(function () {
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t.matches || !t.matches("input[data-collect]")) return;
    var name = t.getAttribute("data-collect");
    var form = t.form; if (!form) return;
    var hidden = form.querySelector('input[type="hidden"][name="' + name + '"]');
    if (!hidden) return;
    var vals = [].slice.call(form.querySelectorAll('input[data-collect="' + name + '"]:checked')).map(function (i) { return i.value; });
    hidden.value = vals.join(", ");
  });
})();
