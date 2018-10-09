var wd = require('wd');
var async = require('async');
var jsonManager = require('../../Libs/jsonManager.js');
var variableManager = require('../../Libs/variableManager.js');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var variable = step.variable;
        var jsonAttribute = step.jsonAttribute;
        var jsonName = step.jsonName;
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

        if(!checkAction.isParameterDefined(jsonAttribute)){
            err = stepDef + errorMsg.noJsonAttribute.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        var jsonAttribute = jsonManager.getJson(jsonName,attribute); 
        async.waterfall([function(cb){
            variableManager.addVariable(variable,jsonAttribute)
            cb(null);
        },],function(err){
            if(err){
                console.log("err",err)
            }
            return resolve();
        })    
    });
}

module.exports = run;