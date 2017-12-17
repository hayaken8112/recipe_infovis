function drawSelectedList() {
    d3.select("#selected").select("svg").remove();
    var width = window.innerWidth / 2;
    var height = window.innerHeight * 0.4;
    var offset = 20;
    var svg = d3.select("#selected").append("svg")
                .attr("width", width + 2*offset)
                .attr("height", height + 2*offset)
                .attr("transform", "translate(" + offset + "," + offset + ")");
    
    var g = svg.selectAll("g").data(selected_data).enter().append("g");

    var boxes = g.append("rect")
        .attr("x", function(d,i) { return i * 160; })
        .attr("y", offset)
        .attr("height", 150)
        .attr("width", 150)
        .attr("fill", function(d,i){
            if (d.category == 'staple-food') {
                return "red";
            } else if(d.category == 'main'){
                return "blue"
            } else if (d.category == 'side') {
                return "green"
            }
        })

    var remove_button = g.append("circle")
        .attr("fill", "lightgray")
        .attr("cx", function(d,i){ return i*160 + 150})
        .attr("cy", offset)
        .attr("r", 10)
    var remove_text = g.append("text")
        .attr("font-size", 15)
        .attr("x", function(d,i){ return i*160 + 142})
        .attr("y", offset+5)
        .attr("fill", "black")
        .attr("stroke-width", 0)
        .text("ー")
        .on("click", function(d,i){
            updateRadarChartData(d,0);
            recalcurateData();
            removeEstimatedData();
            radarChartOptions.startOver = false;
            RadarChart(".radarChart", formatted_chart_data, radarChartOptions);
            barChart();
            drawSelectedList();
        })

    var image = g.append("image")
        .attr("x", function(d,i) {return i*160})
        .attr("y", offset)
        .attr("width","150")
        .attr("height","150")
        .attr("xlink:href", function(d,i){return d.img})
        .attr("class", function(d,i){return "image_" + d.name})

    var detail_panel = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("width","150")
        .style("height","150")
        .style("background-color", "yellow")
        .style("visibility", "hidden")

    image.on("mouseover", function(d,i){
            //detail_panel.style("visibility", "visible")
        })
        .on("mousemove", function(d,i){
            detail_panel
                        .style("top", (d3.event.pageY-50)+"px")
                        .style("left",(d3.event.pageX-50)+"px")
                        .html('<p>'+'aaa'+'</p>');
        })
        .on("mouseout", function(d,i){
            detail_panel.style("visibility", "hidden")
        })
        .on("click", function(d,i){
            window.open(d.url)
        })
    
}