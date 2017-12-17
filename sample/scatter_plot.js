// scatter plot function
function drawScatterPlot() {

    var range_list ={'cooktime': 100, 'good': 600, 'calory': 1000, 'salt': 5, 'vegetable': 200, 'protein': 1.0, 'lipid': 1.0, 'carbohydrate': 1.0, 'vitamin': 1.0, 'mineral': 1.0}

    var width = Number(document.getElementById('plotarea').clientWidth);
    var height = window.innerHeight * 0.5;
    var offset = 20;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var verticalSelect = document.getElementById('vertical');
    var verticalSelectedItem = verticalSelect.options[ verticalSelect.selectedIndex ];
    var verticalValue = verticalSelectedItem.value;
    //console.log(verticalValue)
    var verticalScale = d3.scaleLinear().domain([0,range_list[verticalValue]]).range([height, 10]);
    var verticalAxis = d3.axisLeft(verticalScale);
 
    
    var horizontalSelect = document.getElementById('horizontal');
    var horizontalSelectedItem = horizontalSelect.options[ horizontalSelect.selectedIndex ];
    var horizontalValue = horizontalSelectedItem.value;
    var horizontalScale = d3.scaleLinear().domain([0,range_list[horizontalValue]]).range([0, width]);
    var horizontalAxis = d3.axisBottom(horizontalScale)
    
    var svg = d3.select("#plotarea").append("svg")
                  .attr("width", width - 2*offset)
                  .attr("height", height + 2*offset)
                  .attr("transform", "translate(" + offset + "," + offset + ")");
    
    var horizontal = svg.append("g")
                        .attr("class", "horizontalAxis")
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("shape-rendering", "crispEdges")
                        .attr("transform", "translate(50," + height + ")")
                        .call(horizontalAxis);
    
    var vertical = svg.append("g")
                        .attr("class", "verticalAxis")
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("shape-rendering", "crispEdges")
                        .attr("transform", "translate(50)")
                        .call(verticalAxis);
    
    svg.selectAll("g").selectAll("text")
        .attr("fill", "black")
        .attr("stroke", "black");
    
    // svg.append("text")
    //     .attr("class", "cookTimeLabel")
    //     .attr("text-anchor", "end")
    //     .attr("x", width)
    //     .attr("y", height - 10)
    //     .text("cookTime(m)");
    
    // svg.append("text")
    //     .attr("class", "verticalLabel")
    //     .attr("text-anchor", "end")
    //     .attr("y", 15)
    //     .attr("transform", "rotate(-90)")
    //     .text(verticalValue);
    
    var nameLabel = svg.append("text")
                        .attr("class", "nameLabel")
                        .attr("text-anchor", "end")
                        .attr("font-size", 10)
                        .attr("x", width/2)
                        .attr("y", height/3);
    
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
    
    d3.json("sample_data2.json", function(food) {
    
        function position(p) {
        p.attr("cx", function(d){ return horizontalScale(d[horizontalValue]); });
        p.attr("cy", function(d){ return verticalScale(d[verticalValue]); });
        p.attr("r", function(d) { return 3; });
      }
    
    //   function order(a, b) {
    //     return b.good - a.good;
    //   }
    
      var circle = drawCircle(interpolateData());
        
        function drawCircle(data){
            return svg.append("g").attr("class", "circles")
                                  .selectAll(".circle")
                                  .data(data)
                                  .enter()
                                  .append("circle")
                                  .on("mouseover", function(d){
                                    tooltip.style("visibility", "visible");
                                    estimateData(d,1);
                                    updateRadarChart(d);
                                  })
                                  .on("mousemove", function(d){
                                    tooltip
                                    .style("top", (d3.event.pageY-20)+"px")
                                    .style("left",(d3.event.pageX+20)+"px")
                                    .html(d.name + '<br><img src=' + d.img + ' width="150" height="150">');
                                  })
                                  .on("mouseout", function(){
                                    tooltip.style("visibility", "hidden");
                                    removeEstimatedData();
                                    updateRadarChart();
                                  })
                                  .on("click", function(d){
                                      updateRadarChartData(d,1);
                                      updateRadarChart();
                                      drawSelectedList();
                                      recalcurateData();
                                      barChart();
                                  })
                                  .attr("class", "circle")
                                  .attr("fill", function(d){return selectColor(d.category)})
                                  .attr("stroke", function(d){return selectColor(d.category)})
                                  .call(position)
                                  //.sort(order)
                                  //初めから軸がずれているので調整
                                  .attr("transform", "translate(50)");
        }
        
        d3.select("#main").on("change",update);
        d3.select("#side").on("change",update);
        d3.select("#staple-food").on("change",update);
        verticalSelect.onchange = function(){update();};
        horizontalSelect.onchange = function(){update();};

        var search_button = document.getElementById('mysearch');
        var search_text = document.getElementById('search');
        search_button.addEventListener('click', function() {
            update();
        });
        update();
    
        function update(){
            circle.remove();
            horizontal.remove();
            vertical.remove();
            
            //縦軸の選択
            verticalSelectedItem = verticalSelect.options[ verticalSelect.selectedIndex ];
            verticalValue = verticalSelectedItem.value;
            verticalScale = d3.scaleLinear().domain([0,range_list[verticalValue]]).range([height, 10]);
            verticalAxis = d3.axisLeft(verticalScale);
        


            //横軸の選択
            horizontalSelectedItem = horizontalSelect.options[ horizontalSelect.selectedIndex ];
            horizontalValue = horizontalSelectedItem.value;
            horizontalScale = d3.scaleLinear().domain([0,range_list[horizontalValue]]).range([0, width]);
            horizontalAxis = d3.axisBottom(horizontalScale)

            horizontal = svg.append("g")
                            .attr("class", "horizontalAxis")
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr("shape-rendering", "crispEdges")
                            .attr("transform", "translate(50," + height + ")")
                            .call(horizontalAxis);
            
            vertical = svg.append("g")
                            .attr("class", "verticalAxis")
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr("shape-rendering", "crispEdges")
                            .attr("transform", "translate(50)")
                            .call(verticalAxis);



            var regx = new RegExp('.*' + search_text.value + '.*')
            //カゴリテの選択と検索による正規表現
            select_category = [];
            if(d3.select("#main").property("checked")){select_category.push("main")};
            if(d3.select("#side").property("checked")){select_category.push("side")};
            if(d3.select("#staple-food").property("checked")){select_category.push("staple-food")};
            use_data = interpolateData().filter(function(d){return select_category.indexOf(d.category)>= 0 && regx.test(d.name);});

            circle = drawCircle(use_data);
                }
        
        function selectColor(category){
            var color;
            if(category=="main"){color = "blue"}
            else if(category=="side"){color = "green"}
            else if(category=="staple-food"){color = "red"}
            else{color = "black"}
            return color;
        }
        
        function updateRadarChart(d){
            radarChartOptions.startOver = false;
            RadarChart(".radarChart", formatted_chart_data, radarChartOptions);
            //console.log(formatted_chart_data);
        }
    
      function interpolateData()
      {
        return food.map(
          function(d) { return {
              name: d.name,
              cooktime: d.cooktime,
              calory: d.calory,
              nutrient: d.nutrient,
              good: d.good,
              img: d.img,
              category: d.category,
              salt: d.salt,
              vegetable: d.vegetable,
              protein: d.nutrient.protein,
              lipid: d.nutrient.lipid,
              vitamin: d.nutrient.vitamin,
              mineral: d.nutrient.mineral,
              carbohydrate: d.nutrient.carbohydrate,
              url: d.url
              };
          }
        );
      }
    });    
}
