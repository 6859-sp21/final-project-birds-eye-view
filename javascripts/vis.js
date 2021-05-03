// TODO: please put any d3 function here
// you can use 'chosenCategory' and 'chosenDecade' to get the user-chosen category and decade

let width = 800, height = 400, centered; // TODO: change these to fit the screen
let projection = d3.geoEquirectangular();
projection.fitSize([width, height], electricity_decade_fin);
let geoGenerator = d3.geoPath().projection(projection);

const guessedCountries = new Set()

var colorScale = d3.scaleLog()
// linear scale
.domain([1, 20, 40, 60, 80, 100])
.range(d3.schemeBlues[6]);

var guessEntryBox = document.getElementById('hashtag-search-box');
guessEntryBox.style.visibility = "hidden";
var percentAddOn = document.getElementById('basic-addon1');
percentAddOn.style.visibility = "hidden";
var guessButton = document.getElementById('guess-button');
guessButton.style.visibility = "hidden";

let svg = d3.select("#map-placeholder").append('svg')
            .style("width", width).style("height", height);

let rect_svg = svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "black");

    let legend_svg = svg.append("g")
    .attr("class", "legendQuant")
    .attr("transform", "translate(0,200)")
    .attr("fill", "white");
    
    var legendLinear = d3.legendColor()
    .shapeWidth(30)
    .cells([1, 20, 40, 60, 80, 100])
    .orient('vertical')
    .scale(colorScale)
    .title("Number of Tweets")
    
    svg.select(".legendQuant")
    .call(legendLinear);

const WORLDWIDE = "Worldwide";
// ---  Default values
var currentDate = '11/3/20';
var currentHashtag = "";
var includeUS = false;
var currentCountry = WORLDWIDE;

var tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction('n').offset(function() {
                if (currentCountry == WORLDWIDE) {
                    return [this.getBBox().height/4, this.getBBox().width/4]
                } else {
                    return [this.getBBox().height, this.getBBox().width]
                }
              }) 
            .html(function(d) {
                if (guessedCountries.has(d.properties.name)) {
                    var totalTweet = newData.get(d.properties.name) || 0;
                    return d.properties.name + ": " + totalTweet.toFixed(1) + " %";
                } else {
                    return d.properties.name;
                }
            });
svg.call(tip);

let map_svg = svg.append("g");
const newData = electricity_decade_fin.features
.filter(function(data) {
    return (data.properties.year == 2010);
})
var tweetsByCountry = d3.rollup(newData, v => d3.sum(v, d => d.properties.value), d => d.properties.country);
console.log(tweetsByCountry);

map_svg.selectAll("path")
        .data(world_map_json.features)
        .enter()
        .append("path")
        .attr( "fill", function (d) {
            console.log(tweetsByCountry.get(d.properties.name));
            d.total = tweetsByCountry.get(d.properties.name) || 0;
            if (! guessedCountries.has(d.properties.name)) {
                return "#808080";
            } else {
                return colorScale(d.total);
            }
        })
        .style('cursor', 'pointer')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("fill", "white")
        .attr("d", geoGenerator )
        .on("click", clicked);
updateMap();

// ------------------------- SLIDER CODE -------------------------
// adapted from https://codepen.io/trevanhetzel/pen/rOVrGK

// var sheet = document.createElement('style'),  
//   $rangeInput = $('.range input'),
//   prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

// document.body.appendChild(sheet);

// var getTrackStyle = function (el) {  
//   var curVal = el.value,
//       val = (curVal - 1) * 4.16666666667,
//       style = '';
  
//   // Set active label
//   $('.range-labels li').removeClass('active selected');
  
//   var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
  
//   curLabel.addClass('active selected');
//   return style;
// }

// $rangeInput.on('input', function () {
//   sheet.textContent = getTrackStyle(this);
// });

// // Change input value on label click
// $('.range-labels li').on('click', function () {
//   var index = $(this).index();
  
//   $rangeInput.val(index + 1).trigger('input');
//   updateTime(index + 1);
// });



// var testDates = ['10/15/20', '10/16/20', '10/17/20', '10/18/20', '10/19/20',
//                  '10/20/20', '10/21/20', '10/22/20', '10/23/20', '10/24/20',
//                  '10/25/20', '10/26/20', '10/27/20', '10/28/20', '10/29/20',
//                  '10/30/20', '10/31/20', '11/1/20', '11/2/20', '11/3/20',
//                  '11/4/20', '11/5/20', '11/6/20', '11/7/20', '11/8/20'];

// // when the input range changes update the value 
// d3.select(".range input").on("input", function() {
//     updateTime(+this.value);
// });

