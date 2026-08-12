// script.js — interactions, theme, loader, animations, form validation
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const loader = document.getElementById("loader");
  const themeToggle = document.getElementById("theme-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const backToTop = document.getElementById("back-to-top");
  const contactForm = document.getElementById("contact-form");

  // Initialize theme from localStorage or system
  const storedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);
  themeToggle.setAttribute("aria-pressed", initialTheme === "dark");
  themeToggle.textContent = initialTheme === "dark" ? "🌙" : "☀️";

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.setAttribute("aria-pressed", next === "dark");
    themeToggle.textContent = next === "dark" ? "🌙" : "☀️";
  });

  // Navigation toggle for mobile
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("show");
  });

  // Smooth scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1 && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const yOffset = document.getElementById("header")?.offsetHeight || 80;
          const y =
            target.getBoundingClientRect().top + window.scrollY - yOffset - 12;
          window.scrollTo({ top: y, behavior: "smooth" });
          // close mobile menu
          navMenu.classList.remove("show");
        }
      }
    });
  });

  // Intersection Observer for fade-in
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));

  const pageHeader = document.getElementById("header");
  const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const setActiveNav = () => {
    const scrollPosition =
      window.scrollY + (pageHeader?.offsetHeight || 80) + 100;
    let activeSectionId = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= scrollPosition) {
        activeSectionId = section.id;
      }
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${activeSectionId}`);
    });
  };

  const updateScrollState = () => {
    const isScrolled = window.scrollY > 24;
    if (pageHeader) pageHeader.classList.toggle("scrolled", isScrolled);
    if (window.scrollY > 400) backToTop.style.display = "flex";
    else backToTop.style.display = "none";
    setActiveNav();
  };

  window.addEventListener("scroll", updateScrollState);
  updateScrollState();

  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // Contact form validation
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const msg = document.getElementById("form-msg");
      if (!form.checkValidity()) {
        msg.textContent = "Please fill out all fields correctly.";
        msg.style.color = "tomato";
        return;
      }
      // Simulate sending
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        msg.style.color = "lightgreen";
        msg.textContent = "Thanks! Your message has been sent.";
        form.reset();
      }, 900);
    });
  }

  // Accordion animation tweak for <details>
  document.querySelectorAll(".accordion details").forEach((d) => {
    d.addEventListener("toggle", (e) => {
      if (d.open) d.classList.add("in-view");
    });
  });

  // Hide loader once everything is ready
  window.addEventListener("load", () => {
    loader.hidden = true;
  });

  // Set copyright year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
