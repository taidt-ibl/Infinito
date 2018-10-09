var errorMsg = require('../../Config/ErrorMsg.json');
const variableManager = require('../../Libs/variableManager');
var checkAction = require('../../Libs/checkAction');
var interface = require('../../Interface/Portfolio/CoinToken.json')

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var type = step.type;
        var variable = step.variable;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err, transactionFee, using;
        var element = "txtTransactionFee";

        // Get the error message
        var undefinedErr = stepDef + errorMsg.noVariable.message;
        undefinedErr = undefinedErr.replace("${action}",actionName);
        var invalidErr = stepDef + errorMsg.invalidVariable.message;
        invalidErr = invalidErr.replace("${variable}",variable);
        invalidErr = invalidErr.replace("${action}",actionName);

        var data = {
            "value": variable,
            "undefinedErr" : undefinedErr,
            "invalidErr": invalidErr
        }

        // Check the parameter
        if(!checkAction.isParameterDefined(type)){
            err = stepDef + errorMsg.noType.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check parameter variable
        checkAction.checkVariableValid(data, reject);

        convertedType = variableManager.convertVariable(type);
        if (!convertedType && typeof convertedType === 'boolean'){
            var variableName = type.substring(2,type.length-1);
            err = stepDef + errorMsg.notExistedVariable.message;
            err = err.replace("${variable}",variableName);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(checkAction.getElementLocator(interface[element])){
            using = checkAction.getElementLocator(interface[element]);
            client.element(using,interface[element][using],function(err,ele){
                if(err){
                    return reject(stepDef + err);
                }
                ele.text(function(err,text){
                    if(err){
                        return reject(stepDef + err);
                    }  

                    if(text.indexOf(convertedType) == -1){
                        err = stepDef + errorMsg.invalidType.message;
                        err = err.replace("${type}",convertedType);
                        err = err.replace("${action}",actionName);
                        return reject(err);
                    }else{
                        transactionFee =  text.substring(0, text.indexOf(convertedType) - 1);
                        transactionFee = Number(transactionFee);
                        variableManager.addVariable(variable,transactionFee);
                        return resolve();
                    }
                })
            })
        }else{
            err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element);
            err = err.replace("${interface}", step.interface);
            return reject(err);
        }
    })
}

module.exports = run;