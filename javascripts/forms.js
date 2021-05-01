var chosenCategory;
var chosenDecade;

/**
 * Used at User Choose Category section, where the user choose the category of maps to explore.
 * @param {string} categoryId 
 */
function chooseCategory(categoryId) {
    if (chosenCategory !== undefined) { // reset prev category
        document.getElementById(chosenCategory).style = "opacity:0.5"
    }

    chosenCategory = categoryId;

    document.getElementById(chosenCategory).style = "opacity:1.0"
}

function chooseDecade(decadeId) {
    if (chosenDecade !== undefined) { // reset prev decade
        document.getElementById(chosenDecade).style = "color: lightslategray; transition: .5s ease; backface-visibility: hidden; vertical-align: middle;"
    }

    chosenDecade = decadeId;

    document.getElementById(chosenDecade).style = "color: white; transition: .5s ease; backface-visibility: hidden; vertical-align: middle;"
}