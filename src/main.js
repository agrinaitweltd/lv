const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const cookieBanner = document.getElementById("cookie-banner");
const cookieButtons = document.querySelectorAll("[data-cookie-action]");
const form = document.getElementById("quote-form");
const feedback = document.querySelector(".form-feedback");

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

if (!localStorage.getItem(cookieKey) && cookieBanner) {
  cookieBanner.hidden = false;
}

cookieButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem(cookieKey, button.dataset.cookieAction || "accepted");
    if (cookieBanner) {
      cookieBanner.hidden = true;
    }
  });
});

if (form && feedback) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "there").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !message) {
      feedback.textContent = "Please fill in all fields before sending.";
      return;
    }

    feedback.textContent = `Thanks ${name}. Your quote request is ready to send. Call or message 07555653736 to complete booking.`;
    form.reset();
  });
}