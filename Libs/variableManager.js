var listVariables = [];

function initVariable(data){
    var objProperties = Object.getOwnPropertyNames(data);
    for(var obj in objProperties){
        var objProperty =  objProperties[obj].toString();
        var temp = {
                name:objProperty,
                value: data[objProperty]
        }
        listVariables.push(temp);
    }
}

function addVariable(variableName,variableValue) {
    var flag = false;
    for (var index =0;index <listVariables.length;index ++){
        if(variableName==listVariables[index].name){
            listVariables[index].value = variableValue;
            flag = true;
        }
    }
    
    if(!flag){
        var temp = {
            name:variableName,
            value: variableValue
        }

        listVariables.push(temp);
    }
}

function getVariable(variableName){
    for (var index =0;index <listVariables.length;index ++){
        if(variableName==listVariables[index].name){
            return listVariables[index].value
        }
    }
    return false;
}

function convertVariable(variableName){
    if(typeof variableName === 'string'){
        if(!variableName.includes("${")){
            return variableName;
        }
        else {
            var result = variableName.substring(2,variableName.length-1);
            if(result.includes("${")){
                var insideResult = result.substring(result.indexOf("${") + 2, result.length -1);
                result = result.replace(result.substring(result.indexOf("${"), result.length), this.getVariable(insideResult));
            }

            return this.getVariable(result);
        }
    }else{
        return variableName;
    }
}

function clearVariables(){
    listVariables = [];
}

module.exports = {
    initVariable: initVariable,
    addVariable: addVariable,
    getVariable: getVariable,
    convertVariable: convertVariable,
    clearVariables: clearVariables,
}