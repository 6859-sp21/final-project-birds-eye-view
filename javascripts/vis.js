// 'chosenCategory' and 'chosenDecade' variables can be used here directly to get the user-chosen category and decade
var chosen_geojson = electricity_decade_fin;
var pointsByCountry = {};
const guessedCountries = new Set()
var solutionMapVisible = false;

function changedCategoryValue() {

    console.log("chosen category: " + chosenCategory);
    if (chosenCategory === "electricity") {
        chosen_geojson = electricity_decade_fin;
    }
    else if (chosenCategory === "skilled-birth") {
        chosen_geojson = birth_fin;
    }
    else if (chosenCategory === "urban-agglomerate") {
        chosen_geojson = urban_fin;
    }
    pointsByCountry = {};
    guessedCountries.clear();
    currentCountry == WORLDWIDE;
    solutionMapVisible = false;
    clicked(null);
    resetBarChart();
    resetKey();
    updateMap();
    updatePointMap();
    let RevealButton = document.getElementById('reveal-button');
    RevealButton.style.visibility = "hidden";
    var pointMap = document.getElementById("point-map-placeholder");
    pointMap.style.visibility = "hidden";
}

function changedDecadeValue() {
    console.log("chosen decade: " + chosenDecade);
    pointsByCountry = {};
    guessedCountries.clear();
    currentCountry == WORLDWIDE;
    solutionMapVisible = false;
    clicked(null);
    resetBarChart();
    resetKey();
    updateMap();
    updatePointMap();
    var RevealButton = document.getElementById('reveal-button');
    RevealButton.style.visibility = "hidden";
    var pointMap = document.getElementById("point-map-placeholder");
    pointMap.style.visibility = "hidden";
}

let width = 800, height = 400, centered; // TODO: change these to fit the screen
let projection = d3.geoEquirectangular();
projection.fitSize([width, height], chosen_geojson);
let geoGenerator = d3.geoPath().projection(projection);

var colorScale = d3.scaleLinear()
// linear scale
.domain([1, 20, 40, 60, 80, 100])
.range(d3.schemeBlues[6]);

var pointMapColorScale = d3.scaleLinear()
// linear scale
.domain([0, 5, 10, 15, 20])
.range(d3.schemeGreens[5]);

var guessButton = document.getElementById('guess-button');
guessButton.style.visibility = "hidden";
var guessAnswerGroups = document.getElementById('guess-answer-groups');
guessAnswerGroups.style.visibility = "hidden";
var RevealButton = document.getElementById('reveal-button');
RevealButton.style.visibility = "hidden";
var pointMap = document.getElementById("point-map-placeholder");
pointMap.style.visibility = "hidden";

let svg = d3.select("#map-placeholder").append('svg')
            .style("width", width).style("height", height);

let point_svg = d3.select("#point-map-placeholder").append('svg')
            .style("width", width).style("height", height);

let point_rect_svg = point_svg.append("rect")
.attr("width", "100%")
.attr("height", "100%")
.attr("fill", "black");

let point_legend_svg = point_svg.append("g")
.attr("class", "legendQuant")
.attr("transform", "translate(0,200)")
.attr("fill", "white");

var point_legendLinear = d3.legendColor()
.shapeWidth(30)
.cells([0, 5, 10, 15, 20])
.orient('vertical')
.scale(pointMapColorScale)
.title("Points Earned")

point_svg.select(".legendQuant")
.call(point_legendLinear);

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
    .title("% of Population")
    
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
const newData = chosen_geojson.features
.filter(function(data) {
    if (!chosenDecade) {
        return data.properties.year == 2010
    }
    return data.properties.year == chosenDecade;
})
var tweetsByCountry = d3.rollup(newData, v => d3.sum(v, d => d.properties.value), d => d.properties.country);

let point_map_svg = point_svg.append("g");

