// Adapted from https://www.superhi.com/library/posts/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll
$(document).on("scroll", function () {
    var pageTop = $(document).scrollTop()
    var pageBottom = pageTop + $(window).height()
    var tags = $("section")
    
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]

        if ($(tag).position().top < pageBottom) {
            $(tag).addClass("visible")

            visibleSectionId = $(tag).attr('id');
            if (visibleSectionId === "section-transition-before-color-map") {
                checkCategoryDecadeValidity();
            }
        } 
        else {  
            $(tag).removeClass("visible")
        }
    }
});

let elementIds = [["story-electricity", "story-birth", "story-urban"],
                ["video-electricity", "video-birth", "video-urban"]];


function checkCategoryDecadeValidity() {
    var warningDiv = document.getElementById('warning-category-decade');
    if (chosenCategory == undefined) {
        warningDiv.innerText = "Please choose the category for the visualization before continuing.";
        return;
    }
    if (chosenDecade == undefined) {
        warningDiv.innerText = "Please choose the decade for the visualization before continuing.";
        return;
    }
    warningDiv.style.display = "none";
    if (chosenCategory === "electricity") {
        document.getElementById("story-electricity").style.display = "block";
        document.getElementById("video-electricity").style.display = "block";
        hideOtherElements(0);
    }
    else if (chosenCategory === "skilled-birth") {
        document.getElementById("story-birth").style.display = "block";
        document.getElementById("video-birth").style.display = "block";
        hideOtherElements(1);
    }
    else if (chosenCategory === "urban-agglomerate") {
        document.getElementById("story-urban").style.display = "block";
        document.getElementById("video-urban").style.display = "block";
        hideOtherElements(2);
    }
    return;
}

function hideOtherElements(curElement) {
    for (let i=0;i<3;i++) {
        if (i === curElement) continue;
        document.getElementById(elementIds[0][i]).style.display = "none";
        document.getElementById(elementIds[1][i]).style.display = "none";
    }
}

function backToCategoryForm() {
    let categoryForm = document.getElementById("section-user-choose-category");
    categoryForm.scrollIntoView();
}