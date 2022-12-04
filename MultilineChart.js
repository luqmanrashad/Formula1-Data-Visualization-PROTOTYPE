//
//var margin = {top: 10, right: 40, bottom: 50, left: 50},
//    width = 760 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;
//    
//
//
//var svg = d3.select("body").append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//    .append("g")
//    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var margin = {top: 10, right: 90, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale)


function rowConverter(d) {
    var countryList = ["Brazil", "Russia", "China", "Brazil", "India", "South Africa", "United States"];
    if (
        countryList.includes(d["Country Name"])
    ) {
        return {
            "Country Name": d["Country Name"],
            years: [
                [2000, parseFloat(d["2000"])],
                [2001, parseFloat(d["2001"])],
                [2002, parseFloat(d["2002"])],
                [2003, parseFloat(d["2003"])],
                [2004, parseFloat(d["2004"])],
                [2005, parseFloat(d["2005"])],
                [2006, parseFloat(d["2006"])],
                [2007, parseFloat(d["2007"])],
                [2008, parseFloat(d["2008"])],
                [2009, parseFloat(d["2009"])],
                [2010, parseFloat(d["2010"])],
                [2011, parseFloat(d["2011"])],
                [2012, parseFloat(d["2012"])],
                [2013, parseFloat(d["2013"])],
                [2014, parseFloat(d["2014"])],
            ],
        }
    }
}

var startYear = 2000;
var endYear = 2014;

var countryList = ["Brazil", "Russia", "China", "Brazil", "India", "South Africa", "United States"];

// gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(xScale)
        .ticks(0)
        .tickSizeOuter(0)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(yScale)
        .ticks(0)
        .tickSizeOuter(0)
}


// This function parses the data using rowConverter and makes the bar chart based on that data
d3.csv("data/EPCSmallMillionBTU.csv", rowConverter).then(function(data){
    
    console.log(data);
//    var cities = data.columns.slice(1).map(function(id) {
//    return {
//      id: id,
//      values: data.map(function(d) {
//        return {date: d["Country Name"], EPC: d[id]};
//      })
//    };
//  });
         

    var idx = 0; 
    
    // Setting the ranges for the x domain, y domain, and color domain
    xScale.domain([2000, 2014]);
    yScale.domain([0, 320]);
    
    // Setting the color domain from 0 to 5 because there are 6 countries that need 6 different colors
    colorScale.domain([0, 5]);
    //    x.domain(data.map(function(d){ return d.years[idx++][0]; }));
    
    // add the X gridlines
    for (let x = 50; x < endYear; x+=50) {
        svg.append("g")			
          .attr("class", "grid")
          .attr("transform", "translate(0," + (yScale(x))  + ")")
          .call(make_x_gridlines()
              .tickSize(0)
              .tickFormat("")
          )
    }
  // add the Y gridlines
    for (let x = startYear; x < endYear; x+= 1) {
        svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(" + (xScale(x))  + ",0)")
        .call(make_y_gridlines()
            .tickSize(0)
            .tickFormat("")
        )
    }
    
    // the d3.line() function returns a line so we save it to lineGen
    var lineGen = d3.line()
        .x(function(d) {
            return xScale(d[0])
        })
        .y(function(d) {
            return yScale(d[1]);
        });
    
    // Uses the curve basis on the lines
    lineGen.curve(d3.curveBasis);
    
    var line;
    group = svg.append("g")
        .attr("class", "countryLines")
    
    // Goes through each individual line 
    for (let x = 0; x < data.length; x++) {
        // Creates the path with the country
        line = group.append("path")
            .attr("class", data[x]['Country Name'] + " line")
            .attr("d", lineGen(data[x]['years']))
            .attr("stroke", colorScale(x))
            .attr("stroke-width", "2")
            .attr("fill", "none");
        
        // Sets the state before animations
        line
            .attr("stroke-dashoffset", line.node().getTotalLength())
            .attr("stroke-dasharray", line.node().getTotalLength());
        
        // Animation
        line
            .transition()
            .delay(x+1000)
            .duration(1000)
            .attr("stroke-dashoffset", "0")
        
        
        // Adds the country labels to the side of the lines
        text = group.append("text")
            .attr("class", "countryLabel")
            .text(data[x]['Country Name'])
            .attr("y", yScale(data[x]['years'][endYear-startYear][1]))
            .attr("x", width+10)
            .attr("font-size", "14px");
           // .style("opacity")
    }

    // Draw xAxis and position the label
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        
    
    // Draw yAxis and position the label
    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + width + ",0")
        .call(yAxis);
    
    // This function creates the y-axis label, and positions it near the y-axis with respect to the margins,
    // and based on the pre-defined height
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.leftx)
        .attr("x", 0 - (height / 2))
        .attr("dy", "-2.8em")
        .style("text-anchor", "middle")
        .text("Millions of BTUs Per Person")
        .attr("font-size", "14px");
    
    // Adding the Year label on y axis
     svg.append("text")
        .attr("y", 0 - margin.leftx)
        .attr("x", width)
        .attr("dy", "-2.8em")
        .text("Year")
        .attr("font-size", "14px");

      
});