point_map_svg.selectAll("path")
        .data(world_map_json.features)
        .enter()
        .append("path")
        .attr( "fill", function (d) {
            //console.log(tweetsByCountry.get(d.properties.name));
            d.total = pointsByCountry[d.properties.name] || -1;
            if (! (d.properties.name in pointsByCountry)) {
                return "#808080";
            } else {
                return pointMapColorScale(d.total);
            }
        })
        .style('cursor', 'pointer')
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide)
        .attr("fill", "white")
        .attr("d", geoGenerator )
        .on("click", clickedPointMap);
updatePointMap();

map_svg.selectAll("path")
        .data(world_map_json.features)
        .enter()
        .append("path")
        .attr( "fill", function (d) {
            //console.log(tweetsByCountry.get(d.properties.name));
            d.total = tweetsByCountry.get(d.properties.name) || -1;
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
    .attr("transform", "rotate(20)")
    .attr('class', function (d) {
        if (d === "Asia") return "key-asia";
        else if (d === "Europe") return "key-europe";
        else if (d === "Africa") return "key-africa";
        else if (d === "Oceania") return "key-oceania";
        else if (d === "North America") return "key-na";
        else if (d === "South America") return "key-sa";
    });
barchart.append('g')
    .call(d3.axisLeft(barYScale));
barchart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
            .tickSize(-barchartWidth, 0, 0)
            .tickFormat(''));

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

let barGroups = barchart
    .selectAll()
    .data(pointPerRegionMap)
    .enter();

function updateBarChart(countryName, newPoints) {
    // Update the mapping from region to average points
    if (newPoints >= 0) {
        let currentRegion = countryToRegionMap.get(countryName);
        for (const regionData of pointPerRegionMap) {
            if (regionData.region === currentRegion) {
                regionData.cntOfCountry += 1;
                regionData.totalPoint += newPoints;
                regionData.value = regionData.totalPoint / regionData.cntOfCountry;
                if (regionData.cntOfCountry === 1) colorKey(currentRegion);
                break;
            }
        }
    }

    // Updating the visualization
    barGroups = barchart
                    .selectAll("rect")
                    .data(pointPerRegionMap)
                    .join("rect")
                    .transition()
                    .duration(800)
                    .attr('class', 'bar')
                    .attr('x', (g) => barXScale(g.region))
                    .attr('y', (g) => barYScale(g.value))
                    .attr('height', (g) => barchartHeight - barYScale(g.value))
                    .attr('width', barXScale.bandwidth());

    barchart
        .selectAll("text.value")
        .data(pointPerRegionMap)
        .join("text")
        .transition()
        .duration(800)
        .attr('class', 'value')
        .attr('x', (a) => barXScale(a.region) + barXScale.bandwidth() / 2)
        .attr('y', (a) => barYScale(a.value) + 20)
        .attr('text-anchor', 'middle')
        .text((a) => { 
            let temp = a.value > 0 ? `${a.value.toFixed(1)}` : ""; 
            return temp;});
}
// Initialize all region to 0 so bar chart transition is not weird
updateBarChart("Rusia", -1);
updateBarChart("Japan", -1);
updateBarChart("United States", -1);
updateBarChart("Argentina", -1);
updateBarChart("Australia", -1);
updateBarChart("Algeria", -1);

// Fill key color
function colorKey(regionName) {
    if (regionName === "Asia") {
        let curKey = document.getElementById("key-asia");
        curKey.innerHTML = `<img src="./images/key-asia.png" class="key" width="20px" height="20px">`;
    }
    else if (regionName === "Europe") {
        let curKey = document.getElementById("key-europe");
        curKey.innerHTML = `<img src="./images/key-europe.png" class="key" width="20px" height="20px">`;
    }
    else if (regionName === "Africa") {
        let curKey = document.getElementById("key-africa");
        curKey.innerHTML = `<img src="./images/key-africa.png" class="key" width="20px" height="20px">`;
    }
    else if (regionName === "Oceania") {
        let curKey = document.getElementById("key-oceania");
        curKey.innerHTML = `<img src="./images/key-oceania.png" class="key" width="20px" height="20px">`;
    }
    else if (regionName === "North America") {
        let curKey = document.getElementById("key-na");
        curKey.innerHTML = `<img src="./images/key-NA.png" class="key" width="20px" height="20px">`;
    }
    else if (regionName === "South America") {
        let curKey = document.getElementById("key-sa");
        curKey.innerHTML = `<img src="./images/key-SA.png" class="key" width="20px" height="20px">`;
    }
}

function resetKey() {
    document.getElementById("key-asia").innerHTML = `<img src="./images/key-grey.png" class="key" width="20px" height="20px">`;
    document.getElementById("key-europe").innerHTML = `<img src="./images/key-grey.png" class="key" width="20px" height="20px">`;
    document.getElementById("key-africa").innerHTML = `<img src="./images/key-grey.png" class="key" width="20px" height="20px">`;
    document.getElementById("key-oceania").innerHTML = `<img src="./images/key-grey.png" class="key" width="20px" height="20px">`;
    document.getElementById("key-na").innerHTML = `<img src="./images/key-grey.png" class="key" width="20px" height="20px">`;
    document.getElementById("key-sa").innerHTML = `<img src="./images/key-grey.png" class="key" width="20px" height="20px">`;
}

function resetBarChart() {
    pointPerRegionMap = [
        {region: "Asia", totalPoint: 0, cntOfCountry: 0, value: 0 },
        {region: "Europe", totalPoint: 0, cntOfCountry: 0, value: 0 },
        {region: "Africa", totalPoint: 0, cntOfCountry: 0, value: 0 },
        {region: "Oceania", totalPoint: 0, cntOfCountry: 0, value: 0 },
        {region: "North America", totalPoint: 0, cntOfCountry: 0, value: 0 },
        {region: "South America", totalPoint: 0, cntOfCountry: 0, value: 0 }
    ];
    updateBarChart("Rusia", -1);
    updateBarChart("Japan", -1);
    updateBarChart("United States", -1);
    updateBarChart("Argentina", -1);
    updateBarChart("Australia", -1);
    updateBarChart("Algeria", -1);
}

// ----------------------- End of bar-chart related stuff -----------------------

function checkAllKeysColored() {
    for (const regionData of pointPerRegionMap) {
        if (regionData.cntOfCountry < 1) return false;
    } return true;
}

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

$('#reveal-button').on('click', function () {
    let RevealButton = document.getElementById('reveal-button');
    RevealButton.style.visibility = "hidden";
    currentCountry == WORLDWIDE;
    clicked(null);
    showSolutionMap();
});

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
    pointsByCountry[currentCountry] = pointsGained;
    updateBarChart(currentCountry, pointsGained);
    updateMap();
    if (checkAllKeysColored() && !solutionMapVisible) {
        var RevealButton = document.getElementById('reveal-button');
        RevealButton.style.visibility = "visible";
        var pointMap = document.getElementById("point-map-placeholder");
        pointMap.style.visibility = "visible";
    }
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
    if (expectedCategory === 10) expectedCategory -= 1;
    let rangeDifference = Math.abs(userAnswerInNumber - expectedCategory);
    if (rangeDifference === 0) return 20;
    else if (rangeDifference === 1) return 10;
    else if (rangeDifference === 2) return 5;
    else return 0;
}

