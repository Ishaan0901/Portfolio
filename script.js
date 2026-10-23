/* ===================================================
   Ishaan Sharma — Portfolio
   Main JavaScript
=================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let locoScroll;

/* Intro: always start at the top and keep the page still while the entry animation plays */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);
const INTRO_MS = 2600; // preloader length (matches the CSS animation)
const introLeft = () => Math.max(0, INTRO_MS - performance.now());

/* Project filters */
(function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("#projectsScroll .project-card-mini");
  if (!buttons.length || !cards.length) return;
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      cards.forEach((card) => {
        const show = f === "all" || (card.dataset.cat || "").split(" ").includes(f);
        card.classList.toggle("is-hidden", !show);
        card.classList.remove("filter-in");
        if (show) {
          void card.offsetWidth;
          card.classList.add("filter-in");
        }
      });
      setTimeout(() => (window.hLayout ? window.hLayout() : typeof locoScroll !== "undefined" && locoScroll && locoScroll.update()), 80);
    })
  );
})();

/* ---------------------------------------------------
   Smooth scrolling (Locomotive Scroll) + header/back-to-top state
--------------------------------------------------- */
if (prefersReducedMotion) {
  window.addEventListener("scroll", () => {
    const header = document.getElementById("siteHeader");
    const backToTop = document.getElementById("backToTop");
    header.classList.toggle("scrolled", window.scrollY > 10);
    backToTop.classList.toggle("visible", window.scrollY > 500);
  });
} else {
  locoScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]") || document.body,
    smooth: true,
    multiplier: 0.9,
    lerp: 0.08,
  });

  locoScroll.stop();
  setTimeout(() => locoScroll.start(), introLeft());

  locoScroll.on("scroll", ({ scroll }) => {
    const header = document.getElementById("siteHeader");
    const backToTop = document.getElementById("backToTop");
    header.classList.toggle("scrolled", scroll.y > 10);
    backToTop.classList.toggle("visible", scroll.y > 500);
  });
}

document.getElementById("backToTop").addEventListener("click", () => {
  if (locoScroll) {
    locoScroll.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

/* ---------------------------------------------------
   Mobile menu toggle
--------------------------------------------------- */
const menuBtn = document.getElementById("menuBtn");
const mobileOverlay = document.getElementById("mobileOverlay");

function closeMobileMenu() {
  menuBtn.classList.remove("open");
  mobileOverlay.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", () => {
  const isOpen = menuBtn.classList.toggle("open");
  mobileOverlay.classList.toggle("open", isOpen);
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mobileOverlay.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

/* ---------------------------------------------------
   Smooth in-page anchor scrolling
--------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target && locoScroll) {
      event.preventDefault();
      locoScroll.scrollTo(target);
    }
  });
});

/* ---------------------------------------------------
   Projects grid — keyboard focus outline handled via CSS
--------------------------------------------------- */
/* ---------------------------------------------------
   Hero intro animation (GSAP)
--------------------------------------------------- */
if (!prefersReducedMotion && window.gsap) {
  gsap
    .timeline({ delay: Math.max(0.1, 1.95 - performance.now() / 1000) })
    .fromTo("#heroPill", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" })
    .fromTo("#heroGreeting", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=.3")
    .fromTo("#heroName", { autoAlpha: 0, y: 32, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, "-=.2")
    .fromTo("#heroRole", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=.5")
    .fromTo("#heroTitle", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=.4")
    .fromTo("#heroSub", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.5")
    .fromTo("#heroActions", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=.4")
    .fromTo("#heroScroll", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "-=.3");
}

/* ---------------------------------------------------
   Scroll-triggered reveal animations
--------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal, .stagger").forEach((el) => revealObserver.observe(el));

/* ---------------------------------------------------
   Animated stat counters
--------------------------------------------------- */
const statElements = document.querySelectorAll(".stat-number");

function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const isDecimal = el.dataset.target.includes(".");
  const duration = prefersReducedMotion ? 1 : 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = (isDecimal ? current.toFixed(2) : Math.round(current)) + suffix;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

statElements.forEach((el) => counterObserver.observe(el));

/* ---------------------------------------------------
   Hero role — typewriter effect
--------------------------------------------------- */
const roleEl = document.getElementById("heroRoleText");
const roles = ["Aspiring AI Engineer", "Aspiring GenAI Engineer", "Aspiring Agentic AI Engineer", "Aspiring Forward Deployed Engineer", "AI & ML Student"];

const TYPE_SPEED = 75;
const DELETE_SPEED = 40;
const HOLD_AFTER_TYPE = 1800;
const HOLD_AFTER_DELETE = 350;

if (prefersReducedMotion) {
  if (roleEl) roleEl.textContent = roles[0];
} else if (roleEl) {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tickRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      roleEl.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tickRole, HOLD_AFTER_DELETE);
        return;
      }
      setTimeout(tickRole, DELETE_SPEED);
    } else {
      charIndex++;
      roleEl.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(tickRole, HOLD_AFTER_TYPE);
        return;
      }
      setTimeout(tickRole, TYPE_SPEED);
    }
  }

  setTimeout(tickRole, prefersReducedMotion ? 900 : Math.max(900, 3200 - performance.now()));
}


/* Horizontal pinned projects: vertical scroll drives the cards sideways */
(function () {
  const wrap = document.getElementById("hWrap");
  const track = document.getElementById("projectsScroll");
  const bar = document.getElementById("hProg");
  if (!wrap || !track) return;
  let top = 0, dist = 0;
  const docTop = (el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };
  const curY = () => {
    const y = typeof locoScroll !== "undefined" && locoScroll && locoScroll.scroll && locoScroll.scroll.instance && locoScroll.scroll.instance.scroll
      ? locoScroll.scroll.instance.scroll.y : null;
    return y != null ? y : window.scrollY;
  };
  const update = (y) => {
    const p = Math.min(1, Math.max(0, (y - top) / Math.max(1, dist)));
    track.style.transform = "translate3d(" + -p * dist + "px,0,0)";
    if (bar) bar.style.transform = "scaleX(" + p + ")";
  };
  function layout() {
    track.style.transform = "translate3d(0,0,0)";
    dist = Math.max(0, track.offsetWidth - document.documentElement.clientWidth);
    wrap.style.height = dist + window.innerHeight + "px";
    top = docTop(wrap);
    if (typeof locoScroll !== "undefined" && locoScroll) locoScroll.update();
    update(curY());
  }
  window.hLayout = layout;
  if (typeof locoScroll !== "undefined" && locoScroll) locoScroll.on("scroll", (a) => update(a.scroll.y));
  window.addEventListener("scroll", () => update(curY()), { passive: true });
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
  setTimeout(layout, 1500);
})();
