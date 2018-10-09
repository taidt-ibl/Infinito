var errorMsg = require('../../Config/ErrorMsg.json');
const variableManager = require('../../Libs/variableManager');
var checkAction = require('../../Libs/checkAction');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var num = step.number;
        var count = step.count;
        var result = step.result;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var convertedNum, convertedCount, resultValue;

        // Check parameter num
        convertedNum = variableManager.convertVariable(num);
        var undefinedNumberErr = stepDef + errorMsg.noNum.message;
        undefinedNumberErr = undefinedNumberErr.replace("${action}",actionName);
        var invalidFormatNumberErr = stepDef + errorMsg.invalidFormatNum.message;
        invalidFormatNumberErr = invalidFormatNumberErr.replace("${action}",actionName);
        var undefinedVariableErr = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariableErr = undefinedVariableErr.replace("${action}",actionName);

        var dataNum = {
            "value": num,
            "convertedValue": convertedNum,
            "undefinedErr" : undefinedNumberErr,
            "invalidFormatErr": invalidFormatNumberErr,
            "undefinedVariableErr": undefinedVariableErr,
        }

        checkAction.checkNumberValid(dataNum, reject);

        // Check parameter count
        convertedCount = variableManager.convertVariable(count);
        var undefinedCountErr = stepDef + errorMsg.noCount.message;
        undefinedCountErr = undefinedCountErr.replace("${action}",actionName);
        var invalidFormatCountErr = stepDef + errorMsg.invalidFormatCount.message;
        invalidFormatCountErr = invalidFormatCountErr.replace("${action}",actionName);
        var undefinedVariableCountErr = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariableCountErr = undefinedVariableCountErr.replace("${action}",actionName);

        var dataCount = {
            "value": count,
            "convertedValue": convertedCount,
            "undefinedErr" : undefinedCountErr,
            "invalidFormatErr": invalidFormatCountErr,
            "undefinedVariableErr": undefinedVariableCountErr,
        }

        checkAction.checkNumberValid(dataCount, reject);

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

        // Round
        resultValue = +(Math.round(convertedNum + "e+" + convertedCount)  + "e-" + convertedCount);
        variableManager.addVariable(result,resultValue);
        resolve();
    })
}

module.exports = run;