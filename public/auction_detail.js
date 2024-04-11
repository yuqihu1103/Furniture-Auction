document.addEventListener("DOMContentLoaded", () => {
    const queryBtn = document.getElementById("query-btn")
    const auctionDataDiv = document.getElementById("auction-data");
    const auctionResultDiv = document.getElementById("auction-result");
    queryBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const auctionId = document.getElementById('auction-id').value;
        try {
            const response = await fetch(`/auctions/${auctionId}`);
            const data = await response.json();
            if (response.ok) {
                const auction = data.auction[0];
                document.getElementById('auction-image').src = auction.picture_urls;
                // Create a new row for each attribute in the auction object
                const table = document.getElementById('auction-info-table');
                for (const [key, value] of Object.entries(auction)) {
                    const row = table.insertRow();
                    const cell1 = row.insertCell(0);
                    const cell2 = row.insertCell(1);
                    cell1.textContent = key;
                    cell2.textContent = value;
                }
                auctionDataDiv.style.display = "block";
                auctionResultDiv.style.display = "none";
            } else {
                auctionResultDiv.textContent = data.error;
                auctionDataDiv.style.display = "none";
                auctionResultDiv.style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            auctionResultDiv.textContent =
                "An error occurred. Please try again later.";
            auctionDataDiv.style.display = "none";
            auctionResultDiv.style.display = "block";
        }
    });
});
