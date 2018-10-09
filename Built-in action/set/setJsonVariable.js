var wd = require('wd');
var async = require('async');
var jsonManager = require('../../Libs/jsonManager.js');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var jsonName = step.jsonName;
        var jsonData = step.jsonData;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err;

        // Check the parameter
        if(!checkAction.isParameterDefined(jsonName)){
            err = stepDef + errorMsg.noJsonName.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(!checkAction.isParameterDefined(jsonData)){
            err = stepDef + errorMsg.noJsonData.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        async.waterfall([function(cb){
            jsonManager.addJsonVariable(jsonName,jsonData)
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