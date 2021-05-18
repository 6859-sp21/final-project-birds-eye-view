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

let elementIds = ["story-electricity-1990", "story-electricity-2000", "story-electricity-2010",
                    "story-birth-1990", "story-birth-2000", "story-birth-2010",
                    "story-urban-1990", "story-urban-2000", "story-urban-2010"];

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
    /*var questionDiv = document.getElementById('question-before-color');
    var questionDescDiv = document.getElementById('question-description-before-color');
    if (chosenCategory === "electricity") {
        questionDiv.innerText = "How well do you know about the world's access to electricity in " + chosenDecade + "s?";
    }
    else if (chosenCategory === "urban-agglomerate") {
        questionDiv.innerText = "How well do you know about the world's state of urban agglomeration in " + chosenDecade + "s?";
    }
    else if (chosenCategory === "skilled-birth") {
        questionDiv.innerText = "How well do you know about the world's access to skilled health staff during birth in " + chosenDecade + "s?";
    }
    questionDescDiv.innerHTML = `
    We all live different lifestyles of varying levels of abundance and access to different kinds of resources. 
    <br>
    While we are familiar with the resources available in our surroundings in this decade, 
    it is time to see in bird's eye view on other countries' or other decades' access to different resources.`;*/

    if (chosenCategory === "electricity") {
        if (chosenDecade === "1990") {
            document.getElementById("story-electricity-1990").style.display = "block";
            hideOtherElements("story-electricity-1990");
        }
        else if (chosenDecade === "2000") {
            document.getElementById("story-electricity-2000").style.display = "block";
            hideOtherElements("story-electricity-2000");
        }
        else if (chosenDecade === "2010") {
            document.getElementById("story-electricity-2010").style.display = "block";
            hideOtherElements("story-electricity-2010");
        }
    }
    else if (chosenCategory === "skilled-birth") {
        if (chosenDecade === "1990") {
            document.getElementById("story-birth-1990").style.display = "block";
            hideOtherElements("story-birth-1990");
        }
        else if (chosenDecade === "2000") {
            document.getElementById("story-birth-2000").style.display = "block";
            hideOtherElements("story-birth-2000");
        }
        else if (chosenDecade === "2010") {
            document.getElementById("story-birth-2010").style.display = "block";
            hideOtherElements("story-birth-2010");
        }
    }
    else if (chosenCategory === "urban-agglomerate") {
        if (chosenDecade === "1990") {
            document.getElementById("story-urban-1990").style.display = "block";
            hideOtherElements("story-urban-1990");
        }
        else if (chosenDecade === "2000") {
            document.getElementById("story-urban-2000").style.display = "block";
            hideOtherElements("story-urban-2000");
        }
        else if (chosenDecade === "2010") {
            document.getElementById("story-urban-2010").style.display = "block";
            hideOtherElements("story-urban-2010");
        }
    }
    return;
}

function hideOtherElements(curElement) {
    for (const cat of elementIds) {
        if (cat === curElement) continue;
        document.getElementById(cat).style.display = "none";
    }
}

function backToCategoryForm() {
    let categoryForm = document.getElementById("section-user-choose-category");
    categoryForm.scrollIntoView();
}