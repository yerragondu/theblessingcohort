document.addEventListener("DOMContentLoaded", function () {
  /* ===============================
     CONTACT POPUP OPEN / CLOSE
  =============================== */

  const contactBubble = document.getElementById("contactBubble");
  const contactModal = document.getElementById("contactModal");
  const closeContact = document.getElementById("closeContact");
  const contactOverlay = document.getElementById("contactOverlay");

  if (contactBubble && contactModal && closeContact && contactOverlay) {
    contactBubble.addEventListener("click", function () {
      contactModal.classList.add("active");
    });

    closeContact.addEventListener("click", function () {
      contactModal.classList.remove("active");
    });

    contactOverlay.addEventListener("click", function () {
      contactModal.classList.remove("active");
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && contactModal.classList.contains("active")) {
        contactModal.classList.remove("active");
      }
    });
  }

  // Alternative CTA button
  const contactBubbleAlt = document.getElementById("contactBubbleAlt");
  if (contactBubbleAlt && contactModal) {
    contactBubbleAlt.addEventListener("click", function () {
      contactModal.classList.add("active");
    });
  }

  /* ===============================
     WEB3FORMS SUBMISSION (NO REDIRECT)
  =============================== */

  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          if (successMsg) {
            successMsg.style.display = "block";
            successMsg.style.animation = "fadeIn 0.3s ease";
          }
          form.reset();

          // Auto-close after 3 seconds
          setTimeout(() => {
            contactModal.classList.remove("active");
            if (successMsg) successMsg.style.display = "none";
          }, 3000);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        alert("Network error. Please try again later.");
      }
    });
  }

  /* ===============================
     SCROLL ANIMATIONS
  =============================== */

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
      }
    });
  }, observerOptions);

  // Observe section elements
  document.querySelectorAll(".section").forEach((el) => {
    el.style.opacity = "0";
    observer.observe(el);
  });

  /* ===============================
     SMOOTH SCROLL FOR ANCHOR LINKS
  =============================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ===============================
     HEADER SCROLL EFFECT
  =============================== */

  const header = document.querySelector(".site-header");
  let lastScroll = 0;

  if (header) {
    window.addEventListener("scroll", function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = "0 12px 40px rgba(0,0,0,0.2)";
      } else {
        header.style.boxShadow = "0 8px 32px rgba(0,0,0,0.15)";
      }

      lastScroll = currentScroll;
    });
  }

  /* ===============================
     LAZY LOAD IMAGES
  =============================== */

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});
