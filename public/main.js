

const furnitureUIElement = document.getElementById("furniture-list");

const furnitureObject = {

    furnitureName : "nice-couch",
    furnitureType : "couch"

} 

const tempList = [furnitureObject,furnitureObject,furnitureObject,furnitureObject,furnitureObject];

export function populateFurniture(furnitureList){

    console.log(furnitureList.length)
    for(let i = 0; i < furnitureList.length; i++){

        furnitureUIElement.innerHTML += "<li>" + furnitureList[i].furnitureName + "</li>";

    }


}

populateFurniture(tempList);