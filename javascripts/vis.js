// 'chosenCategory' and 'chosenDecade' variables can be used here directly to get the user-chosen category and decade

function changedDecadeValue() {
    console.log("chosen decade: " + chosenDecade);
    updateMap();
}

let width = 800, height = 400, centered; // TODO: change these to fit the screen
let projection = d3.geoEquirectangular();
projection.fitSize([width, height], electricity_decade_fin);
let geoGenerator = d3.geoPath().projection(projection);

const guessedCountries = new Set()

var colorScale = d3.scaleLog()
// linear scale
.domain([1, 20, 40, 60, 80, 100])
.range(d3.schemeBlues[6]);

// var guessEntryBox = document.getElementById('hashtag-search-box');
// guessEntryBox.style.visibility = "hidden";
// var percentAddOn = document.getElementById('basic-addon1');
// percentAddOn.style.visibility = "hidden";
// var guessButton = document.getElementById('guess-button');
// guessButton.style.visibility = "hidden";
var guessAnswerGroups = document.getElementById('guess-answer-groups');
guessAnswerGroups.style.visibility = "hidden";

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
    .title("% of People with Electricity")
    
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
    if (!chosenDecade) {
        return data.properties.year == 2010
    }
    return data.properties.year == chosenDecade;
})
var tweetsByCountry = d3.rollup(newData, v => d3.sum(v, d => d.properties.value), d => d.properties.country);

map_svg.selectAll("path")
        .data(world_map_json.features)
        .enter()
        .append("path")
        .attr( "fill", function (d) {
            //console.log(tweetsByCountry.get(d.properties.name));
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

$('#guess-button').on('click', function () {
    var guessButton = document.getElementById('guess-button');
    guessButton.style.visibility = "hidden";
    var sidebarStats = document.getElementById('sidebar-stats');
    var guessedValue = document.getElementById('hashtag-search-box').value;
    var updatedInnerHTML = "<br> <b> For " + currentCountry + "</b> <br> You guessed: " + guessedValue + " <br> Correct answer: " +  tweetsByCountry.get(currentCountry).toFixed(1) +  "<br>" + sidebarStats.innerHTML; 
    sidebarStats.innerHTML = updatedInnerHTML;
    sidebarStats.style.color = "#ffffff";
    guessedCountries.add(currentCountry);
    //console.log(guessedCountries);
    updateMap();
})

function updateMap() {
    console.log(chosenCategory, " chosenCategory")
    console.log(chosenDecade, " chosenDecade")
    var mapTitle = document.getElementById('map-title');
    var decadeToDisplay;
    if (chosenDecade == undefined) {
        decadeToDisplay = "2010"
    } else {
        decadeToDisplay = chosenDecade
    }
    mapTitle.innerHTML = "<h4> Percentage of people with access to electricity in the "+ decadeToDisplay + "s </h4>";
    mapTitle.style.color = "#ffffff";
    // Filter and get new data
    const newData = electricity_decade_fin.features
        .filter(function(data) {
            if (!chosenDecade) {
                return data.properties.year == 2010
            }
            return data.properties.year == chosenDecade;
        })
                        //  .filter(function(data) {
                        //     var dataHashtags = data.properties.hashtags.toLowerCase();
                        //     var isDataHasHashtag = dataHashtags.includes(currentHashtag);
                        //     var isDataCreatedAt = data.properties.created_at.includes(currentDate);
                        //     return isDataCreatedAt && isDataHasHashtag; 
                        //  });

    tweetsByCountry = d3.rollup(newData, v => d3.sum(v, d => d.properties.value), d => d.properties.country);

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
        //console.log(d.properties)
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
        if (!guessedCountries.has(currentCountry)) {
            var GuessTitle = document.getElementById('wordcloud-title');
            GuessTitle.style.visibility = 'visible';
            var decadeToDisplay;
            if (! chosenDecade) {
                decadeToDisplay = "2010";
            }
            else decadeToDisplay = chosenDecade;
            GuessTitle.innerText = "What % of people in " + currentCountry + " do you think had access to electricity?";
            // var guessEntryBox = document.getElementById('hashtag-search-box');
            // guessEntryBox.style.visibility = 'visible';
            // var percentAddOn = document.getElementById('basic-addon1');
            // percentAddOn.style.visibility = "visible";
            // var guessButton = document.getElementById('guess-button');
            // guessButton.style.visibility = "visible";
            var guessAnswerGroups = document.getElementById('guess-answer-groups');
            guessAnswerGroups.style.visibility = "visible";
        }
    } else {
        var GuessTitle = document.getElementById('wordcloud-title');
        GuessTitle.style.visibility = 'hidden';
        // var guessEntryBox = document.getElementById('hashtag-search-box');
        // guessEntryBox.style.visibility = 'hidden';
        // var percentAddOn = document.getElementById('basic-addon1');
        // percentAddOn.style.visibility = "hidden";
        // var guessButton = document.getElementById('guess-button');
        // guessButton.style.visibility = "hidden";
        var guessAnswerGroups = document.getElementById('guess-answer-groups');
        guessAnswerGroups.style.visibility = "hidden";
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