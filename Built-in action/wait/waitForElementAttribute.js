var wd = require('wd');
var async = require('async');
var config = require('../../Config/Config.json');
var errorMsg = require('../../Config/ErrorMsg.json');
const variableManager = require('../../Libs/variableManager.js');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var interface = step.interface;
        var element = step.element;
        var attribute = step.attribute;
        var attributeValue = step.value;
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

        if(!checkAction.isParameterDefined(attribute)){
            err = stepDef + errorMsg.noElementAttribute.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(typeof attributeValue === 'undefined'){
            err = stepDef + errorMsg.noValue.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        // Check parameter value if it is the variable
        var convertedValue = variableManager.convertVariable(attributeValue);
        if(!convertedValue && typeof convertedValue === 'boolean'){
            var variableName = attributeValue.substring(2,attributeValue.length-1);
            err = stepDef + errorMsg.notExistedVariable.message;
            err = err.replace("${variable}",variableName);
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(typeof convertedValue === 'undefined'){
            err = stepDef + errorMsg.noValue.message;
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
                        return reject(stepDef + err);
                    }

                    ele.getAttribute(attribute,async function(err, value){
                        if(err){
                            return reject(stepDef + err);
                        }
                        var result = value;
                        var i = 0;
                        async.whilst(function () {
                            return i < timeOut/1000 && result!=convertedValue;
                        },
                        (next) => {
                            try{
                                client.sleep("1000",function(){
                                    ele.getAttribute(attribute,function(err, value){
                                        result = value;
                                        i++;
                                        next();
                                    })
                                })}
                            catch(err){
                                next(err);
                            }
                        },
                        (err) => {
                            if(err) {  
                                return reject(stepDef + err);
                            }
                            if(result != convertedValue){
                                err = stepDef + errorMsg.invalidAttributeValue.message.replace("${element}", element);
                                err = err.replace("${attribute}", step.attribute);
                                err = err.replace("${value}", convertedValue);
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
