const listJson = [];

function addJsonVariable(jsonName,jsonData) {
    var temp = {
        jsonName:jsonName,
        json: jsonData
    }
    listJson.push(temp);
}

function getJson(jsonName,attribute){
    for (var index =0;index <listJson.length;index ++){
        if(jsonName==listJson[index].jsonName){
            var obj = listJson[index].json;          
            return obj[attribute]
        }
    }
    console.log("No json found!!!")
}

module.exports = {
    addJsonVariable: addJsonVariable,
    getJson: getJson,
}