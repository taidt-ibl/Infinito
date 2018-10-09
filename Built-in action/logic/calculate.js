var errorMsg = require('../../Config/ErrorMsg.json');
const variableManager = require('../../Libs/variableManager');
var checkAction = require('../../Libs/checkAction');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var operator = step.operator;
        var num1 = step.number1;
        var num2 = step.number2;
        var result = step.result;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err, convertedNum1, convertedNum2;

        // Check the parameter
        if(!checkAction.isParameterDefined(operator)){
            err = stepDef + errorMsg.noOperator.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check parameter num1
        convertedNum1 = variableManager.convertVariable(num1);
        var undefinedNumber1Err = stepDef + errorMsg.noNum1.message;
        undefinedNumber1Err = undefinedNumber1Err.replace("${action}",actionName);
        var invalidFormatNumber1Err = stepDef + errorMsg.invalidFormatNum1.message;
        invalidFormatNumber1Err = invalidFormatNumber1Err.replace("${action}",actionName);
        var undefinedVariable1Err = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariable1Err = undefinedVariable1Err.replace("${action}",actionName);

        var dataNum1 = {
            "value": num1,
            "convertedValue": convertedNum1,
            "undefinedErr" : undefinedNumber1Err,
            "invalidFormatErr": invalidFormatNumber1Err,
            "undefinedVariableErr": undefinedVariable1Err,
        }

        checkAction.checkNumberValid(dataNum1, reject);

        // Check parameter num2
        convertedNum2 = variableManager.convertVariable(num2);
        var undefinedNumber2Err = stepDef + errorMsg.noNum2.message;
        undefinedNumber2Err = undefinedNumber2Err.replace("${action}",actionName);
        var invalidFormatNumber2Err = stepDef + errorMsg.invalidFormatNum2.message;
        invalidFormatNumber2Err = invalidFormatNumber2Err.replace("${action}",actionName);
        var undefinedVariable2Err = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariable2Err = undefinedVariable2Err.replace("${action}",actionName);

        var dataNum2 = {
            "value": num2,
            "convertedValue": convertedNum2,
            "undefinedErr" : undefinedNumber2Err,
            "invalidFormatErr": invalidFormatNumber2Err,
            "undefinedVariableErr": undefinedVariable2Err,
        }

        checkAction.checkNumberValid(dataNum2, reject);

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

        switch(operator.toLowerCase()){
            case "plus":
                resultValue = convertedNum1 + convertedNum2;
                console.log("resultValue: " + resultValue)
                variableManager.addVariable(result,resultValue);
                resolve();
                break;
            case "minus":
                resultValue = convertedNum1 - convertedNum2;
                variableManager.addVariable(result,resultValue);
                resolve();
                break;
            case "divide":
                resultValue = convertedNum1 / convertedNum2;
                variableManager.addVariable(result,resultValue);
                resolve();
                break;
            case "multiple":
                resultValue = convertedNum1 * convertedNum2;
                variableManager.addVariable(result,resultValue);
                resolve();
                break;
            default:
                err = stepDef + errorMsg.invalidOperator.message;
                err = err.replace("${operator}",operator);
                err = err.replace("${action}",actionName);
                return reject(err);
        }
    })
}

module.exports = run;