// // update with value
// function updateTime(value) {
//     currentDate = testDates[value - 1];
//     updateMap();
//     updateWordCloud(currentCountry);
// };

// ------------------------- END SLIDER CODE -------------------------

// const radioButtonInput = document.getElementById("btn-group");
// radioButtonInput.addEventListener('input', updateIncludeUS);

// function updateIncludeUS(e) {
//     var buttonPushed = e.target.value;
//     if (buttonPushed == "includeUS") {
//         if (includeUS) return;
//         includeUS = true;
//     }
//     else {
//         if (!includeUS) return;
//         includeUS = false;
//     }
//     updateMap();
//     updateWordCloud(currentCountry);
// }

// const searchBoxInput = document.getElementById("hashtag-search-box");
// searchBoxInput.addEventListener('input', updateSearch);

// function updateSearch(e) {
//     var searchedHashtag = e.target.value.toLowerCase();
//     currentHashtag = searchedHashtag;
//     updateMap();
// }

// function updateSearchWOListener(newText) {
//     currentHashtag = newText;
//     updateMap();
// }

// const buttonSearchBar = document.getElementById("button-searchbar");
// buttonSearchBar.addEventListener('click', clearSearch);

// function clearSearch() {
//     textInput.value = "";
//     updateSearchWOListener("");
// }

$('#guess-button').on('click', function () {
    var guessButton = document.getElementById('guess-button');
    guessButton.style.visibility = "hidden";
    var sidebarStats = document.getElementById('sidebar-stats');
    sidebarStats.innerHTML = "You guessed: " + " <br> Correct answer:";
    guessedCountries.add(currentCountry);
    console.log(guessedCountries);
    updateMap();
})

function updateMap() {
    console.log(chosenCategory, " chosenCategory")
    console.log(chosenDecade, " chosenDecade")
    // Filter and get new data
    const newData = electricity_decade_fin.features
                         .filter(function(data) {
                             return (data.properties.year == 2010);
                         })
                        //  .filter(function(data) {
                        //     var dataHashtags = data.properties.hashtags.toLowerCase();
                        //     var isDataHasHashtag = dataHashtags.includes(currentHashtag);
                        //     var isDataCreatedAt = data.properties.created_at.includes(currentDate);
                        //     return isDataCreatedAt && isDataHasHashtag; 
                        //  });

    var tweetsByCountry = d3.rollup(newData, v => d3.sum(v, d => d.properties.value), d => d.properties.country);

    tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction('n').offset(function() {
                if (currentCountry == WORLDWIDE) {
                    return [this.getBBox().height/4, this.getBBox().width/4]
                } else {
                    return [this.getBBox().height, this.getBBox().width]
                }
              })
            .html(function(d) {
                if (guessedCountries.has(d.properties.name)) {
                    var totalTweet = tweetsByCountry.get(d.properties.name) || 0;
                    if (totalTweet === 0) return d.properties.name + ": " + "0%"
                    else return d.properties.name + ": " + totalTweet.toFixed(1) + " %";
                } else {
                    return d.properties.name;
                }
            });
    svg.call(tip);

    map_svg.selectAll("path")
    .data(world_map_json.features)
    .join("path")
    .attr( "fill", function (d) {
        console.log(d.properties)
        d.total =  tweetsByCountry.get(d.properties.name) || 0;
        if (! guessedCountries.has(d.properties.name)) {
            return "#808080";
        } else {
            return colorScale(d.total);
        }
      })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .attr("stroke", "black")
    .attr("border-color", "black")
    .attr("d", geoGenerator )
    .on("click", clicked);
}

function showGuessingTools(currentCountry, show) {
    if (show) {
        var GuessTitle = document.getElementById('wordcloud-title');
        GuessTitle.style.visibility = 'visible';
        GuessTitle.innerText = "What % of people in " + currentCountry + " do you think have access to electricity?" ;
        var guessEntryBox = document.getElementById('hashtag-search-box');
        guessEntryBox.style.visibility = 'visible';
        var percentAddOn = document.getElementById('basic-addon1');
        percentAddOn.style.visibility = "visible";
        var guessButton = document.getElementById('guess-button');
        guessButton.style.visibility = "visible";
    } else {
        var GuessTitle = document.getElementById('wordcloud-title');
        GuessTitle.style.visibility = 'hidden';
        var guessEntryBox = document.getElementById('hashtag-search-box');
        guessEntryBox.style.visibility = 'hidden';
        var percentAddOn = document.getElementById('basic-addon1');
        percentAddOn.style.visibility = "hidden";
        var guessButton = document.getElementById('guess-button');
        guessButton.style.visibility = "hidden";
    }
}

