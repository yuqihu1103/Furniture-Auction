document.addEventListener("DOMContentLoaded", () => {
    const queryBtn = document.getElementById("query-btn")
    const auctionDataDiv = document.getElementById("auction-data");
    const auctionResultDiv = document.getElementById("auction-result");
    const bidResultDiv = document.getElementById("bid-result");
    const bidBtn = document.getElementById("bid-btn");
    const showBidBtn = document.getElementById("show-bid-btn");
    const showBidResultDiv = document.getElementById("show-bid-result");
    const bidTable = document.getElementById("bidTable");
    queryBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const auctionId = document.getElementById('auction-id').value;
        try {
            const response = await fetch(`/auctions/${auctionId}`);
            const data = await response.json();
            if (response.ok) {
                const auction = data.auction;
                document.getElementById('auction-image').src = auction.picture_urls;
                // Create a new row for each attribute in the auction object
                const table = document.getElementById('auction-info-table');
                while (table.rows.length > 0) {
                    table.deleteRow(0);
                }
                while (bidTable.rows.length > 1) {
                    bidTable.deleteRow(bidTable.rows.length - 1);
                }
                bidTable.style.display = "none";
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

    bidBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const bidPrice = document.getElementById('bid-price').value;
        const auctionId = document.getElementById('auction-id').value;
        try {
            const response = await fetch("/place_bid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ auctionId, bidPrice }),
            });
            const data = await response.json();
            if (response.ok) {
                bidResultDiv.textContent = data.message;
            } else {
                bidResultDiv.textContent = data.error;
            }
        } catch (error) {
            console.error("Error:", error);
            bidResultDiv.textContent =
                "An error occurred. Please try again later.";
        }
    });

    showBidBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const auctionId = document.getElementById('auction-id').value;
        try {
            const response = await fetch(`/get_bids/${auctionId}`);
            const data = await response.json();
            if (response.ok) {
                const bids = data.bids;
                while (bidTable.rows.length > 1) {
                    bidTable.deleteRow(bidTable.rows.length - 1);
                }
                bids.forEach(bid => {
                    const row = bidTable.insertRow();
                    row.insertCell(0).textContent = bid.bid_id;
                    row.insertCell(1).textContent = bid.bid_price.toFixed(2);
                    row.insertCell(2).textContent = new Date(bid.bid_time).toLocaleString();
                    row.insertCell(3).textContent = bid.bidder_id;
                    row.insertCell(4).textContent = bid.username;
                });
                bidTable.style.display = "block";
            } else {
                showBidResultDiv.textContent = data.error;
            }
        } catch (error) {
            console.error("Error:", error);
            showBidResultDiv.textContent =
                "An error occurred. Please try again later.";
        }
    });
});