function updatePointMap() {

    // tip = d3.tip()
    //         .attr('class', 'd3-tip')
    //         .direction('n').offset(function() {
    //             if (currentCountry == WORLDWIDE) {
    //                 return [this.getBBox().height/4, this.getBBox().width/4]
    //             } else {
    //                 return [this.getBBox().height, this.getBBox().width]
    //             }
    //           })
    //         .html(function(d) {
    //             if (guessedCountries.has(d.properties.name)) {
    //                 var totalTweet = tweetsByCountry.get(d.properties.name) || 0;
    //                 if (totalTweet === 0) return d.properties.name + ": " + "0%"
    //                 else return d.properties.name + ": " + totalTweet.toFixed(1) + " %";
    //             } else {
    //                 return d.properties.name;
    //             }
    //         });
    // svg.call(tip);

    point_map_svg.selectAll("path")
    .data(world_map_json.features)
    .join("path")
    .attr( "fill", function (d) {
        //console.log(d.properties)
        d.total = pointsByCountry[d.properties.name] || -1;
        if (! (d.properties.name in pointsByCountry)) {
            return "#808080";
        } else {
            return pointMapColorScale(d.total);
        }
      })
    // .on('mouseover', tip.show)
    // .on('mouseout', tip.hide)
    .attr("stroke", "black")
    .attr("border-color", "black")
    .attr("d", geoGenerator )
    .on("click", clickedPointMap);
}

