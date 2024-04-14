
document.addEventListener("DOMContentLoaded", async() => {
    const listFurn = document.getElementById("furniture-list");
    const button = document.getElementById("showFurniture");
    const button1 = document.getElementById("orderByLikes");
    const button2 = document.getElementById("filter-btn");
    const showMyFurnitureBtn = document.getElementById("showMyFurniture");
    
    try {
      const response = await fetch("/furniture", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      const data = await response.json();

      if (response.ok) {
        for (let i = 0; i < data.length; i++) {
          listFurn.innerHTML += `
              <div class="furniture-card">
                  <div class="furniture-info">
                      <h2 class="furniture-title">${data[i].type}</h2>
                      <p class="furniture-description">${data[i].description}</p>
                      <p class="furniture-id">ID: ${data[i].furniture_id}</p>
                      <p class="furniture-seller">Seller: ${data[i].seller_id}</p>
                      <p class="furniture-condition">Condition: ${data[i].condition}</p>
                  </div>
                  <img src="${data[i].picture_urls}" alt="Furniture Image" class="furniture-image"/>
              </div>
          `;
        }
      } else {
          listFurn.innerHTML = data.error;
      }
    } catch (error) {
        console.error("Error:", error);
    }

    button1.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("event")
        listFurn.innerHTML = "";
        try {
          const response = await fetch("/furniture_likes", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(),
          });
    
          const data = await response.json();
    
          if (response.ok) {
  
            for (let i = 0; i < data.length; i++) {
              listFurn.innerHTML += `
                  <div class="furniture-card">
                      <div class="furniture-info">
                          <h2 class="furniture-title">${data[i].type}</h2>
                          <p class="furniture-description">${data[i].description}</p>
                          <p class="furniture-id">ID: ${data[i].furniture_id}</p>
                          <p class="furniture-seller">Seller: ${data[i].seller_id}</p>
                          <p class="furniture-condition">Condition: ${data[i].condition}</p>
                      </div>
                      <img src="${data[i].picture_urls}" alt="Furniture Image" class="furniture-image"/>
                  </div>
              `;
            }
  
  
          } else {
            console.log("Adaddsasdas");
              listFurn.innerHTML = data.error;
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });

    showMyFurnitureBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("event")
      listFurn.innerHTML = "";
      try {
          const response = await fetch("/my_listing", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(),
          });

          const data = await response.json();

          if (response.ok) {

            for (let i = 0; i < data.length; i++) {
              listFurn.innerHTML += `
                  <div class="furniture-card">
                      <div class="furniture-info">
                          <h2 class="furniture-title">${data[i].type}</h2>
                          <p class="furniture-description">${data[i].description}</p>
                          <p class="furniture-id">ID: ${data[i].furniture_id}</p>
                          <p class="furniture-seller">Seller: ${data[i].seller_id}</p>
                          <p class="furniture-condition">Condition: ${data[i].condition}</p>
                      </div>
                      <img src="${data[i].picture_urls}" alt="Furniture Image" class="furniture-image"/>
                  </div>
              `;
            }

          } else {
              console.log("Adaddsasdas");
              listFurn.innerHTML = data.error;
          }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    button2.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("event")
        listFurn.innerHTML = "";
        const type = document.getElementById("filter-type").value;
        if(!type || type === ""){
            listFurn.innerHTML = "Please input a type";
            return;
        }
        try {
            const response = await fetch(`/furniture_type?type=${type}`);
            const data = await response.json();
            if (response.ok) {
                if(data.length == 0){
                    listFurn.innerHTML = "No result";
                    return;
                }
                for (let i = 0; i < data.length; i++) {
                  listFurn.innerHTML += `
                      <div class="furniture-card">
                          <div class="furniture-info">
                              <h2 class="furniture-title">${data[i].type}</h2>
                              <p class="furniture-description">${data[i].description}</p>
                              <p class="furniture-id">ID: ${data[i].furniture_id}</p>
                              <p class="furniture-seller">Seller: ${data[i].seller_id}</p>
                              <p class="furniture-condition">Condition: ${data[i].condition}</p>
                          </div>
                          <img src="${data[i].picture_urls}" alt="Furniture Image" class="furniture-image"/>
                      </div>
                  `;
                }
  

            } else {
                console.log("Adaddsasdas");
                listFurn.innerHTML = data.error;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
  });
