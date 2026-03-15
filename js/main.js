document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav]");
  const contactModal = document.querySelector("[data-contact-modal]");
  const contactOverlay = document.querySelector("[data-contact-overlay]");
  const musicToggle = document.querySelector("[data-music-toggle]");
  const siteAudio = document.querySelector("[data-site-audio]");
  const contactCloseButtons = document.querySelectorAll("[data-close-contact]");
  const contactOpenButtons = document.querySelectorAll("[data-open-contact]");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("successMsg");
  const musicStorageKey = "tbc_music_enabled";
  const musicTimeKey = "tbc_music_time";

  const lockBody = (locked) => {
    body.classList.toggle("is-locked", locked);
  };

  const isAnyModalOpen = () => {
    return Boolean(contactModal && contactModal.classList.contains("is-open"));
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
    if (navPanel && navPanel.classList.contains("is-open")) {
      lockBody(true);
    } else {
      lockBody(isAnyModalOpen());
    }
  };

  const openModal = () => {
    if (!contactModal) {
      return;
    }

    contactModal.classList.add("is-open");
    closeNav();
    lockBody(true);
  };

  contactOpenButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  if (contactOverlay) {
    contactOverlay.addEventListener("click", closeModal);
  }

  contactCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
      closeModal();
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

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error("Submission failed");
        }

        form.reset();
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
          submitButton.textContent = "Send message";
        }
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeNav();
    }
  });
});
