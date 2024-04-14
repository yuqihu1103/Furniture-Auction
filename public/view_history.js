
document.addEventListener("DOMContentLoaded", async () => {
    const viewsDiv = document.getElementById("views");
    const table = document.getElementById("views-table");
    try {
        const response = await fetch("/viewed");
        const data = await response.json();
        if (response.ok) {
            const views = data.results;
            for(const view of views){
                const row = table.insertRow();
                for (const key in view) {
                    if(key === "picture_urls") continue;
                    if(key === "furniture_id"){
                        const linkCell = row.insertCell();
                        const link = document.createElement('a');
                        link.href = `/auction_detail.html?id=${view[key]}`;
                        link.textContent = view[key];
                        linkCell.appendChild(link);
                    }
                    else row.insertCell().textContent = view[key];
                }
            }
        } else {
            viewsDiv.textContent = data.error;
        }
    } catch (error) {
        console.error("Error:", error);
        viewsDiv.textContent =
            "An error occurred. Please try again later.";
    }
});
