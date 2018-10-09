var errorMsg = require('../../Config/ErrorMsg.json');
const variableManager = require('../../Libs/variableManager.js');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var interface = step.interface;
        var element = step.element;
        var x = step.x;
        var y = step.y;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err, using;

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

        // Check parameter x
        var undefinedErr = stepDef + errorMsg.noX.message;
        undefinedErr = undefinedErr.replace("${action}",actionName);
        var invalidErr = stepDef + errorMsg.invalidX.message;
        invalidErr = invalidErr.replace("${variable}",x);
        invalidErr = invalidErr.replace("${action}",actionName);

        var data = {
            "value": x,
            "undefinedErr" : undefinedErr,
            "invalidErr": invalidErr
        }

        checkAction.checkVariableValid(data, reject);

        // Check parameter y
        var undefinedErrY = stepDef + errorMsg.noY.message;
        undefinedErrY = undefinedErrY.replace("${action}",actionName);
        var invalidErrY = stepDef + errorMsg.invalidY.message;
        invalidErrY = invalidErrY.replace("${variable}",y);
        invalidErrY = invalidErrY.replace("${action}",actionName);

        var dataY = {
            "value": y,
            "undefinedErr" : undefinedErrY,
            "invalidErr": invalidErrY
        }

        checkAction.checkVariableValid(dataY, reject);

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
                        variableManager.addVariable(x,location.x);
                        variableManager.addVariable(y,location.y);
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

module.exports = run;