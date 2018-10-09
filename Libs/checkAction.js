function isParameterDefined(param) {
    if(typeof param === 'undefined')
    {
        return false;   
    }else{
        if(typeof param === 'string'){
            if(param.trim() === ''){
                return false;
            }else{
                return true;
            }
        }
        else{
            return true;
        }
    }  
}

function getElementLocator(element) {
    if(typeof element.id !== 'undefined'){
        return "id";
    }else if(typeof element.name !== 'undefined'){
        return "name";
    }else if(typeof element.xpath !== 'undefined'){
        return "xpath";
    }else if(typeof element.uiSelector !== 'undefined'){
        return "uiSelector";
    }else{
        return false;
    }
}

function isSpecialCharacter(value){
    var pattern=/^[a-zA-Z0-9- ]*$/;
    return pattern.test(value) ? false : true;
}

function checkVariableValid(data, reject){
    var value = data.value;
    var undefinedErr = data.undefinedErr;
    var invalidErr = data.invalidErr;

    if(typeof value !== 'undefined'){
        if(typeof value === 'string'){
            if(value.trim() === ''){
                return reject(undefinedErr);
            }
                
            if(isSpecialCharacter(value) || !isNaN(value)){
                return reject(invalidErr);
            }
        }
        else{
            return reject(invalidErr);
        }
    }
    else{
        return reject(undefinedErr);
    }
}

function checkNumberValid(data, reject){
    var value = data.value;
    var convertedValue = data.convertedValue;
    var undefinedErr = data.undefinedErr;
    var invalidFormatErr = data.invalidFormatErr;
    var undefinedVariableErr = data.undefinedVariableErr;

    if(typeof value !== 'undefined'){
        if(convertedValue == value){
            if(typeof value === 'string'){
                if(value.trim() === ''){
                    return reject(undefinedErr);           
                }else{
                    invalidFormatErr = invalidFormatErr.replace("${value}",value);
                    return reject(invalidFormatErr); 
                }
            }
        }else if(!convertedValue && typeof convertedValue === 'boolean'){
            var variableName = value.substring(2,value.length-1);
            undefinedVariableErr = undefinedVariableErr.replace("${variable}",variableName);
            return reject(undefinedVariableErr);   
        }else{
            if(typeof convertedValue === 'string'){
                if(convertedValue.trim() === ''){
                    return reject(undefinedErr);           
                }else{
                    invalidFormatErr = invalidFormatErr.replace("${value}",convertedValue);
                    return reject(invalidFormatErr); 
                }
            }
        }
    }else{
        return reject(undefinedErr);
    }
}

module.exports = {
    isParameterDefined: isParameterDefined,
    getElementLocator: getElementLocator,
    checkVariableValid: checkVariableValid,
    isSpecialCharacter: isSpecialCharacter,
    checkNumberValid: checkNumberValid
}