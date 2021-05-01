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
    warningDiv.innerText = "";
}