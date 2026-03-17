const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const counterNodes = document.querySelectorAll(".count-up");
if (counterNodes.length) {
  const runCounter = (node) => {
    const target = Number(node.dataset.target || 0);
    const duration = 900;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      node.textContent = String(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.textContent = String(target);
      }
    };

    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counterNodes.forEach((node) => statsObserver.observe(node));
}

const filterButtons = document.querySelectorAll(".chip");
const projectCards = document.querySelectorAll(".project-grid .project");

if (filterButtons.length && projectCards.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";

      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      projectCards.forEach((card) => {
        const tags = (card.dataset.tags || "").split(" ");
        const show = filter === "all" || tags.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
}

const toast = document.getElementById("toast");
let toastTimer = null;
const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
};

const copyEmailBtn = document.getElementById("copy-email-btn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const value = copyEmailBtn.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(value);
      showToast("Email copied.");
    } catch (error) {
      showToast("Copy failed. Please copy manually.");
    }
  });
}

const backToTopBtn = document.getElementById("back-to-top");
if (backToTopBtn) {
  const toggleBackToTop = () => {
    const shouldShow = window.scrollY > 380;
    backToTopBtn.classList.toggle("show", shouldShow);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
