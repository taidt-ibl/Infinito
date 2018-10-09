var wd = require('wd');
var errorMsg = require('../../Config/ErrorMsg.json');
var config = require('../../Config/Config.json');
var checkAction = require('../../Libs/checkAction');
var variableManager = require('../../Libs/variableManager');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var interface = step.interface;
        var element = step.element;
        var actionName = step.action;
        var xEnd = step.x;
        var yEnd = step.y;
        var xFrom, yFrom;
        var waitTime = config.timeOut.pollFreq;
        var stepDef = step.step_definition + "\n\t";
        var err, using, convertedX, convertedY;

        // Check the parameter
        if(!checkAction.isParameterDefined(interface)){
            err = stepDef + errorMsg.noInterface.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(!checkAction.isParameterDefined(element)){
            err = stepDef + errorMsg.noElement.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check the parameter x
        convertedX = variableManager.convertVariable(xEnd);
        var undefinedXErr = stepDef + errorMsg.noX.message;
        undefinedXErr = undefinedXErr.replace("${action}",actionName);
        var invalidFormatXErr = stepDef + errorMsg.invalidFormatX.message;
        invalidFormatXErr = invalidFormatXErr.replace("${action}",actionName);
        var undefinedXVariableErr = stepDef + errorMsg.notExistedVariable.message;
        undefinedXVariableErr = undefinedXVariableErr.replace("${action}",actionName);

        var dataX = {
            "value": xEnd,
            "convertedValue": convertedX,
            "undefinedErr" : undefinedXErr,
            "invalidFormatErr": invalidFormatXErr,
            "undefinedVariableErr": undefinedXVariableErr,
        }

        checkAction.checkNumberValid(dataX, reject);
        if(convertedX < 0){
            err = stepDef + errorMsg.invalidValueX.message;
            err = err.replace("${value}",convertedX);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check the parameter y
        convertedY = variableManager.convertVariable(yEnd);
        var undefinedYErr = stepDef + errorMsg.noY.message;
        undefinedYErr = undefinedYErr.replace("${action}",actionName);
        var invalidFormatYErr = stepDef + errorMsg.invalidFormatY.message;
        invalidFormatYErr = invalidFormatYErr.replace("${action}",actionName);
        var undefinedVariableYErr = stepDef + errorMsg.notExistedVariable.message;
        undefinedVariableYErr = undefinedVariableYErr.replace("${action}",actionName);

        var dataY = {
            "value": yEnd,
            "convertedValue": convertedY,
            "undefinedErr" : undefinedYErr,
            "invalidFormatErr": invalidFormatYErr,
            "undefinedVariableErr": undefinedVariableYErr,
        }

        checkAction.checkNumberValid(dataY, reject);
        if(convertedY < 0){
            err = stepDef + errorMsg.invalidValueY.message;
            err = err.replace("${value}",convertedY);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        try{
            interface = require('../../Interface/' + interface);
            if(typeof interface[element] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }

            if(checkAction.getElementLocator(interface[element])){
                using = checkAction.getElementLocator(interface[element]);
                client.element(using,interface[element][using],function(err,ele){
                    if(err){
                        return reject(stepDef + err);
                    }
                    ele.getLocation(async function(err,location){
                        if(err){
                            return reject(stepDef + err);
                        }
                        xFrom = await location.x;
                        yFrom = await location.y;
                        var action = new wd.TouchAction();
                        action.press({x: xFrom, y: yFrom})
                        .wait(waitTime)
                        .moveTo({x: convertedX, y: convertedY})
                        .release();
                        client.performTouchAction(action);
                        return resolve();
                    })
                })
            }else{
                err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }
        }catch(err){
            return reject(stepDef + err);
        }
    });
}

module.exports = run