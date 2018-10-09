var variableManager = require('../../Libs/variableManager.js');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var convertedMin, minFixed, maxFixed,fixed, highlightedNumber;
        var min = step.min;
        var max = step.max;
        var result = step.result;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";

        // Check min parameter
        convertedMin = variableManager.convertVariable(min);
        var undefinedMinErr = stepDef + errorMsg.noMin.message;
        undefinedMinErr = undefinedMinErr.replace("${action}",actionName);
        var invalidFormatMinErr = stepDef + errorMsg.invalidFormatMin.message;
        invalidFormatMinErr = invalidFormatMinErr.replace("${action}",actionName);
        var undefinedVariableMinErr = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariableMinErr = undefinedVariableMinErr.replace("${action}",actionName);

        var dataMin = {
            "value": min,
            "convertedValue": convertedMin,
            "undefinedErr" : undefinedMinErr,
            "invalidFormatErr": invalidFormatMinErr,
            "undefinedVariableErr": undefinedVariableMinErr,
        }

        checkAction.checkNumberValid(dataMin, reject);
        if(convertedMin < 0){
            err = stepDef + errorMsg.invalidValueMin.message;
            err = err.replace("${value}",convertedMin);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check max parameter
        convertedMax = variableManager.convertVariable(max);
        var undefinedMaxErr = stepDef + errorMsg.noMax.message;
        undefinedMaxErr = undefinedMaxErr.replace("${action}",actionName);
        var invalidFormatMaxErr = stepDef + errorMsg.invalidFormatMax.message;
        invalidFormatMaxErr = invalidFormatMaxErr.replace("${action}",actionName);
        var undefinedVariableMaxErr = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariableMaxErr = undefinedVariableMaxErr.replace("${action}",actionName);

        var dataMax = {
            "value": max,
            "convertedValue": convertedMax,
            "undefinedErr" : undefinedMaxErr,
            "invalidFormatErr": invalidFormatMaxErr,
            "undefinedVariableErr": undefinedVariableMaxErr,
        }

        checkAction.checkNumberValid(dataMax, reject);
        if(convertedMax < 0){
            err = stepDef + errorMsg.invalidValueMax.message;
            err = err.replace("${value}",convertedMax);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(convertedMax < convertedMin){
            err = stepDef + errorMsg.invalidValueMinMax.message;
            err = err.replace("${min}",convertedMin);
            err = err.replace("${max}",convertedMax);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check parameter result
        var undefinedErr = stepDef + errorMsg.noResult.message;
        undefinedErr = undefinedErr.replace("${action}",actionName);
        var invalidErr = stepDef + errorMsg.invalidResult.message;
        invalidErr = invalidErr.replace("${result}",result);
        invalidErr = invalidErr.replace("${action}",actionName);

        var data = {
            "value": result,
            "undefinedErr" : undefinedErr,
            "invalidErr": invalidErr
        }
        
        checkAction.checkVariableValid(data, reject);

        // Generate random number
        if(Math.floor(convertedMin) != convertedMin){
            minFixed = convertedMin.toString().length - convertedMin.toString().indexOf(".") - 1;
        }else{
            minFixed = 0;
        }

        if(Math.floor(convertedMax) != convertedMax){
            maxFixed = convertedMax.toString().length - convertedMax.toString().indexOf(".") - 1;
        }else{
            maxFixed = 0;
        }

        
        do{
            fixed = (Math.random() * (maxFixed - minFixed) + minFixed).toFixed(0);
            highlightedNumber = (Math.random() * (convertedMax - convertedMin) + convertedMin).toFixed(fixed);
            highlightedNumber =  Number(highlightedNumber);
            console.log("highlightedNumber: " + highlightedNumber)
        }while(highlightedNumber < convertedMin);

        variableManager.addVariable(result,highlightedNumber);
        return resolve();
    })
}

module.exports = run;
