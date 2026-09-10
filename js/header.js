document.addEventListener("DOMContentLoaded", function () {
  const headerMain = document.getElementById("headerMain");
  if (headerMain) {
    headerMain.innerHTML = `
            <div class="container ">
            <nav class="navbar">
                <a href="#" class="logo">
                    <img src="images/chedilex-logo-removebg.png" alt="logo">
                </a>
                <div class="nav-links " id="navLinks">
                    <a aria-label="go to home section" href="index.html">Home</a>
                    <a aria-label="go to about section" href="about.html">About</a>
                    <a aria-label="go to portfolio section" href="portfolio.html">Portfolio</a>
                    <a aria-label="go to news section" href="news.html">News</a>
                    <a aria-label="go to contact section" href="contact.html">Contact</a>
                </div>
                <div class="">
                    <h1 class="logoName">CHEDILEX</h1>
                </div>
                <div class="icons-content ">
                    <a href="login.html" class="mode-btn ">
                      <i class="fa-regular fa-circle-user"></i>
                    </a>
                    <div class="mobile-menu-btn " id="mobileMenuBtn">
                        <i class="fas fa-bars"></i>
                    </div>
                </div>
            </nav>
        </div>
    `;
  }

  const headerBack = document.getElementById("headerBack");
  if (headerBack) {
    headerBack.innerHTML = `
        <div class="container">
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <img src="images/chedilex-logo-removebg.png" alt="logo">
                </a>

                <div>
                    <h1 class="logoName">CHEDILEX</h1>
                </div>
                <div class="icons-content">
                    <div onclick="window.history.back(); return false;" class="back-btn">
                        <i class="fa-solid fa-arrow-left"></i>
                    </div>
                </div>
            </nav>
        </div>
    `;
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileMenuBtn.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      if (headerMain) {
        headerMain.classList.add("header-scrolled");
      }
      if (headerBack) {
        headerBack.classList.add("header-scrolled");
      }
    } else {
      if (headerMain) {
        headerMain.classList.remove("header-scrolled");
      }
      if (headerBack) {
        headerBack.classList.remove("header-scrolled");
      }
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const targetId = href.substring(hashIndex);
      if (targetId === "#") return;

      if (
        href.startsWith("index.html") &&
        !window.location.pathname.endsWith("index.html") &&
        window.location.pathname !== "/" &&
        !window.location.pathname.endsWith("/")
      ) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });

  // Active Link Logic
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinksList = document.querySelectorAll(".nav-links a");
  const summaries = document.querySelectorAll(".nav-links details summary");

  function updateActiveLink() {
    let currentSectionId = "";

    if (currentPath === "index.html" || currentPath === "") {
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          currentSectionId = section.getAttribute("id");
        }
      });
      if (!currentSectionId && window.scrollY < 100) {
        currentSectionId = "home";
      }
    }

    // Reset all
    navLinksList.forEach((link) => link.classList.remove("active"));
    summaries.forEach((summary) => summary.classList.remove("active"));

    navLinksList.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      let isActive = false;
      if (currentPath === "") {
        if (currentSectionId && href === `${currentSectionId}`) {
          isActive = true;
        }
      } else {
        if (href === currentPath || href.startsWith(currentPath + "#")) {
          isActive = true;
        }
      }

      if (isActive) {
        link.classList.add("active");
        const details = link.closest("details");
        if (details) {
          const summary = details.querySelector("summary");
          if (summary) summary.classList.add("active");
        }
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // Run once on load
});
