
var selected_data = [];
var chart_data =
    [
        { axis: "protein", value: 0.0 },
        { axis: "lipid", value: 0.00 },
        { axis: "carbohydrate", value: 0.00 },
        { axis: "vitamin", value: 0.00 },
        { axis: "mineral", value: 0.00 },
    ]

var estimated_chart_data =
    [
        { axis: "protein", value: 0.0 },
        { axis: "lipid", value: 0.00 },
        { axis: "carbohydrate", value: 0.00 },
        { axis: "vitamin", value: 0.00 },
        { axis: "mineral", value: 0.00 },
    ]

var formatted_chart_data = [chart_data,estimated_chart_data]
var formatted_estimated_data = [estimated_chart_data]

var calorie_sum = 0;
var salt_sum = 0;
var vegetable_sum = 0;

function estimateData(d,flag) {
        for (nu in d.nutrient) {
            for (var i = 0; i < estimated_chart_data.length;i++) {
                if (estimated_chart_data[i].axis == nu) {
                    var temp = chart_data[i].value + d.nutrient[nu]
                    estimated_chart_data[i].value = temp
                }
            }
        }
    //console.log("estimated_data")
    estimated_chart_data.forEach(da => {
        //console.log(da.value)
    })
}

function removeEstimatedData() {
        for (var i = 0; i < estimated_chart_data.length; i++){
            estimated_chart_data[i].value = chart_data[i].value
        }
}

function updateRadarChartData(d,flag) {
    for (var i = 0; i < chart_data.length; i++) {
        chart_data[i].value = estimated_chart_data[i].value
    }
    if (flag == 1){ 
        selected_data.push(d);
    } else {
        for (var i = selected_data.length - 1; i >= 0 ; i--){
            console.log(d.name)
            if (selected_data[i].name == d.name) selected_data.splice(i,1)
            console.log(selected_data);
        }
    }
    // chart_data.forEach(da => {
    //     console.log(da.value)
    // })
}
function recalcurateData(){
    chart_data.forEach(element => {
            element.value = 0;
        selected_data.forEach(sd => {
            element.value += sd.nutrient[element.axis];
        });
    });
    // chart_data.forEach(da => {
    //     console.log(da.value)
    // })
    calcurateCalorieSum();

}
function calcurateCalorieSum(){
    calorie_sum = 0;
    salt_sum = 0;
    vegetable_sum = 0;
    selected_data.forEach(sd => {
        calorie_sum += sd.calory;
        salt_sum += sd.salt;
        vegetable_sum += sd.vegetable;
    })
}