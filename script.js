// Dynamic Copyright Year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Honour the OS "reduce motion" setting: no auto-rotating carousels.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Mobile Menu Navigation & Drawer
const menuToggle = document.getElementById("menuToggle") || document.querySelector(".menu-toggle");
const nav = document.getElementById("siteNav") || document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

function closeMobileMenu() {
  if (nav && nav.classList.contains("open")) {
    nav.classList.remove("open");
    if (menuToggle) {
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
    document.body.style.overflow = "";
  }
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close the drawer when the viewport grows past the mobile breakpoint
  window.matchMedia("(min-width: 851px)").addEventListener("change", (e) => {
    if (e.matches) closeMobileMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  });
}

// Hero Image Carousel
const carousel = document.getElementById("heroCarousel");
if (carousel) {
  const slides = carousel.querySelectorAll(".carousel-slide");
  const tag = document.getElementById("carouselTag");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const indicatorsContainer = document.getElementById("carouselIndicators");
  let currentIndex = 0;
  let autoPlayTimer = null;
  const AUTO_PLAY_DELAY = 5000;

  // Build pagination indicators
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(i);
      resetAutoPlay();
    });
    indicatorsContainer.appendChild(dot);
  });

  const dots = indicatorsContainer.querySelectorAll(".carousel-dot");

  function goToSlide(index) {
    slides[currentIndex].classList.remove("active");
    if (dots[currentIndex]) {
      dots[currentIndex].classList.remove("active");
    }

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add("active");
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add("active");
    }

    const title = slides[currentIndex].getAttribute("data-title") || "";
    const slideNumber = String(currentIndex + 1).padStart(2, "0");
    const totalSlides = String(slides.length).padStart(2, "0");
    if (tag) {
      tag.innerHTML = `${slideNumber} / ${totalSlides} &bull; ${title}`;
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoPlay();
      }
    },
    { passive: true }
  );

  // Keyboard navigation
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoPlay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoPlay();
    }
  });

  if (!prefersReducedMotion.matches) {
    startAutoPlay();
  }
}

// Project Feature Highlights Carousel
const featureCarousel = document.getElementById("featureCarousel");
if (featureCarousel) {
  const tabs = featureCarousel.querySelectorAll(".feature-tab");
  const slides = featureCarousel.querySelectorAll(".feature-slide");
  const prevBtn = document.getElementById("featurePrev");
  const nextBtn = document.getElementById("featureNext");
  const currentIdxEl = document.getElementById("featureCurrentIndex");
  const currentTitleEl = document.getElementById("featureCurrentTitle");
  let currentIdx = 0;
  let featureTimer = null;
  const ROTATE_INTERVAL = 4500;

  const titles = [
    "Prime Location",
    "Metro Proximity",
    "4BHK Luxury Vibe",
    "Unbeatable Value",
    "Family Hub",
    "Direct Developer Deal"
  ];

  function showFeature(index) {
    if (tabs[currentIdx]) {
      tabs[currentIdx].classList.remove("active");
      tabs[currentIdx].setAttribute("aria-selected", "false");
    }
    if (slides[currentIdx]) {
      slides[currentIdx].classList.remove("active");
    }

    currentIdx = (index + slides.length) % slides.length;

    if (tabs[currentIdx]) {
      tabs[currentIdx].classList.add("active");
      tabs[currentIdx].setAttribute("aria-selected", "true");
      tabs[currentIdx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    if (slides[currentIdx]) {
      slides[currentIdx].classList.add("active");
    }

    if (currentIdxEl) {
      currentIdxEl.textContent = String(currentIdx + 1).padStart(2, "0");
    }
    if (currentTitleEl) {
      currentTitleEl.textContent = titles[currentIdx] || "";
    }
  }

  function nextFeature() {
    showFeature(currentIdx + 1);
  }

  function prevFeature() {
    showFeature(currentIdx - 1);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      showFeature(i);
      resetFeatureTimer();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevFeature();
      resetFeatureTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextFeature();
      resetFeatureTimer();
    });
  }

  function startFeatureTimer() {
    stopFeatureTimer();
    featureTimer = setInterval(nextFeature, ROTATE_INTERVAL);
  }

  function stopFeatureTimer() {
    if (featureTimer) {
      clearInterval(featureTimer);
      featureTimer = null;
    }
  }

  function resetFeatureTimer() {
    stopFeatureTimer();
    startFeatureTimer();
  }

  featureCarousel.addEventListener("mouseenter", stopFeatureTimer);
  featureCarousel.addEventListener("mouseleave", startFeatureTimer);

  // Touch Swipe for Feature Carousel
  let fTouchStartX = 0;
  featureCarousel.addEventListener(
    "touchstart",
    (e) => {
      fTouchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  featureCarousel.addEventListener(
    "touchend",
    (e) => {
      const diff = fTouchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextFeature();
        else prevFeature();
        resetFeatureTimer();
      }
    },
    { passive: true }
  );

  if (!prefersReducedMotion.matches) {
    startFeatureTimer();
  }
}

// ---------------------------------------------------------------------------
// Sticky Header Shrink + Active Nav Link (Scroll Spy)
// ---------------------------------------------------------------------------
const header = document.querySelector(".site-header");
const spyLinks = Array.from(document.querySelectorAll('.nav > a[href^="#"]'));
const spySections = spyLinks
  .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
  .filter(Boolean);

let scrollTicking = false;

function handleScroll() {
  if (!header) return;

  const y = window.scrollY || window.pageYOffset;
  header.classList.toggle("scrolled", y > 40);

  if (!spySections.length) return;

  // Account for the sticky header when deciding which section is "in view"
  const offset = y + (header.offsetHeight || 0) + 100;
  let activeIndex = 0;

  spySections.forEach((section, i) => {
    if (section.offsetTop <= offset) activeIndex = i;
  });

  // Bottom of page: always highlight the final link
  if (window.innerHeight + y >= document.body.offsetHeight - 2) {
    activeIndex = spySections.length - 1;
  }

  spyLinks.forEach((link, i) => {
    link.classList.toggle("active", i === activeIndex);
  });
}

function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    handleScroll();
    scrollTicking = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
handleScroll();

