// login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const add_auction_success_div = document.getElementById("add_auction_success");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const type = formData.get("type");
        const description = formData.get("description");
        const picture_urls = formData.get("picture_urls");
        const condition = formData.get("condition");

        try {
            const response = await fetch("/add_furniture", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type, description, picture_urls, condition }),
            });

            const data = await response.json();

            if (response.ok) {
                add_auction_success_div.textContent = data.message;
            } else {
                add_auction_success_div.textContent = data.error;
            }
        } catch (error) {
            console.error("Error:", error);
            add_auction_success_div.textContent =
                "An error occurred. Please try again later.";
        }
    });
});
