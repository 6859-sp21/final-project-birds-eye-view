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
    var questionDiv = document.getElementById('question-before-color');
    var questionDescDiv = document.getElementById('question-description-before-color');
    if (chosenCategory === "electricity") {
        questionDiv.innerText = "How well do you know about the world's access to electricity in " + chosenDecade + "s?";
    }
    else if (chosenCategory === "internet") {
        questionDiv.innerText = "How well do you know about the world's access to Internet in " + chosenDecade + "s?";
    }
    else if (chosenCategory === "school-completion") {
        questionDiv.innerText = "How well do you know about the world's primary school completion in " + chosenDecade + "s?";
    }
    else if (chosenCategory === "skilled-birth") {
        questionDiv.innerText = "How well do you know about the world's access to skilled health staff during birth in " + chosenDecade + "s?";
    }
    questionDescDiv.innerHTML = `
    We all live different lifestyles of varying levels of abundance and access to different kinds of resources. 
    <br>
    While we are familiar with the resources available in our surroundings in this decade, 
    it is time to see in bird's eye view on other countries' or other decades' access to different resources.`;
    return;
}