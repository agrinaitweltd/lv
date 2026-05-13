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

const cookieKey = "lv-cookie-consent";

// Show cookie banner if no consent stored
if (!localStorage.getItem(cookieKey) && cookieBanner) {
  cookieBanner.removeAttribute("hidden");
  console.log("Cookie banner shown");
}

// Handle cookie button clicks
cookieButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const action = button.dataset.cookieAction || "accepted";
    localStorage.setItem(cookieKey, action);
    console.log("Cookie action:", action);
    if (cookieBanner) {
      cookieBanner.setAttribute("hidden", "");
    }
  });
});

// Close cookie modal when clicking overlay
if (cookieBanner) {
  const cookieOverlay = cookieBanner.querySelector(".cookie-overlay");
  if (cookieOverlay) {
    cookieOverlay.addEventListener("click", () => {
      localStorage.setItem(cookieKey, "rejected");
      cookieBanner.setAttribute("hidden", "");
    });
  }
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