var wd = require('wd');
var asserters = wd.asserters;
var async = require('async');
var config = require('../../Config/Config.json');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var interface = step.interface;
        var element = step.element;
        var timeOut;
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

        try{
            interface = require('../../Interface/' + interface);
            if(typeof interface[element] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }

            if(checkAction.getElementLocator(interface[element])){
                using = checkAction.getElementLocator(interface[element]);
                client.element(using,interface[element][using],async function(err,ele){
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
                                client.element(using,interface[element][using],async function(err,ele){
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
                                err = stepDef + errorMsg.existedElement.message.replace("${element}", element);
                                err = err.replace("${interface}", step.interface);
                                return reject(err);
                            }
                            return resolve();
                        });  
                    });
                });
            }else{
                err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }
        }
        catch(err){
            return reject(stepDef + err);
        }
    });
}
                   
module.exports = run;
