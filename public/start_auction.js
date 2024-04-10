// login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const start_auction_success_div = document.getElementById("start_auction_success");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const furnitureId = formData.get("furnitureId");
        const startPrice = formData.get("startPrice");;

        try {
            const response = await fetch("/start_auction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ furnitureId, startPrice }),
            });

            const data = await response.json();

            if (response.ok) {
                start_auction_success_div.textContent = data.message;
            } else {
                start_auction_success_div.textContent = data.error;
            }
        } catch (error) {
            console.error("Error:", error);
            start_auction_success_div.textContent =
                "An error occurred. Please try again later.";
        }
    });
});