function clicked(d) {
    var x, y, k;
  
    if (d && centered !== d) {
        currentCountry = d.properties.name;
        var centroid = geoGenerator.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
        // show % selector and guesser
        showGuessingTools(currentCountry, true)
    } else {
        currentCountry = WORLDWIDE;
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
        // hide % selector and guesser
        showGuessingTools(currentCountry, false)
    }
  
    map_svg.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });
  
    map_svg.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");

    legend_svg.selectAll('*').remove();

    if (currentCountry == WORLDWIDE) {
        let legend_svg = svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(0,200)")
        .attr("fill", "white");
        
        var legendLinear = d3.legendColor()
        .shapeWidth(30)
        .cells([1, 20, 40, 60, 80, 100])
        .orient('vertical')
        .scale(colorScale)
        .title("% of People with Electricity");
        
        svg.select(".legendQuant")
        .call(legendLinear);
    } 
    
    // updateWordCloud(currentCountry);
}

// ------------------------ code for wordcloud -------------------------------
// var textInput = document.getElementById('hashtag-search-box');
// const word_width = 300; // TODO: change this
// const word_height = 250;
// const fontFamily = "Verdana, Arial, Helvetica, sans-serif";
// let word_svg = d3.select("#wordcloud-placeholder").append('svg')
//                 .style("width", word_width)
//                 .style("height", word_height)
//                 .style('fill', 'white')
//                 .attr("font-family", fontFamily)
//                 .attr("text-anchor", "middle")
//                 .append("g")
//                 .attr("transform", "translate(" + (word_width / 2) + "," + (word_height / 2) + ")");

// function updateWordCloudTitle(country, numOfHashtagShowed) {
//     var textInput = document.getElementById('wordcloud-title');
//     if (numOfHashtagShowed === 0) {
//         textInput.innerText = "No hashtags available for " + country + ".\n" + "Please choose other country or date.\n";
//         if (country === "United States") textInput.innerText += "Also, please don't forget to click 'Include US' button."
//     }
//     else {
//         textInput.innerText = "Top " + numOfHashtagShowed + " Hashtags: " + country;
//     }
// }

// function updateWordCloud(country) {
//     // Pre-process: get all the hashtags
//     // Filter by country
//     var rowsByCountry;
//     if (country === WORLDWIDE) { 
//         rowsByCountry = small_data.features
//                             .filter(function(data) {
//                                 if (includeUS) return true;
//                                 return data.properties.country !== "United States";
//                             });
//     }
//     else { // other country
//          rowsByCountry = small_data.features
//                                 .filter(function(data) {
//                                     return data.properties.country === country;
//                                 })
//                                 .filter(function(data) {
//                                     if (includeUS) return true;
//                                     return data.properties.country !== "United States";
//                                 });
//     }
//     // Filter by date
//     rowsByCountry = rowsByCountry.filter(function(data) {
//                         var isDataCreatedAt = data.properties.created_at.includes(currentDate);
//                         return isDataCreatedAt; 
//                     });

    // var allHashtagsNotFlattened = rowsByCountry
    //                               .map(function(d) {
    //                                 const hashtagList = d.properties.hashtags.substring(1, d.properties.hashtags.length-1).split(",");
    //                                 const hashtags = hashtagList.map(function(h) {
    //                                                                     let trimmedHash = "";
    //                                                                     for (let i=0;i<h.length;i++) {
    //                                                                         if (h[i] === "'" || h[i] === " ") continue;
    //                                                                         trimmedHash = trimmedHash + h[i];
    //                                                                     }
    //                                                                     return trimmedHash.toLowerCase();
    //                                                                 });
                                    
    //                                 return hashtags;
    //                             });
    // var allHashtags = [].concat.apply([], allHashtagsNotFlattened);
    // const numOfHashtagShowed = Math.min(allHashtags.length, 15);
    // // convert all same hashtags to count
    // var allHashtagsCount = d3.rollups(allHashtags, group => group.length, w => w)
    //                         .sort(([, a], [, b]) => d3.descending(a, b))
    //                         .slice(0, numOfHashtagShowed)
    //                         .map(([text, value]) => ({text, value}));
    
    // // Change title
    // updateWordCloudTitle(country, numOfHashtagShowed);

    // function draw(words) {
    //     const newVis = word_svg.selectAll("text").data(words);
    //     newVis.join("text")
    //     .attr("font-size", function(d) { return s(d.value); })
    //     .attr("transform", function(d) { return `translate(${d.x},${d.y}) rotate(${d.rotate})`; })
    //     .text(function(d) { return d.text; })
    //     .style('cursor', 'pointer')
    //     .on("click", (d, i) => {
    //         textInput.value = d.text;
    //         updateSearchWOListener(d.text);
    //     });
    // }
// }


// updateWordCloud(WORLDWIDE);