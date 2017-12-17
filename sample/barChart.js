var prev_calorie_sum = 0;
var prev_salt_sum = 0;
var prev_vegetable_sum = 0;
function barChart(){
    //var width = window.innerWidth / 2;
    var width = content_width;
    var height = window.innerHeight * 0.4;
    var offset = 10;
    var bar_offset = 50;
    var standardRatio = 0.6;
    d3.select("#barChart").select("svg").remove();
    var svg = d3.select("#barChart").append("svg")
                .attr("width", width + 2*offset)
                .attr("height", height + 2*offset)
                .attr("transform", "translate(" + offset + "," + offset + ")");

    var bar_height = 30;
    var calorie_standard = 2400;
    var salt_standard = 8;
    var vegetable_standard = 350;
    var calorieScale = d3.scaleLinear().domain([0,calorie_standard]).range([0, width*standardRatio]);
    var saltScale = d3.scaleLinear().domain([0,salt_standard]).range([0, width*standardRatio]);
    var vegetableScale = d3.scaleLinear().domain([0,vegetable_standard]).range([0, width*standardRatio]);

    var standard_line = svg.append("line")
                        .attr("x1", width*standardRatio)
                        .attr("y1", bar_offset-10)
                        .attr("x2", width*standardRatio)
                        .attr("y2", bar_offset*3+30)
                        .attr("stroke", "red")
                        .attr("stroke-width", "2px")
    
    var calorie_text = svg.append("text").attr("x", offset)
                                        .attr("y", bar_offset-5)
                                        .style("font-size", "13px")
                                        .text("Calorie")
    var calorie_bar = svg.append("rect")
                    .attr("x", offset)
                    .attr("y", bar_offset)
                    .attr("fill", barColor(calorie_sum, calorie_standard))
                    .attr("height", 20)
                    .attr("width", calorieScale(prev_calorie_sum))
                    .transition()
                    .ease(d3.easeExp)
                    .duration(1000)
                    .attr("width", function(){
                        prev_calorie_sum = calorie_sum;
                        return calorieScale(calorie_sum);
                    })

    var salt_text = svg.append("text").attr("x", offset)
                                        .attr("y", bar_offset*2-5)
                                        .style("font-size", "13px")
                                        .text("Salt")
    var salt_bar = svg.append("rect")
                    .attr("x", offset)
                    .attr("y", bar_offset*2)
                    .attr("fill", barColor(salt_sum, salt_standard))
                    .attr("height", 20)
                    .attr("width", saltScale(prev_salt_sum))
                    .transition()
                    .ease(d3.easeExp)
                    .duration(1000)
                    .attr("width", function(){
                        prev_salt_sum = salt_sum;
                        return saltScale(salt_sum);
                    })

    var vegetable_text = svg.append("text").attr("x", offset)
                                        .attr("y", bar_offset*3-5)
                                        .style("font-size", "13px")
                                        .text("Vegetable")
    var vegetable_bar = svg.append("rect")
                    .attr("x", offset)
                    .attr("y", bar_offset*3)
                    .attr("fill", barColor(vegetable_sum, vegetable_standard))
                    .attr("height", 20)
                    .attr("width", vegetableScale(prev_vegetable_sum))
                    .transition()
                    .ease(d3.easeExp)
                    .duration(1000)
                    .attr("width", function(){
                        prev_vegetable_sum = vegetable_sum;
                        return vegetableScale(vegetable_sum);
                    })
    function barColor(data, standard){
        var min = standard * 0.7;
        var max = standard * 1.2;
        if (data < min) {
            return "#4d4dff"
        } else if (min < data && data < max) {
            return "black"
        } else {
            return "#ff4d4d"
        }
    }

}