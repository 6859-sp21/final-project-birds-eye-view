var chosenCategory;
var chosenDecade;

/**
 * Used at User Choose Category section, where the user choose the category of maps to explore.
 * @param {string} categoryId 
 */
function chooseCategory(categoryId) {
    if (chosenCategory !== undefined) { // reset prev category
        document.getElementById(chosenCategory).style = "opacity:0.5";
    }

    chosenCategory = categoryId;
    document.getElementById(chosenCategory).style = "opacity:1.0";
    document.getElementById("category-warning").innerText = "";
    document.getElementById("section-category-footer").style.visibility = "visible";
    
    updateReflectionForm(chosenCategory);
}

function updateReflectionForm(category) {
    let reflectionIds = [["form-electricity-1", "form-birth-1", "form-urban-1"],
                        ["form-electricity-2", "form-birth-2", "form-urban-2"],
                        ["form-electricity-3", "form-birth-3", "form-urban-3"],
                        ["response-electricity-1", "response-birth-1", "response-urban-1"],
                        ["response-electricity-2", "response-birth-2", "response-urban-2"],
                        ["response-electricity-3", "response-birth-3", "response-urban-3"]];
    let idNum = 0;
    if (category === "skilled-birth") idNum = 1;
    else if (category === "urban-agglomerate") idNum = 2;

    for (let i=0;i<reflectionIds.length;i++) {
        // make relevant form visible
        document.getElementById(reflectionIds[i][idNum]).style.display = "block";
        // make other forms non-visible
        for (let j=0;j<3;j++) {
            if (idNum === j) continue;
            document.getElementById(reflectionIds[i][j]).style.display = "none";
        }
    }
}

function chooseDecade(decadeId) {
    if (chosenDecade !== undefined) { // reset prev decade
        document.getElementById(chosenDecade).style = "color: lightslategray; transition: .5s ease; backface-visibility: hidden; vertical-align: middle;"
    }

    chosenDecade = decadeId;

    document.getElementById(chosenDecade).style = "color: white; transition: .5s ease; backface-visibility: hidden; vertical-align: middle;";
    document.getElementById("decade-warning").innerText = "";
    document.getElementById("section-decade-footer").style.visibility = "visible";
}

