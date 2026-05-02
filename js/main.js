document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav]");
  const contactModal = document.querySelector("[data-contact-modal]");
  const contactOverlay = document.querySelector("[data-contact-overlay]");
  const contactPanel = contactModal ? contactModal.querySelector(".contact-panel") : null;
  const musicToggle = document.querySelector("[data-music-toggle]");
  const siteAudio = document.querySelector("[data-site-audio]");
  const storyModal = document.querySelector("[data-story-modal]");
  const storyModalKicker = document.querySelector("[data-story-modal-kicker]");
  const storyModalTitle = document.querySelector("[data-story-modal-title]");
  const storyModalBody = document.querySelector("[data-story-modal-body]");
  const contactCloseButtons = document.querySelectorAll("[data-close-contact]");
  const contactOpenButtons = document.querySelectorAll("[data-open-contact]");
  const storyCloseButtons = document.querySelectorAll("[data-close-story]");
  const storyOpenButtons = document.querySelectorAll("[data-open-story]");
  let contactChoiceButtons = [];
  let contactBackButtons = [];
  let contactForms = [];
  let contactViews = [];
  const musicStorageKey = "tbc_music_enabled";
  const musicTimeKey = "tbc_music_time";

  const setupContactModal = () => {
    if (!contactPanel || contactPanel.dataset.enhanced === "true") {
      return;
    }

    const closeButton = contactPanel.querySelector(".contact-close");
    const existingTitle = contactPanel.querySelector("#contactTitle") || contactPanel.querySelector("h3");
    const existingSubtext = contactPanel.querySelector(".contact-subtext");
    const existingForm = document.getElementById("contactForm");

    if (!closeButton || !existingTitle || !existingSubtext || !existingForm) {
      return;
    }

    contactPanel.insertAdjacentHTML(
      "afterbegin",
      '<h3 id="contactTitle" class="sr-only">Contact options</h3>'
    );

    closeButton.insertAdjacentHTML(
      "afterend",
      `
        <div class="contact-view is-active" data-contact-view="chooser">
          <h3>Choose a form</h3>
          <p class="contact-subtext">
            Pick the best way to connect with The Blessing CoHort.
          </p>
          <div class="contact-choice-grid">
            <button class="contact-choice" type="button" data-contact-choice="contact">
              <strong>General contact</strong>
              <span>Prayer, partnership, giving, or a general question.</span>
            </button>
            <button class="contact-choice" type="button" data-contact-choice="newsletter">
              <strong>Newsletter signup</strong>
              <span>Just name and email for stories and updates.</span>
            </button>
          </div>
        </div>
      `
    );

    const chooserView = contactPanel.querySelector('[data-contact-view="chooser"]');

    if (!chooserView) {
      return;
    }

    const contactView = document.createElement("div");
    contactView.className = "contact-view";
    contactView.dataset.contactView = "contact";
    contactView.hidden = true;

    const contactBackButton = document.createElement("button");
    contactBackButton.type = "button";
    contactBackButton.className = "contact-back";
    contactBackButton.setAttribute("data-contact-back", "");
    contactBackButton.textContent = "Back to choices";

    contactView.append(contactBackButton, existingTitle, existingSubtext, existingForm);
    chooserView.insertAdjacentElement("afterend", contactView);

    const newsletterView = document.createElement("div");
    newsletterView.className = "contact-view";
    newsletterView.dataset.contactView = "newsletter";
    newsletterView.hidden = true;

    const newsletterBackButton = document.createElement("button");
    newsletterBackButton.type = "button";
    newsletterBackButton.className = "contact-back";
    newsletterBackButton.setAttribute("data-contact-back", "");
    newsletterBackButton.textContent = "Back to choices";

    const newsletterHeading = document.createElement("h3");
    newsletterHeading.textContent = "Join the newsletter";

    const newsletterSubtext = document.createElement("p");
    newsletterSubtext.className = "contact-subtext";
    newsletterSubtext.textContent =
      "Get real stories, updates, and impact from our work in villages.";

    const newsletterForm = document.createElement("form");
    newsletterForm.className = "contact-form contact-form--newsletter";
    newsletterForm.action = "https://api.web3forms.com/submit";
    newsletterForm.method = "POST";
    newsletterForm.id = "newsletterForm";
    newsletterForm.setAttribute("data-web3form", "true");
    newsletterForm.dataset.formKind = "newsletter";
    newsletterForm.innerHTML = `
      <input type="hidden" name="access_key" value="60d5f1a6-7142-4beb-9dc4-3bb8b80a0d52" />
      <input type="hidden" name="botcheck" />
      <input type="hidden" name="subject" value="Newsletter signup" />

      <label>
        Name
        <input type="text" name="name" placeholder="Your name" required />
      </label>

      <label>
        Email Address
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <button type="submit" class="submit-btn">Subscribe</button>
      <p class="form-status" data-form-status aria-live="polite">
        Thanks for subscribing. We will keep you posted.
      </p>
    `;

    newsletterView.append(
      newsletterBackButton,
      newsletterHeading,
      newsletterSubtext,
      newsletterForm
    );
    contactView.insertAdjacentElement("afterend", newsletterView);

    contactPanel.dataset.enhanced = "true";
    contactChoiceButtons = contactPanel.querySelectorAll("[data-contact-choice]");
    contactBackButtons = contactPanel.querySelectorAll("[data-contact-back]");
    contactForms = contactPanel.querySelectorAll("[data-web3form]");
    contactViews = contactPanel.querySelectorAll("[data-contact-view]");
  };

  setupContactModal();

  const showContactView = (viewName) => {
    if (!contactViews.length) {
      return;
    }

    contactViews.forEach((view) => {
      const isActive = view.dataset.contactView === viewName;
      view.hidden = !isActive;
      view.classList.toggle("is-active", isActive);
    });
  };

  const resetContactForms = () => {
    contactForms.forEach((contactForm) => {
      contactForm.reset();
      const status =
        contactForm.querySelector("[data-form-status]") || contactForm.querySelector(".form-status");
      if (status) {
        status.classList.remove("is-visible");
      }
    });
  };

  const lockBody = (locked) => {
    body.classList.toggle("is-locked", locked);
  };

  const isAnyModalOpen = () => {
    return Boolean(
      (contactModal && contactModal.classList.contains("is-open")) ||
        (storyModal && storyModal.classList.contains("is-open"))
    );
  };

  const closeNav = () => {
    if (!navPanel || !navToggle) {
      return;
    }

    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    lockBody(isAnyModalOpen());
  };

  const openNav = () => {
    if (!navPanel || !navToggle) {
      return;
    }

    navPanel.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    lockBody(true);
  };

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.contains("is-open");
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
  }

  const closeModal = () => {
    if (!contactModal) {
      return;
    }

    contactModal.classList.remove("is-open");
    showContactView("chooser");
    resetContactForms();
    if (navPanel && navPanel.classList.contains("is-open")) {
      lockBody(true);
    } else {
      lockBody(isAnyModalOpen());
    }
  };

  const closeStoryModal = () => {
    if (!storyModal) {
      return;
    }

    storyModal.classList.remove("is-open");
    lockBody(isAnyModalOpen());
  };

  const openStoryModal = (button) => {
    if (!storyModal || !storyModalTitle || !storyModalBody) {
      return;
    }

    if (storyModalKicker) {
      storyModalKicker.textContent = button.dataset.storyKicker || "";
    }

    storyModalTitle.textContent = button.dataset.storyTitle || "";
    storyModalBody.innerHTML = "";

    const templateId = button.dataset.storyTemplate;
    const template = templateId ? document.getElementById(templateId) : null;

    if (template) {
      storyModalBody.appendChild(template.content.cloneNode(true));
    } else {
      const paragraphs = (button.dataset.storyBody || "")
        .split("||")
        .map((item) => item.trim())
        .filter(Boolean);

      paragraphs.forEach((paragraph) => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        storyModalBody.appendChild(element);
      });
    }

    storyModal.classList.add("is-open");
    closeNav();
    lockBody(true);
  };

  const openModal = () => {
    if (!contactModal) {
      return;
    }

    showContactView("chooser");
    contactModal.classList.add("is-open");
    closeNav();
    lockBody(true);
  };

  contactOpenButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  contactChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.dataset.contactChoice || "chooser";
      showContactView(targetView);
    });
  });

  contactBackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showContactView("chooser");
    });
  });

  storyOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openStoryModal(button);
    });
  });

  if (contactOverlay) {
    contactOverlay.addEventListener("click", closeModal);
  }

  contactCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  storyCloseButtons.forEach((button) => {
    button.addEventListener("click", closeStoryModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
      closeModal();
      closeStoryModal();
    }
  });

  if (header) {
    let lastScrollY = window.scrollY;

    const syncHeader = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const shouldHide =
        isScrollingDown &&
        currentScrollY > 140 &&
        !(navPanel && navPanel.classList.contains("is-open")) &&
        !isAnyModalOpen();

      header.classList.toggle("is-scrolled", currentScrollY > 24);
      header.classList.toggle("is-hidden", shouldHide);
      lastScrollY = currentScrollY;
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  if (musicToggle && siteAudio) {
    const syncMusicButton = () => {
      const isPlaying = !siteAudio.paused;
      musicToggle.classList.toggle("is-playing", isPlaying);
      musicToggle.setAttribute(
        "aria-label",
        isPlaying ? "Pause music" : "Play music"
      );
      musicToggle.setAttribute(
        "title",
        isPlaying ? "Pause music" : "Play music"
      );
    };

    const saveMusicState = () => {
      if (!siteAudio.paused) {
        window.localStorage.setItem(musicStorageKey, "true");
      }
      window.localStorage.setItem(musicTimeKey, String(siteAudio.currentTime || 0));
    };

    const restoreMusicState = async () => {
      const shouldResume = window.localStorage.getItem(musicStorageKey) === "true";
      const storedTime = Number(window.localStorage.getItem(musicTimeKey) || "0");

      if (storedTime > 0) {
        const setStoredTime = () => {
          siteAudio.currentTime = storedTime;
        };

        if (siteAudio.readyState >= 1) {
          setStoredTime();
        } else {
          siteAudio.addEventListener("loadedmetadata", setStoredTime, {
            once: true,
          });
        }
      }

      if (!shouldResume) {
        syncMusicButton();
        return;
      }

      try {
        await siteAudio.play();
      } catch (error) {
        syncMusicButton();
      }
    };

    musicToggle.addEventListener("click", async () => {
      const source = siteAudio.querySelector("source");
      const hasSource = source && source.getAttribute("src");

      if (!hasSource) {
        window.alert("Add a song file to assets/audio/site-theme.mp3 to use this button.");
        return;
      }

      try {
        if (siteAudio.paused) {
          await siteAudio.play();
          window.localStorage.setItem(musicStorageKey, "true");
        } else {
          siteAudio.pause();
          window.localStorage.setItem(musicStorageKey, "false");
        }
        syncMusicButton();
      } catch (error) {
        window.alert("Music is ready, but the song file is not available yet.");
      }
    });

    siteAudio.addEventListener("ended", syncMusicButton);
    siteAudio.addEventListener("pause", syncMusicButton);
    siteAudio.addEventListener("play", syncMusicButton);
    siteAudio.addEventListener("timeupdate", saveMusicState);
    window.addEventListener("pagehide", saveMusicState);
    restoreMusicState();
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 80}ms`);
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  const countUpItems = document.querySelectorAll("[data-count-up]");
  const animateCountUp = (element) => {
    if (element.dataset.counted === "true") {
      return;
    }

    const finalText = (element.dataset.countFinal || element.textContent || "").trim();
    const match = finalText.match(/^([^0-9]*)(\d+)([^0-9]*)$/);

    if (!match) {
      element.dataset.counted = "true";
      return;
    }

    const [, prefix, rawNumber, suffix] = match;
    const targetValue = Number(rawNumber);
    const duration = 1400;
    const startTime = performance.now();

    element.dataset.countFinal = finalText;
    element.dataset.counted = "true";
    element.textContent = `${prefix}0${suffix}`;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(targetValue * easedProgress);

      element.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = finalText;
      }
    };

    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5,
      }
    );

    countUpItems.forEach((item) => {
      countObserver.observe(item);
    });
  } else {
    countUpItems.forEach((item) => {
      animateCountUp(item);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-slider-track]").forEach((track) => {
    const container = track.closest(".giving-slider");
    if (!container) {
      return;
    }

    const prevButton = container.querySelector("[data-slide-prev]");
    const nextButton = container.querySelector("[data-slide-next]");
    const slides = Array.from(track.querySelectorAll(".slider-slide"));
    const firstSlide = slides[0];

    if (!firstSlide) {
      return;
    }

    const getStep = () => firstSlide.getBoundingClientRect().width;
    let currentIndex = 0;

    const syncIndexFromScroll = () => {
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(track.scrollLeft - slide.offsetLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      currentIndex = closestIndex;
    };

    const scrollToIndex = (index) => {
      const maxIndex = Math.max(slides.length - 1, 0);
      const safeIndex = Math.min(Math.max(index, 0), maxIndex);
      const targetSlide = slides[safeIndex];

      currentIndex = safeIndex;
      if (targetSlide) {
        targetSlide.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      } else {
        track.scrollTo({ left: getStep() * safeIndex, behavior: "smooth" });
      }
    };

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        scrollToIndex(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        scrollToIndex(currentIndex + 1);
      });
    }

    track.addEventListener("scroll", syncIndexFromScroll, { passive: true });
    syncIndexFromScroll();
  });

  document.querySelectorAll(".timeline-grid").forEach((section) => {
    const timelineCards = section.querySelector(".timeline-cards");
    const sliderTrack = section.querySelector(".timeline-slider [data-slider-track]");

    if (!timelineCards || !sliderTrack) {
      return;
    }

    let syncFrame = null;

    const syncTimelineSlider = () => {
      syncFrame = null;

      const timelineMaxScroll = Math.max(
        timelineCards.scrollHeight - timelineCards.clientHeight,
        0
      );
      const sliderMaxScroll = Math.max(
        sliderTrack.scrollWidth - sliderTrack.clientWidth,
        0
      );

      if (timelineMaxScroll === 0 || sliderMaxScroll === 0) {
        sliderTrack.scrollLeft = 0;
        return;
      }

      const progress = timelineCards.scrollTop / timelineMaxScroll;
      sliderTrack.scrollLeft = progress * sliderMaxScroll;
    };

    const requestSliderSync = () => {
      if (syncFrame !== null) {
        return;
      }

      syncFrame = window.requestAnimationFrame(syncTimelineSlider);
    };

    timelineCards.addEventListener("scroll", requestSliderSync, { passive: true });
    window.addEventListener("resize", requestSliderSync);
    requestSliderSync();
  });

  contactForms.forEach((contactForm) => {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const formStatus =
        contactForm.querySelector("[data-form-status]") || contactForm.querySelector(".form-status");
      const originalButtonText = submitButton ? submitButton.textContent : "";
      const formData = new FormData(contactForm);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error("Submission failed");
        }

        contactForm.reset();
        if (formStatus) {
          formStatus.classList.add("is-visible");
        }

        window.setTimeout(() => {
          if (formStatus) {
            formStatus.classList.remove("is-visible");
          }
          closeModal();
        }, 2600);
      } catch (error) {
        window.alert("Something went wrong. Please try again in a moment.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeNav();
    }
  });
});
