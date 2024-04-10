// login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const loginSuccessDiv = document.getElementById("loginSuccess");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");
    const admin = formData.get("isAdmin");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, admin }),
      });

      const data = await response.json();

      if (response.ok) {
        loginSuccessDiv.textContent = data.message;
      } else {
        loginSuccessDiv.textContent = data.error;
      }
    } catch (error) {
      console.error("Error:", error);
      loginSuccessDiv.textContent =
        "An error occurred. Please try again later.";
    }
  });
});
