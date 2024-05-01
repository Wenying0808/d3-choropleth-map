let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select("#canvas");

let drawMap = () => {

}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log("fetch county data", log);
        } else{
            countyData = data;
            console.log("county data", countyData);

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log("fetch education data",log);
                    } else{
                        educationData = data;
                        console.log("education data", educationData);
                    }
                }
            )
        }
    }
)


