var wd = require('wd');
var async = require('async');
var config = require('../../Config/Config.json');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');
var variableManager = require('../../Libs/variableManager.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var text = step.text;
        var timeOut;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err;
        var using = "xpath";

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

        if(typeof step.timeOut !== 'undefined'){
            if(typeof step.timeOut === 'string'){
                if(step.timeOut.trim() === ''){
                    err = stepDef + errorMsg.noTimeOut.message;
                    err = err.replace("${action}",actionName);
                    return reject(err);
                }else{
                    err = stepDef + errorMsg.invalidFormatTimeOut.message;
                    err = err.replace("${value}",step.timeOut);
                    err = err.replace("${action}",actionName);
                    return reject(err);
                }
            }else if(step.timeOut < 0){
                err = stepDef + errorMsg.invalidValueTimeOut.message;
                err = err.replace("${value}",step.timeOut);
                err = err.replace("${action}",actionName);
                return reject(err);
            }else{
                timeOut = step.timeOut;
            }
        }
        else{
            timeOut = config.timeOut.shortTime;
        }


        var elementXpath = "//*[@text='" + convertedValue + "']";
        client.element(using,elementXpath,async function(err,ele){
            if(err){
                return resolve();
            }
            ele.isDisplayed(async function(err, result){
                if(err){
                    return reject(stepDef + err);
                }
                var displayed = result;
                var i = 0;
                async.whilst(function () {
                    return i < timeOut/1000 && displayed;
                },
                (next) => {
                    client.sleep("1000",function(){
                        client.element(using,elementXpath,async function(err,ele){
                            if(err){
                                displayed = false;
                                next(err);
                            }else{
                                ele.isDisplayed(function(err, result){
                                    if(err){
                                        return reject(stepDef + err);
                                    }
                                    displayed = result;
                                    i++;
                                    next();
                                })
                            }
                        })
                    })
                },
                (err) => {
                    if(err) {
                        return resolve();
                    }
                    if(displayed){
                        err = stepDef + errorMsg.existedText.message.replace("${text}", convertedValue);
                        return reject(err);
                    }
                    return resolve();
                });  
            });
        });
    });
}
                   
module.exports = run;
