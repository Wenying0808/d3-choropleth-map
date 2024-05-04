let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";


let countyData;
let filteredEducationData;
let allEducationData;


let canvas = d3.select("#canvas");
let legend = d3.select("#legend");
let tooltip = d3.select("body").append("div");
tooltip.attr('id', "tooltip")


let dataSelect = d3.select("#dataSelect");
let selectedData = dataSelect.node().value; //use node() to access the DOM element
selectedData = "2008-2012";


let drawMap = () => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')

            //convert geojson into path that svg can 
            //d is used to define shape of svg
            
            .attr('d', d3.geoPath())
            .attr('class', 'county')

            //map county id from county data to fig from education data
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id'];

                let county = filteredEducationData.find(item => parseFloat(item["Federal Information Processing Standard (FIPS) Code"]) === id);

                let percentage = county ? county.Value : null;

                if(percentage <= 10){
                    return '#E0F8F1';
                } else if (percentage <= 20) {
                    return '#90EE90';
                } else if (percentage <= 30) {
                    return '#7FFF00'
                } else if (percentage <= 40) {
                    return '#4CAF50'
                } else if (percentage <= 50) {
                    return '#2E8B57'
                } else if (percentage <= 60) {
                    return '#006B35'
                } else {
                    return '#004400'
                }

            })

            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })

            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id'];
                let county = filteredEducationData.find((item) => {
                    return parseFloat(item["Federal Information Processing Standard (FIPS) Code"]) === id;
                })
                let percentage = county ? county.Value : null;
                return percentage;
            })

            .on("mouseover", function(){
                let countyDataItem = d3.select(this).data()[0]

                tooltip.transition()
                        .style("visibility", "visible");

                let id = countyDataItem['id']; 
                
                let county = filteredEducationData.find((item) => {
                    return parseFloat(item["Federal Information Processing Standard (FIPS) Code"]) === id;
                })
                
                let percentage = county ? county.Value : null;
                let countyName = county ? county['Area name']: null;
                let state = county ? county.State: null;
                
                //content of tooltip
                tooltip.text(countyName + ", " + state + " : " + percentage + "%");

                //position of tooltip
                //calculate the center of the geopath
                let centroid = d3.geoPath().centroid(countyDataItem);
                console.log("centroid", centroid);
                let tooltipX = centroid[0];
                let tooltipY = centroid[1] + 120 ;

                tooltip.style("left", tooltipX + "px");
                tooltip.style("top", tooltipY + "px");
            })

            .on("mouseout", function(){
                tooltip.transition()
                        .style("visibility", "hidden")
            })
}

let drawLegend = () => {
    const legendData = [
        { color: '#E0F8F1', threshold: '10' },
        { color: '#90EE90', threshold: '20' },
        { color: '#7FFF00', threshold: '30' },
        { color: '#4CAF50', threshold: '40' },
        { color: '#2E8B57', threshold: '50' },
        { color: '#006B35', threshold: '60' },
        { color: '#004400', threshold: '' }
    ];

    let legendWidth = 40;
    let legendHeight = 40;
    let legendPadding = 20;

    legend.attr("width", legendWidth * legendData.length + legendPadding * 2)
            .attr("height", legendHeight + legendPadding * 2 )

    legend.selectAll('rect')
        .data(legendData)
        .enter()
        .append('rect')
        .attr('y', 10)
        .attr('x', (d, i) => { return 20 + i * legendWidth })
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", d => d.color)
    legend.selectAll('text')
        .data(legendData)
        .enter()
        .append('text')
        .attr('y', 80)
        .attr('x', (d, i) => { return 20 + ((i + 0.8) * legendWidth) })
        .style("fill", "white")
        .text( d => d.threshold)
}

dataSelect.on("change", function(){
    selectedData = this.value;
    console.log("selectedData", selectedData);

    let attributeData = allEducationData.filter(function(row) {
        if (selectedData === "2017-2021") {
            return row["Attribute"] === "Percent of adults with a bachelor's degree or higher, 2017-21";
        } else if (selectedData === "2008-2012") {
            return row["Attribute"] === "Percent of adults with a bachelor's degree or higher, 2008-12";
        }
    });

    filteredEducationData = attributeData;
    console.log("education data after change selection", filteredEducationData);

    // Clear existing map !!!!
    canvas.selectAll('.county').remove();

    //redraw
    drawMap();
    drawLegend();

})


d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log("fetch county data", log);
        }else{
            countyData = topojson.feature(data, data.objects.counties).features; //convert topojson to geojson and only select featutres data which will be used to draw geo map
            console.log("county data", countyData);


            d3.csv("Education.csv").then(function(data, error){
                if(error){
                    console.log("fetch education data",error);
                } else {
                    allEducationData = data;

                    let attributeData = data.filter(function(row){
                        if (selectedData === "2017-2021"){
                            return row["Attribute"] === "Percent of adults with a bachelor's degree or higher, 2017-21" ;
                        } else if (selectedData === "2008-2012"){
                            return row["Attribute"] === "Percent of adults with a bachelor's degree or higher, 2008-12" ;
                        }
                        
                    })

                    filteredEducationData = attributeData;
                    console.log("education data", filteredEducationData);

                    drawMap();
                    drawLegend();


                    
                }})
        
        }
    }
)


