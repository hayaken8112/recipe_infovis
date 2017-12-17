var sample_data = [];

var chartIsDrawn = [];
/*
d3.json("./sample_data.json", function(error, data) {
    if (error) { alert(error); }
    else {
        sample_data = data;
        var menu = d3.select("#menu").append("svg")
            .attr("width",100)
            .attr("height", 500)
            .attr("x", 0)
            .attr("y",500);

        var text = menu.selectAll("text").data(sample_data)
            .enter()
            .append("text");

        var menu_text = text.text(function(d,i) { return d.recipe; })
            .attr("y", function(d,i) { return (i * 20) + 20;})
            .attr("x", 0)
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("class", function(d) {return "text_" + d.recipe})
            .on("mouseover", mouseoverMenuText)
            .on("mouseout" , mouseoutMenuText)
            .on("click", drawChart);
    }
});
*/

function mouseoverMenuText(d){
    d3.select(".text_" + d.recipe).attr("fill", "red")
}
function mouseoutMenuText(d){
    d3.select(".text_" + d.recipe).attr("fill", "black")
}

/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var content_width = Number(document.getElementsByClassName('radarChart')[0].clientWidth);

var margin = {top: 100, right: 100, bottom: 100, left: 100},
width = Math.min(1000, content_width - 10) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

////////////////////////////////////////////////////////////// 
////////////////////////// Data ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var taggedData = [
    //iPhone
    {"recipe": "iPhone", "ingredient": [
           { axis: "red",    value: 0.22 },
           { axis: "yellow", value: 0.28 },
           { axis: "blue",   value: 0.29 },
           { axis: "green",  value: 0.17 },
           { axis: "white",  value: 0.22 },
           { axis: "black",  value: 0.02 },
    ]
    }
    ,
    //Samsung
    {"recipe": "Samsung", "ingredient": [
            { axis: "red",    value: 0.27 },
            { axis: "yellow", value: 0.16 },
            { axis: "blue",   value: 0.35 },
            { axis: "green",  value: 0.13 },
            { axis: "white",  value: 0.20 },
            { axis: "black",  value: 0.13 },
    ]
    }
    ,
    // {{{
    //[//Nokia Smartphone
    //    {axis:"red",value:0.26},
    //    {axis:"yellow",value:0.10},
    //    {axis:"blue",value:0.30},
    //    {axis:"green",value:0.14},
    //    {axis:"white",value:0.22},
    //    {axis:"black",value:0.04},
    //],
    //[//Nokia Smartphone
    //    {axis:"red",value:0.66},
    //    {axis:"yellow",value:0.30},
    //    {axis:"blue",value:0.20},
    //    {axis:"green",value:0.04},
    //    {axis:"white",value:0.52},
    //    {axis:"black",value:0.04},
    //]
    // }}}
];
////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scaleOrdinal()
    //.range(["#EDC951","#CC333F","#00A0B0"]);
    .range(["#EDC951","#EDC951","#00A0B0"]);

var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1.0,
    levels: 5,
    roundStrokes: true,
    color: color,
    startOver: true,
    updateOnlyStroke: false,
    dynamicGrid: true,
    referenceCircleRadius: 1.0,
    areaTransitionDuration: 700,
};
var data = [ // old format
     // {{{
        [//Nokia Smartphone
            {axis:"red",value:0.26},
            {axis:"yellow",value:0.10},
            {axis:"blue",value:0.30},
            {axis:"green",value:0.14},
            {axis:"white",value:0.22},
            {axis:"black",value:0.04},
        ],
        [//Nokia Smartphone
            {axis:"red",value:0.66},
            {axis:"yellow",value:0.30},
            {axis:"blue",value:0.20},
            {axis:"green",value:0.04},
            {axis:"white",value:0.52},
            {axis:"black",value:0.04},
        ]
    // }}}
];
var data2 = [ // old format
     // {{{
        [//Nokia Smartphone
            {axis:"red",value:0.36},
            {axis:"yellow",value:0.30},
            {axis:"blue",value:0.22},
            {axis:"green",value:0.54},
            {axis:"white",value:0.12},
            {axis:"black",value:0.84},
        ],
        [//Nokia Smartphone
            {axis:"red",value:0.16},
            {axis:"yellow",value:0.20},
            {axis:"blue",value:0.40},
            {axis:"green",value:0.24},
            {axis:"white",value:0.12},
            {axis:"black",value:0.84},
        ]
    // }}}
];
//Call function to draw the Radar chart
RadarChart(".radarChart", formatted_chart_data, radarChartOptions);
drawScatterPlot();
barChart();
//draw_sum_data(data);
function clickaction() {
    radarChartOptions.startOver = false;
    radarChartOptions.updateOnlyStroke = true;
    RadarChart(".radarChart", data2, radarChartOptions)
}

function drawChart(d) {
    //過去の合計値を削除
    data.shift();
    add_data(d);
    draw_sum_data(data);
    radarChartOptions.startOver = false;
    RadarChart(".radarChart", data, radarChartOptions)
}

function add_data(d){
    newdata_list = []
    for (key in d.ingredient) {
        newdata = {};
        newdata["axis"] = key;
        newdata["value"] = d.ingredient[key];
        newdata_list.push(newdata);
    }
    data.push(newdata_list);
}

//dataの合計値をdataの先頭に追加
function draw_sum_data(d){
    sum_recipe = {"recipe": "sum", "ingredient": {"red" : 0.0, "yellow" : 0.0, "blue" : 0.0, "green" : 0.0, "white" : 0.0, "black" : 0.0}}
    for (var i=0; i<d.length; i++){
        for (var l=0; l<d[i].length; l++) {
            nutrition = d[i][l];
            sum_recipe.ingredient[nutrition.axis] += nutrition.value;
        }
    }
    add_data(sum_recipe)
    //sumをdataの先頭に移動
    data.unshift(data.pop());
    RadarChart(".radarChart", data, radarChartOptions);
}

// for debugging
function debugbuttonEvent() {
    console.log("button pushed");
    d3.selectAll(".referenceCircle").transition().duration(200).attr("r", 50).transition().duration(200).attr("r", 150).transition().duration(1100).attr("r", 0);
    d3.selectAll(".radarArea").transition().duration(1500).attr("d", defaultPathD);
    d3.selectAll(".radarStroke").transition().duration(1500).attr("d", defaultPathD);
    d3.selectAll(".radarCircle").transition().duration(1500).attr("cx", 0).attr("cy", 0);
    d3.selectAll(".radarInvisibleCircle").transition().duration(1500).attr("cx", 0).attr("cy", 0);
    d3.selectAll("text").transition().duration(1500).text(100);
}
