// login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const loginSuccessDiv = document.getElementById("RegisterSuccess");
  const redirect = document.getElementById("redirect");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");
    const phone = formData.get("phoneNum");
    const admin = formData.get("isAdmin");

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, phone, admin }),
      });

      const data = await response.json();

      if (response.ok) {
        loginSuccessDiv.textContent = data.message;
        redirect.innerHTML = `<a href="login.html" id="loginUI">Login now</a>`;
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
