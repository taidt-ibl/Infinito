var wd = require('wd');
var async = require('async');
const variableManager = require('../../Libs/variableManager.js');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var variable = step.variable;
        var value = step.value;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err;

        // Check parameter variable
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

        checkAction.checkVariableValid(data, reject);

        if(typeof value === 'undefined'){
            err = stepDef + errorMsg.noValue.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        async.waterfall([function(cb){
            var variableValue = variableManager.convertVariable(value);
            cb(null,variableValue);
        },function(variableValue,cb){
            variableManager.addVariable(variable,variableValue);
            cb(null)
        }],function(err){
            if(err){
                return reject(stepDef + err);
            }
            return resolve();
        })
    });
}

module.exports = run;