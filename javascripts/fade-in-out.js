// Referenced from https://www.superhi.com/library/posts/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll
$(document).on("scroll", function () {
    var pageTop = $(document).scrollTop()
    var pageBottom = pageTop + $(window).height()
    var tags = $("section")
    
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]
    
        if ($(tag).position().top < pageBottom) {
            $(tag).addClass("visible")
        } 
        else {  
            $(tag).removeClass("visible")
        }
    }
});