function showSolutionMap() {
    solutionMapVisible = true;
    var mapTitle = document.getElementById('map-title');
    var decadeToDisplay;
    if (chosenDecade == undefined) {
        decadeToDisplay = "2010"
    } else {
        decadeToDisplay = chosenDecade
    }
    let categoryString = "with access to electricity";
    if (chosenCategory === "skilled-birth") categoryString = "with access to skilled birth staff";
    else if (chosenCategory === "urban-agglomerate") categoryString = "living in urban agglomerations";
    mapTitle.innerHTML = "<h4> Percentage of people " + categoryString + " in the "+ decadeToDisplay + "s </h4>";
    mapTitle.style.color = "#ffffff";
    // Filter and get new data
    const newData = chosen_geojson.features
        .filter(function(data) {
            if (!chosenDecade) {
                return data.properties.year == 2010
            }
            return data.properties.year == chosenDecade;
        })

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
        return colorScale(d.total);
      })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .attr("stroke", "black")
    .attr("border-color", "black")
    .attr("d", geoGenerator )
    .on("click", clicked);

    updatePointMap();
}

function updateMap() {
    var mapTitle = document.getElementById('map-title');
    var decadeToDisplay;
    if (chosenDecade == undefined) {
        decadeToDisplay = "2010"
    } else {
        decadeToDisplay = chosenDecade
    }
    let categoryString = "with access to electricity";
    if (chosenCategory === "skilled-birth") categoryString = "with access to skilled birth staff";
    else if (chosenCategory === "urban-agglomerate") categoryString = "living in urban agglomerations";
    mapTitle.innerHTML = "<h4> Percentage of people " + categoryString + " in the "+ decadeToDisplay + "s </h4>";
    mapTitle.style.color = "#ffffff";
    // Filter and get new data
    const newData = chosen_geojson.features
        .filter(function(data) {
            if (!chosenDecade) {
                return data.properties.year == 2010
            }
            return data.properties.year == chosenDecade;
        })

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

    updatePointMap();
}

function showGuessingTools(currentCountry, show) {
    if (show) {
        if (!guessedCountries.has(currentCountry) && !solutionMapVisible) {
            var GuessTitle = document.getElementById('wordcloud-title');
            GuessTitle.style.visibility = 'visible';
            var decadeToDisplay;
            if (! chosenDecade) {
                decadeToDisplay = "2010";
            }
            else decadeToDisplay = chosenDecade;
            let categoryString = "had access to electricity?";
            if (chosenCategory === "skilled-birth") categoryString = "had access to skilled birth staff?";
             else if (chosenCategory === "urban-agglomerate") categoryString = "is living in urban agglomerations?";
            GuessTitle.innerText = "What % of people in " + currentCountry + " do you think " + categoryString;
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

function clickedPointMap(d) {
    var x, y, k;
  
    if (d && centered !== d) {
        currentCountry = d.properties.name;
        var centroid = geoGenerator.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        currentCountry = WORLDWIDE;
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }
  
    point_map_svg.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });
  
    point_map_svg.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");

    point_legend_svg.selectAll('*').remove();

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
        .title("% of Population");
        
        svg.select(".legendQuant")
        .call(legendLinear);
    } 
    
    // updateWordCloud(currentCountry);
}

function clicked(d) {
    var x, y, k;
    console.log(d);
    if (d === null) {
        console.log("in first case!!")
        currentCountry = WORLDWIDE;
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
        // hide % selector and guesser
        showGuessingTools(currentCountry, false)
    }
    else if (d && centered !== d) {
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
        .title("% of Population");
        
        svg.select(".legendQuant")
        .call(legendLinear);
    } 
    
    // updateWordCloud(currentCountry);
}