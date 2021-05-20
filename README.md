# Bird's Eye View

Team member: Charvi Gopal (charvig), Eesam Hourani (ehourani), Stacia Johanna (staciaj)

![Preview image for Bird's Eye View](./preview.png)

## Abstract
How can we use a visualization to build empathy with people around the world? Our project, Bird’s Eye View, is in the form of a website with scrollytelling elements to convey the stories of the world’s development. Users are able to learn about each country's access to different resources through a guessing game. Finally, they are prompted to reflect on what they just learned from the game to build empathy with other users of the visualization.  Through our project, we leverage gamification and personalized reflection to help users learn about international development. 

## Project links
Link to data visualization: https://6859-sp21.github.io/final-project-birds-eye-view/

Link to paper: https://github.com/6859-sp21/final-project-birds-eye-view/blob/main/final/FinalPaper.pdf

Link to video trailer: https://www.youtube.com/watch?v=1fcNEe9il_s&feature=youtu.be&ab_channel=CharviG

## Running instructions
Go to https://6859-sp21.github.io/final-project-birds-eye-view/ and follow the instructions there. Laptop/PC recommended.

## Work breakdown
### Charvi Gopal
Map-specific logic for guessing game, point breakdown map, some manual data entry

### Eesam Hourani
Data selection/exploratory analysis, data cleaning, empathy-building stories/videos, instructions

### Stacia Johanna
Data cleaning, scrollytelling, all components of website story flow/logic and styling, category and decade form, styling and logic of points bar chart and region game keys.

## Project Process Commentary
Hour spent: 120 hours total

In developing the project, the most difficult part was managing the logic of the story flows between different categories and the gamification. Because we had several categories and decades for the readers to choose from, the scrollytelling and game needed to update according to that choice. Making sure that the story still flows well even if the readers change their options was necessary. Also, the main focus of our visualization was the guessing game, and because there were a lot of moving pieces within the game and the synchronization between the map and the bar chart, this was the complicated part of the project. 

We met several times over the past few weeks to brainstorm and downselect ideas, both our own and our peer reviewers'. We took notes in a Meeting Notes doc and divided work at these meetings. We also occasionally pair-programmed and helped each other debug. In a couple of the meetings, we decided the content of the presentations and even recorded them together for the MVP presentation.

## References
### Dataset
World Bank:
- Electricity: https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS
- Skilled birthcare staff: https://data.worldbank.org/indicator/SH.STA.BRTC.ZS
- Urban agglomerations: https://data.worldbank.org/indicator/EN.URB.MCTY.TL.ZS

Additional geographical information:
- Latitude and longitude: https://developers.google.com/public-data/docs/canonical/countries_csv
- Regional data: https://www.internetworldstats.com/list1.htm

### Stories
- Electricity: https://www.youtube.com/watch?v=xraThzKoXU8
- Skilled Birth Staff: 
  - https://www.youtube.com/watch?v=gIw2bJQ3_Sk
  - https://www.who.int/news-room/fact-sheets/detail/the-top-10-causes-of-death
  - https://www.who.int/news-room/fact-sheets/detail/maternal-mortality 
- Urban agglomeration: https://m.youtube.com/watch?v=fKnAJCSGSdk

### Code references
- Map:
  - http://bl.ocks.org/stevenae/8362841?fbclid=IwAR23VlKEqpkOzd-ZQ52qFUeppmNpuK9d3MxgLh6lYwLoJzds-magPiicM78
  - https://d3-geomap.github.io/map/choropleth/world/
  - https://bl.ocks.org/mbostock/2206590?fbclid=IwAR2kSSQF5ikNSoB7SinuiMgm271ahH1DsEAqog9TZvt9nJprf6yZovXuX6Q
- Scrollytelling: 
  - https://www.superhi.com/library/posts/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll
  - https://codepen.io/nxworld/pen/OyRrGy
- Bar chart: https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
