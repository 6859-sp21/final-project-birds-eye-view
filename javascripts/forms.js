var chosenCategory;

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