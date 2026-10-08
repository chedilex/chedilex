// Cookie Helper Functions
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Immediate Theme Check (Run as soon as script loads to prevent flash)
(function initTheme() {
  const consent = getCookie("cookieConsent");
  if (consent === "true") {
    const savedTheme = getCookie("theme");
    if (savedTheme) {
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      }
    }
  }
})();

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  const modeBtn = document.querySelector(".mode-btn");
  const themeIcon = modeBtn ? modeBtn.querySelector("i") : null;
  if (themeIcon) {
    if (theme === "dark") {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    } else {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }
  }

  if (getCookie("cookieConsent") === "true") {
    setCookie("theme", theme, 30);
  }
}

// Cookie Consent Logic
function checkConsent() {
  const cookieBanner = document.getElementById("cookieBanner");
  const consent = getCookie("cookieConsent");

  if (!consent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.style.display = "flex";
    }, 1500);
  } else if (consent === "true") {
    const savedTheme = getCookie("theme");
    if (savedTheme) setTheme(savedTheme);
  }
}

// Event Listeners setup
document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("acceptCookies");
  const declineBtn = document.getElementById("declineCookies");
  const cookieBanner = document.getElementById("cookieBanner");

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      setCookie("cookieConsent", "true", 30);
      if (cookieBanner) cookieBanner.style.display = "none";
      const currentTheme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      setCookie("theme", currentTheme, 30);
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      if (cookieBanner) cookieBanner.style.display = "none";
    });
  }

  checkConsent();
});

// Loader
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
      for (let i = 0; i <= 10; i++) {
        const o = 1 - i / 10;
        loader.style.opacity = o;
      }
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }
  });
});

// back to top button
const mybutton = document.getElementById("backToTop");
if (mybutton) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  };

  mybutton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Typing Animation
const typingElement = document.querySelector(".typing");
if (typingElement) {
  const typed = new Typed(".typing", {
    strings: ["Excellence"],
    typeSpeed: 70,
    backSpeed: 50,
    loop: true,
  });
}

// custom alert function
function customAlert(icon, text, bgcol) {
  const customAlert = document.createElement("div");

  customAlert.style.cssText = `
    background-color: ${bgcol};
    color: white;
    padding: 10px 14px;
    max-width: 90%;
    border-radius: 5px;
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;

  customAlert.innerHTML = `
    <div class="custom-alert-icon" style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.25);
      font-size: 14px;
      flex-shrink: 0;
    ">
      <i class="${icon}" style="color: white; line-height: 1;"></i>
    </div>
    <div class="custom-alert-text">
      <p style="
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
      ">${text}</p>
    </div>
  `;

  document.body.appendChild(customAlert);

  // fade in
  requestAnimationFrame(() => {
    customAlert.style.opacity = "1";
  });

  // fade out + remove
  setTimeout(() => {
    customAlert.style.opacity = "0";
    setTimeout(() => customAlert.remove(), 300);
  }, 3000);
}
