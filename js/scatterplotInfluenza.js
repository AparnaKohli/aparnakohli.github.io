var margin = {top: 40, right: 90, bottom: 100, left: 100},
    width = 1600 - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg7 = d3.select("#scatterplotdiseases-area")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scaleOrdinal(d3.schemeCategory10);


//Tooltip


//Read the data
d3.csv("data/Influenza.csv").then(function(data){

    data.forEach(function(d){
        d.Influenza = +d.Influenza;
        d.logdeaths = + d.logdeaths;
        d.Influenzahat = +d.Influenzahat;
        d.deaths = +d.deaths;
    });
    console.log(data);

//Append new line
    var newline = d3.line()
        .x(function(d) {
            return x(d.Influenza);
        })
        .y(function(d) {
           return y(d.Influenzahat);
        });



  var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
        var text = "<strong>State:</strong> <span style='color:blue'>" + d.State + "</span><br>";
        text += "<strong>%mortality due to Influenza:</strong> <span style='color:blue;text-transform:capitalize'>" + d3.format(".2f")(d.Influenza) + "</span><br>";
        text += "<strong>Excess deaths:</strong> <span style='color:blue'>" + d.deaths + "</span><br>";
        
        return text;
    });
svg7.call(tip);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0,5])
        .range([0, width]);
  
  var xAxisGenerator = d3.axisBottom(x);
  xAxisGenerator.tickValues([0,1,2,3,4,5]);


  svg7.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisGenerator)
    .selectAll("text")
    .style("font-size", "20px");

 


    svg7.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("font-size", "24px")
    .attr("text-anchor", "middle")
    .text("% mortality in different states due to Influenza and pneumonia (2015-2019)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
            return d.logdeaths;
        })])
        .range([height, 0]);

  svg7.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "20px");

  svg7.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "24px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Log(excess deaths due to Covid 19)");

  // Add dots
  svg7.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Influenza); } )
      .attr("cy", function (d) { return y(d.logdeaths); } )
      .attr("r", 7)      
      .style("fill", function(d) { return color(d.State);}) 

      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)


     svg7.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", newline);

svg7.append("text")
    .attr("x", 0.5*width)
    .attr("y", height/2)
    .attr("font-size", "22px")
    .attr("fill", "blue")
    .text("1% increase in Influenza mortality --> 234 times increase in excess deaths");

svg7.append("text")
        .attr("x", 60)             
        .attr("y", 0)
        .attr("text-anchor", "beginning")  
        .style("font-size", "20px")   
        .style("fill", "orange")
        .style("font-weight","bold")
        .text("Hover on the dots!");


})
