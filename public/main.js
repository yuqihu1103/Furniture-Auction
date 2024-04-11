
document.addEventListener("DOMContentLoaded", () => {
    const listFurn = document.getElementById("furniture-list");
    const button = document.getElementById("showFurniture");
    const button1 = document.getElementById("orderByLikes");
    const showMyFurnitureBtn = document.getElementById("showMyFurniture");
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("event")
      listFurn.innerHTML = "";
      try {
        const response = await fetch("/furniture", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        });
  
        const data = await response.json();
  
        if (response.ok) {

            for(let i = 0; i < data.length; i++){

                listFurn.innerHTML += "<li>" + "Furniture ID : " + data[i].furniture_id + " Type :" + data[i].type 
                + " Description : " + data[i].description + "<img src="+ data[i].picture_urls +" width=300px> " + "</img>" + 
                " Seller ID : " + data[i].seller_id + " Condition : "+ data[i].condition +  "</li>";
        
            }

        } else {
            listFurn.innerHTML = data.error;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

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
  
              for(let i = 0; i < data.length; i++){
  
                  listFurn.innerHTML += "<li>" + "Furniture ID : " + data[i].furniture_id + " Type :" + data[i].type 
                  + " Description : " + data[i].description + "<img src="+ data[i].picture_urls +" width=300px> " + "</img>" + 
                  " Seller ID : " + data[i].seller_id + " Condition : "+ data[i].condition + " Likes : " + data[i].like_count + "</li>";
          
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

                for(let i = 0; i < data.length; i++){

                    listFurn.innerHTML += "<li>" + "Furniture ID : " + data[i].furniture_id + " Type :" + data[i].type
                        + " Description : " + data[i].description + "<img src="+ data[i].picture_urls +" width=300px> " + "</img>" +
                        " Seller ID : " + data[i].seller_id + " Condition : "+ data[i].condition + " Likes : " + data[i].like_count + "</li>";

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
