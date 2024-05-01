let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select("#canvas");
let legend = d3.select("#legend");



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
                let county = educationData.find((item) => {
                    return item.fips === id;
                })
                let percentage = county['bachelorsOrHigher']

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
                let county = educationData.find((item) => {
                    return item.fips === id;
                })
                let percentage = county['bachelorsOrHigher']
                return percentage;
            })

            .attr('county', )
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

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log("fetch county data", log);
        } else{
            countyData = topojson.feature(data, data.objects.counties).features; //convert topojson to geojson and only select featutres data which will be used to draw geo map
            console.log("county data", countyData);

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log("fetch education data",log);
                    } else{
                        educationData = data;
                        console.log("education data", educationData);
                        drawMap();
                        drawLegend();
                    }
                }
            )
        }
    }
)


