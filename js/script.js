(function(){
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- year ---------- */
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav scroll state + active link ---------- */
  const nav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks.map(l => document.getElementById(l.dataset.nav)).filter(Boolean);

  function onScroll(){
    if(window.scrollY > 20) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");

    let current = null;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if(rect.top <= 140 && rect.bottom >= 140) current = sec.id;
    });
    navLinks.forEach(l => l.classList.toggle("is-active", l.dataset.nav === current));
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinksWrap = document.getElementById("navLinks");
  if(navToggle){
    navToggle.addEventListener("click", () => {
      const open = navLinksWrap.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navLinksWrap.style.display = open ? "flex" : "";
      if(open){
        navLinksWrap.style.position = "absolute";
        navLinksWrap.style.top = "76px";
        navLinksWrap.style.left = "0";
        navLinksWrap.style.right = "0";
        navLinksWrap.style.flexDirection = "column";
        navLinksWrap.style.background = "rgba(10,14,23,0.97)";
        navLinksWrap.style.padding = "20px 32px";
        navLinksWrap.style.gap = "18px";
        navLinksWrap.style.borderBottom = "1px solid rgba(255,255,255,0.08)";
      }
    });
    navLinksWrap.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navLinksWrap.classList.remove("is-open");
        navLinksWrap.style.display = "";
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- cursor glow ---------- */
  const glow = document.getElementById("cursorGlow");
  if(glow && !reduceMotion){
    window.addEventListener("pointermove", e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, { passive:true });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .project-card, .skill-bar");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -60px 0px" });
  revealEls.forEach(el => io.observe(el));

  /* ---------- skill bars: set css var width from data-level ---------- */
  document.querySelectorAll(".skill-bar").forEach(bar => {
    const level = bar.getAttribute("data-level") || "0";
    bar.style.setProperty("--w", level + "%");
  });

  /* ---------- counters ---------- */
  const counters = document.querySelectorAll(".kpi-number");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseFloat(el.getAttribute("data-count")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    if(reduceMotion){
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- hero KPI chart draw ---------- */
  const chartLine = document.getElementById("chartLine");
  const chartArea = document.getElementById("chartArea");
  const kpiPanel = document.getElementById("kpiPanel");

  const chartPoints = [
    [0,88],[35,80],[70,84],[105,64],[140,70],[175,46],[210,54],[245,30],[280,38],[320,18]
  ];
  function buildPath(points){
    return points.map((p,i) => (i===0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  }
  function buildAreaPath(points){
    const line = buildPath(points);
    const last = points[points.length-1];
    const first = points[0];
    return `${line} L${last[0]},110 L${first[0]},110 Z`;
  }

  if(chartLine && kpiPanel){
    const linePath = buildPath(chartPoints);
    const areaPath = buildAreaPath(chartPoints);
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          if(reduceMotion){
            chartLine.setAttribute("d", linePath);
            chartArea.setAttribute("d", areaPath);
          } else {
            animatePath(chartLine, linePath, 1300);
            chartArea.setAttribute("d", areaPath);
            chartArea.style.opacity = 0;
            setTimeout(() => { chartArea.style.transition = "opacity 1s ease"; chartArea.style.opacity = 1; }, 200);
          }
          chartObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    chartObserver.observe(kpiPanel);
  }

  function animatePath(el, finalD, duration){
    // Animate by interpolating point-by-point reveal using stroke-dasharray trick
    el.setAttribute("d", finalD);
    const length = el.getTotalLength();
    el.style.strokeDasharray = length + " " + length;
    el.style.strokeDashoffset = length;
    el.getBoundingClientRect(); // force reflow
    el.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.16,.8,.24,1)`;
    requestAnimationFrame(() => { el.style.strokeDashoffset = "0"; });
  }

  /* ---------- rotating role text ---------- */
  const roleEl = document.querySelector(".role-static");
  const roles = [
    "I build reports that end with a decision, not a scroll.",
    "SQL by day, Python by night, dashboards in between.",
    "Turning 14 companies' worth of data into one clear number.",
    "Data Analyst · BI Developer · Dashboard Architect."
  ];
  if(roleEl && !reduceMotion){
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % roles.length;
      roleEl.style.opacity = 0;
      setTimeout(() => {
        roleEl.textContent = roles[idx];
        roleEl.style.opacity = 1;
      }, 350);
    }, 4200);
    roleEl.style.transition = "opacity .35s ease";
  }

})();
