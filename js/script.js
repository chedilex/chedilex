document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // LOADER

  const loader = document.querySelector(".loader");

  if (reducedMotion) {
    gsap.set(loader, { display: "none" });
    initializeWebsite();
  } else {
    gsap.to(".loader-line span", {
      scaleX: 1,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: initializeWebsite,
        });
      },
    });
  }

  function initializeWebsite() {
    // NAVBAR

    const navbar = document.querySelector(".navbar");

    ScrollTrigger.create({
      start: "top -50",
      onUpdate: (self) => {
        navbar.classList.toggle("scrolled", self.scroll() > 50);
      },
    });

    // MOBILE MENU
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = menuToggle.querySelector("i");

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      const isOpen = navLinks.classList.contains("active");

      menuIcon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuIcon.className = "fa-solid fa-bars";
      });
    });

    // GENERAL SCROLL REVEAL

    gsap.utils.toArray(".reveal:not(.project-card)").forEach((element) => {
      gsap.fromTo(
        element,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    // STAGGERED PROJECT CARD REVEAL
    const projectCards = document.querySelectorAll(".project-card");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      projectCards.forEach((card) => card.classList.add("project-card-visible"));
    } else {
      const projectObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("project-card-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );

      projectCards.forEach((card, index) => {
        card.style.setProperty("--project-stagger", `${(index % 2) * 120}ms`);
        card.classList.add("project-card-pending");
        projectObserver.observe(card);
      });
    }

    // ABOUT PARALLAX

    gsap.from(".about-heading", {
      x: -80,
      duration: 1.2,
      scrollTrigger: {
        trigger: ".about",
        start: "top 70%",
        once: true,
      },
    });

    // PINNED STACKING SERVICES ANIMATION

    const servicesSection = document.querySelector(".services");
    const cards = gsap.utils.toArray(".service-card");

    const progressBar = document.querySelector(".progress-track span");

    const progressNumber = document.querySelector(".progress-current");

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!reducedMotion) {
      // Initial card positions

      gsap.set(cards, {
        yPercent: 0,
        scale: 1,
        transformOrigin: "center top",
      });

      // Put all cards on top of each other

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: index + 1,
        });
      });

      // First card starts visible

      gsap.set(cards[0], {
        yPercent: 0,
      });

      // Remaining cards start below the screen
      gsap.set(cards.slice(1), {
        yPercent: 115,
      });

      const stackTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: servicesSection,
          start: "top top",
          end: () => "+=" + window.innerHeight * (cards.length + 0.3),
          pin: ".services-pin",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const current = Math.min(
              cards.length,
              Math.floor(self.progress * cards.length) + 1,
            );
            progressNumber.textContent = String(current).padStart(2, "0");
            progressBar.style.width = self.progress * 100 + "%";
          },
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;
        const previousCard = cards[index - 1];
        // Slide the next card over the previous card
        stackTimeline.to(card, {
          yPercent: 0,
          duration: 1,
          ease: "none",
        });

        // Create the depth effect on the previous card
        stackTimeline.to(
          previousCard,
          {
            scale: isMobile ? 0.96 : 0.94,
            y: isMobile ? -12 : -25,
            opacity: 0.65,
            duration: 1,
            ease: "none",
          },
          "<",
        );
      });
    } else {
      // Accessible non-pinned layout
      const stack = document.querySelector(".services-stack");
      stack.style.height = "auto";
      cards.forEach((card) => {
        card.style.position = "relative";
        card.style.marginBottom = "20px";
        card.style.transform = "none";
      });

      document.querySelector(".services-progress").style.display = "none";
    }

    // CLIENT LOGO REVEAL
    gsap.fromTo(
      ".client-card",
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".clients-grid",
          start: "top 84%",
          once: true,
        },
      },
    );

    // PROCESS STAGGER
    const processSection = document.querySelector(".process");
    const processPin = document.querySelector(".process-pin");
    // const approachWordmark = document.querySelector(".approach-wordmark");
    const processItems = gsap.utils.toArray(".process-item");

    if (!reducedMotion) {
      const approachTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: processSection,
          start: "top top",
          end: "bottom bottom",
          pin: processPin,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      approachTimeline.fromTo(
        processItems,
        {
          x: () => -window.innerWidth * 0.72,
          y: () => window.innerHeight * 0.58,
          opacity: 0,
          scale: 0.86,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.24,
          duration: 1.4,
          ease: "power2.out",
        },
        0,
      );

      // .to(
      //   approachWordmark,
      //   {
      //     x: "-30vw",
      //     y: "-34vh",
      //     scale: 0.95,
      //     opacity: 0.55,
      //     duration: 1,
      //     ease: "none",
      //   },
      //   0,
      // )
      // .to(approachWordmark, {
      //   x: "-63vw",
      //   y: "-68vh",
      //   scale: 0.78,
      //   opacity: 0.14,
      //   duration: 1,
      //   ease: "none",
      // });
    } else {
      // gsap.set(approachWordmark, { clearProps: "transform,opacity" });

      gsap.fromTo(
        processItems,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-grid",
            start: "top 82%",
            once: true,
          },
        },
      );
    }

    // FIXED BACK-TO-TOP BUTTON
    const backTopButton = document.querySelector(".back-top");

    backTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });

    ScrollTrigger.create({
      start: "top -400",
      onUpdate: (self) => {
        backTopButton.classList.toggle("is-visible", self.scroll() > 400);
      },
    });

    // CURRENT YEAR
    document.getElementById("year").innerHTML = new Date().getFullYear();
    ScrollTrigger.refresh();
  }
});

function alertfunction(text) {
  const alertBox = document.createElement("div");
  alertBox.className = "custom-alert";
  alertBox.innerHTML = `
    <i class="fa-solid fa-circle-info"></i>
    <span>${text}</span>
  `;

  document.body.appendChild(alertBox);

  requestAnimationFrame(() => {
    alertBox.classList.add("show");
  });

  setTimeout(() => {
    alertBox.classList.remove("show");

    setTimeout(() => {
      alertBox.remove();
    }, 350);
  }, 2000);
}
