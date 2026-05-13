const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const refHeader = document.querySelector(".ref-header");
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const cookieBanner = document.getElementById("cookie-banner");
const cookieButtons = document.querySelectorAll("[data-cookie-action]");
const form = document.getElementById("quote-form");
const feedback = document.querySelector(".form-feedback");

const syncHeaderScrollState = () => {
  if (!refHeader) {
    return;
  }

  const shouldCompact = window.scrollY > 70;
  refHeader.classList.toggle("is-scrolled", shouldCompact);
};

syncHeaderScrollState();
window.addEventListener("scroll", syncHeaderScrollState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// Active nav section highlighting
const sections = document.querySelectorAll("section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => {
  if (!item.classList.contains("active")) {
    revealObserver.observe(item);
  }
});

if (navToggle && navMenu) {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!navMenu.contains(target) && !navToggle.contains(target)) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const cookieKey = "lv-cookie-consent";

const readCookieConsent = () => {
  try {
    return localStorage.getItem(cookieKey);
  } catch {
    return null;
  }
};

const writeCookieConsent = (value) => {
  try {
    localStorage.setItem(cookieKey, value);
  } catch {
    // Ignore storage failures so the banner can still close.
  }
};

const showCookieBanner = () => {
  if (!cookieBanner) {
    return;
  }

  cookieBanner.removeAttribute("hidden");
};

const hideCookieBanner = (value) => {
  if (!cookieBanner) {
    return;
  }

  writeCookieConsent(value);
  cookieBanner.setAttribute("hidden", "");
};

if (!readCookieConsent() && cookieBanner) {
  showCookieBanner();
}

cookieButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hideCookieBanner(button.getAttribute("data-cookie-action") || "accept");
  });
});

if (cookieBanner) {
  const cookieOverlay = cookieBanner.querySelector(".cookie-overlay");
  cookieOverlay?.addEventListener("click", () => {
    hideCookieBanner("reject");
  });
}

if (form && feedback) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !message) {
      feedback.textContent = "Please fill in all fields before sending.";
      return;
    }

    const waText = `Hi, I'd like a free quote!\n\nName: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`;
    const waUrl = `https://wa.me/447555653736?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank", "noreferrer");

    feedback.textContent = `Thanks ${name}! Opening WhatsApp to send your quote request.`;
    form.reset();
  });
}