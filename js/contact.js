const form = document.getElementById("contact-form");
const showMessage = document.getElementById("showMessage");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous messages
    if (showMessage) {
      showMessage.innerHTML = "";
    }

    try {
      const formData = new FormData(form);

      const response = await fetch("https://formly.email/submit", {
        method: "POST",
        headers: {
          // Keep this to ask for JSON, but prepare for fallback
          Accept: "application/json",
        },
        body: formData,
      });

      // 1. Check if the network response was successful first (status code 200-299)
      if (response.ok) {
        let isSuccess = true;
        let msg = "Thank you for your submission!";

        // 2. Safely try to parse JSON only if the response content-type says it's JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          isSuccess = result.success !== false; // Fallback to true unless explicitly false
          if (result.message) msg = result.message;
        }

        if (isSuccess) {
          showMessage.innerHTML = msg;
          showMessage.style.color = "green";
          form.reset(); // Successfully resets form now
        } else {
          showMessage.innerHTML = msg || "Submission failed.";
          showMessage.style.color = "red";
        }
      } else {
        // Handle server errors (e.g., 400, 404, 500)
        let errorMsg = "Submission failed.";
        try {
          const result = await response.json();
          errorMsg = result.message || errorMsg;
        } catch (e) {
          // Response wasn't JSON
        }
        showMessage.innerHTML = errorMsg;
        showMessage.style.color = "red";
      }
    } catch (error) {
      // This will now ONLY trigger for real network failures (like no internet)
      console.error("Submission error:", error);
      showMessage.innerHTML = "An error occurred. Please try again.";
      showMessage.style.color = "red";
    }
  });
}
