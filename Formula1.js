
    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    // Schemecategory20 got removed in v4
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    //Define SVG
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define Scales   
    var xScale = d3.scaleLinear()
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .range([height, 0]);
    
    //Define Tooltip here
    var tooltip = d3.select("body")
        .append("div")	
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);
      
       //Define Axis
    var xAxis = d3.axisBottom(xScale).tickPadding(2);
    var yAxis = d3.axisLeft(yScale).tickPadding(2);
// driverid,drivername,bestlaptime,yearbestlaptime,driverstanding,laptime2022,laptime2021,laptime2020,laptime2019
    //Get Data
    function rowConverter(data) {
        return {
            driverid : data.driverid,
            drivername : +data.drivername,
            bestlaptime: +data.bestlaptime,
            yearbestlaptime: +data.yearbestlaptime,
            driverstanding: +data.driverstanding,
            laptime2022: +data.laptime2022,
            laptime2021: +data.laptime2021,
            laptime2020: +data.laptime2020,
            laptime2019: +data.laptime2019          
        }
    }

d3.csv("sampleData.csv", rowConverter).then(function (data) {
    // 0 to max gdp of data
    xScale.domain([0, d3.max(data, function (d) { return d.bestlaptime})]);
    // 0 to max ecc of data
    yScale.domain([0, d3.max(data, function (d) { return d.driverid})]);
    
    //x axis
    var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    //y axis
    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    //Draw Scatterplot
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomFunction);
    
    // view rectangle
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
    
    // Var to select shifting cirles on the scatterplot
    var shifting = svg.append("g")
        .classed("circles", true);
    
    function zoomFunction() {
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
        shifting.selectAll("circle")
            .attr('cx', function(d) {return d3.event.transform.rescaleX(xScale)(d.bestlaptime)})
            .attr('cy', function(d) {return d3.event.transform.rescaleY(yScale)(d.driverid)})
    }
    
    // edited version of the js file given to us
    var newShift = shifting.selectAll("circle")
        .data(data);
    
    // Adds all data to scatterplot, along with tooltip mouseover, mousemove and mouseout
    // Also added in the html and css portions to make the table on mouseover
    // Works with double click or ctrl click for zoom in or out
    // Sliding orks with mouse click and drag
    // Zoom also works with trackpad/mouse scroller
    newShift = newShift.enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return 10*Math.sqrt((10-d.driverstanding)/Math.PI);})
        .attr("cx", function(d) {return xScale(d.bestlaptime);})
        .attr("cy", function(d) {return yScale(d.driverid);})
        .style("fill", function (d) { return colors(d.driverid); })
    
    
    // Adds legend as seperate shapes with respective sized cirles and different text
    svg.append("rect")
        .attr("x", width-220)
        .attr("y", height-260)
        .attr("width", 260)
        .attr("height", 255)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width-205)
        .attr("y", height-15)
        .style("fill", "green") 
        .attr("font-size", "16px")
        .text("Driver Standing"); 

    svg.append("circle")
        .attr("cx", width-40)
        .attr("cy", height-230)
        .attr("r", 10*Math.sqrt((10-9)/Math.PI))
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width-205)
        .attr("y", height-230)
        .text(" Driver Standing 9");

    svg.append("circle")
        .attr("cx", width-40)
        .attr("cy", height-190)
        .attr("r", 10*Math.sqrt((10-5)/Math.PI))
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width-205)
        .attr("y", height-190)
        .text(" Driver Standing 5");

    svg.append("circle")
        .attr("cx", width-40)
        .attr("cy", height-90)
        .attr("r", 10*Math.sqrt((10-1)/Math.PI))
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width-205)
        .attr("y", height-90)
        .text(" Driver Standing 1");
    
    // call zoom on svg members of shifting
    shifting.call(zoom);

    // Add labels on both x and y axis
    svg.append("g")
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(0," + height + ")")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Lap Time");

    svg.append("g")
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Driver ID?");   
})