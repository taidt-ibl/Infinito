var variableManager = require('../../Libs/variableManager.js');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');
var wd = require('wd');
var asserters = wd.asserters;
var config = require('../../Config/Config.json');


function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var text = step.text;
        var timeOut = config.timeOut.defaultTime;
        var pollFreq = config.timeOut.pollFreq;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var using = "xpath";
        var err;

        // Check parameter text
        if(!checkAction.isParameterDefined(text)){
            err = stepDef + errorMsg.noText.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }
        
        // Check parameter text if it is the variable
        var convertedValue = variableManager.convertVariable(text);
        if(!convertedValue && typeof convertedValue === 'boolean'){
            var variableName = text.substring(2,text.length-1);
            err = stepDef + errorMsg.notExistedVariable.message;
            err = err.replace("${variable}",variableName);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(convertedValue != text){
            if(!checkAction.isParameterDefined(convertedValue)){
                err = stepDef + errorMsg.noText.message;
                err = err.replace("${action}",actionName);
                return reject(err);
            }
        }

        var elementXpath = "//*[@text='" + convertedValue + "']";
        client.waitForElement(using,elementXpath,asserters.isDisplayed,timeOut,pollFreq,function(err,ele){ 
            if(err){
                err = stepDef + errorMsg.notExistedText.message.replace("${text}", convertedValue);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }
            ele.tap(function(err){
                if(err){
                    return reject(stepDef + err);
                }
                return resolve();
            })         
        })      
    });
}

module.exports = run;