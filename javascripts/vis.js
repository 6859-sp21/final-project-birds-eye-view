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

var guessButton = document.getElementById('guess-button');
guessButton.style.visibility = "hidden";
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

// -------- bar chart adapted from : https://jsfiddle.net/2bs3ynpa/
// Map region -> [total point, number of country]
// value = totalPoint / cntOfCountry
var pointPerRegionMap = [
    {region: "Asia", totalPoint: 0, cntOfCountry: 0, value: 0 },
    {region: "Europe", totalPoint: 0, cntOfCountry: 0, value: 0 },
    {region: "Africa", totalPoint: 0, cntOfCountry: 0, value: 0 },
    {region: "Oceania", totalPoint: 0, cntOfCountry: 0, value: 0 },
    {region: "North America", totalPoint: 0, cntOfCountry: 0, value: 0 },
    {region: "South America", totalPoint: 0, cntOfCountry: 0, value: 0 }
];
const barchartMargin = 30;
const barchartWidth = 400 - 2 * barchartMargin;
const barchartHeight = 300 - 2 * barchartMargin;
let barSvg = d3.select("#barchart-placeholder").append('svg')
               .attr('id', 'barsvg');
let barchart = barSvg.append("g")
                 .attr('transform', `translate(${barchartMargin+15}, ${barchartMargin})`);
const barXScale = d3.scaleBand()
                    .range([0, barchartWidth])
                    .domain(pointPerRegionMap.map((data) => data.region))
                    .padding(0.4);
const barYScale = d3.scaleLinear()
                    .range([barchartHeight, 0])
                    .domain([0, 20]);
const makeYLines = () => d3.axisLeft().scale(barYScale);

barchart.append('g')
      .attr('transform', `translate(5, ${barchartHeight+10})`)
      .call(d3.axisBottom(barXScale))
      .selectAll("text")
      .attr("transform", "rotate(20)");
barchart.append('g')
      .call(d3.axisLeft(barYScale));
barchart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
            .tickSize(-barchartWidth, 0, 0)
            .tickFormat(''));
let barGroups = barchart.selectAll()
                    .data(pointPerRegionMap)
                    .enter()
                    .append('g');

barGroups.append('rect')
         .attr('class', 'bar')
         .attr('x', (g) => barXScale(g.region))
         .attr('y', (g) => barYScale(g.value))
         .attr('height', (g) => barchartHeight - barYScale(g.value))
         .attr('width', barXScale.bandwidth())
         .on('mouseenter', function(actual, i) {
            d3.selectAll('.value')
              .attr('opacity', 0)

            d3.select(this)
              .transition()
              .duration(100)
              .attr('opacity', 0.6)
              .attr('x', (a) => barXScale(a.region) - 5)
              .attr('width', barXScale.bandwidth() + 5)

            const y = barYScale(actual.value)

            line = barchart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', barchartWidth)
                .attr('y2', y)

            barGroups.append('text')
                .attr('class', 'divergence')
                .attr('x', (a) => barXScale(a.region) + barXScale.bandwidth() / 2)
                .attr('y', (a) => barYScale(a.value) + 20)
                .attr('fill', 'white')
                .attr('text-anchor', 'middle')
                .text((a, idx) => {
                    const divergence = (a.value - actual.value).toFixed(1)

                    let text = ''
                    if (divergence > 0) text += '+'
                    text += `${divergence}`

                    return idx !== i ? text : '';
                })
         })
        .on('mouseleave', function() {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(100)
                .attr('opacity', 1)
                .attr('x', (a) => barXScale(a.region))
                .attr('width', barXScale.bandwidth())

            barchart.selectAll('#limit').remove()
            barchart.selectAll('.divergence').remove()
        });

barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => barXScale(a.region) + barXScale.bandwidth() / 2)
    .attr('y', (a) => barYScale(a.value) + 20)
    .attr('text-anchor', 'middle')
    .text((a) => a.value > 0 ? `${a.value}` : "");
// Add labels
barSvg.append('text')
    .attr('class', 'label')
    .attr('x', -(barchartHeight / 2) - barchartMargin)
    .attr('y', barchartMargin / 3)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Average points gained');
barSvg.append('text')
    .attr('class', 'label')
    .attr('x', barchartWidth / 2 + barchartMargin)
    .attr('y', barchartHeight + barchartMargin * 3)
    .attr('text-anchor', 'middle')
    .text('Regions');

function updateBarChart(countryName, newPoints) {
    console.log(countryName + " " + countryToRegionMap.get(countryName));
}

// ----------------------- End of bar-chart related stuff -----------------------

var guessedValueToRangeStringMap = new Map([
    ["0", "[0, 10)"],
    ["1", "[10, 20)"],
    ["2", "[20, 30)"],
    ["3", "[30, 40)"],
    ["4", "[40, 50)"],
    ["5", "[50, 60)"],
    ["6", "[60, 70)"],
    ["7", "[70, 80)"],
    ["8", "[80, 90)"],
    ["9", "[90, 100]"],
]);

var guessedValueToRangeMap = new Map([
    [0, [0, 10]],
    [1, [10, 20]],
    [2, [20, 30]],
    [3, [30, 40]],
    [4, [40, 50]],
    [5, [50, 60]],
    [6, [60, 70]],
    [7, [70, 80]],
    [8, [80, 90]],
    [9, [90, 100]],
]);

$('#guess-button').on('click', function () {
    var guessButton = document.getElementById('guess-button');
    guessButton.style.visibility = "hidden";
    var guessedValue = document.getElementById("inputGroupSelect").value;
    var sidebarStats = document.getElementById('sidebar-stats');
    var expectedAnswer = tweetsByCountry.get(currentCountry).toFixed(1);
    var pointsGained = getPointOfAnswer(guessedValue, expectedAnswer);
    var updatedInnerHTML = "<br> <b> For " + currentCountry + 
                            "</b> <br> You guessed: " + guessedValueToRangeStringMap.get(guessedValue) + 
                            " <br> Correct answer: " + expectedAnswer  + 
                            "<br> Points gained: " +  pointsGained +
                            "<br>"; 
    sidebarStats.innerHTML = updatedInnerHTML;
    sidebarStats.style.color = "#ffffff";
    guessedCountries.add(currentCountry);
    updateBarChart(currentCountry, pointsGained);
    updateMap();
});

/**
 * same range = 20 points
 * within 10 (1 category off) = 10 point
 * within 20 (2 categories off) = 5 point
 * others = 0 point
 */
function getPointOfAnswer(userAnswer, expectedAnswer) {
    let userAnswerInNumber = parseInt(userAnswer);
    let expectedAnswerInNumber = parseFloat(expectedAnswer);
    let expectedCategory = Math.floor(expectedAnswerInNumber / 10.0);
    let rangeDifference = Math.abs(userAnswerInNumber - expectedCategory);
    if (rangeDifference === 0) return 20;
    else if (rangeDifference === 1) return 10;
    else if (rangeDifference === 2) return 5;
    else return 0;
}

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
            var guessButton = document.getElementById('guess-button');
            guessButton.style.visibility = "visible";
            var guessAnswerGroups = document.getElementById('guess-answer-groups');
            guessAnswerGroups.style.visibility = "visible";
        }
    } else {
        var GuessTitle = document.getElementById('wordcloud-title');
        GuessTitle.style.visibility = 'hidden';
        var guessButton = document.getElementById('guess-button');
        guessButton.style.visibility = "hidden";
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