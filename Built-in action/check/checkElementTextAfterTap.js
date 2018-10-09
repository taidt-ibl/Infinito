var expect = require('chai').expect;
var wd = require('wd');
var errorMsg = require('../../Config/ErrorMsg.json');
var config = require('../../Config/Config.json');
const variableManager = require('../../Libs/variableManager.js');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var interface = step.interface;
        var element_1 = step.element_1;
        var element_2 = step.element_2;
        var text = step.text;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err, using;

        // Check the parameter
        if(!checkAction.isParameterDefined(interface)){
            err = stepDef + errorMsg.noInterface.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(!checkAction.isParameterDefined(element_1)){
            err = stepDef + errorMsg.noElement1.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(!checkAction.isParameterDefined(element_2)){
            err = stepDef + errorMsg.noElement2.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(typeof text === 'undefined'){
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

        if(typeof convertedValue === 'undefined'){
            err = stepDef + errorMsg.noText.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        try{
            interface = require('../../Interface/' + interface);
            if(typeof interface[element_1] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element_1);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }

            if(typeof interface[element_2] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element_2);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }

            if(checkAction.getElementLocator(interface[element_1])){
                using = checkAction.getElementLocator(interface[element_1]);
                client.element(using, interface[element_1][using],function(err,ele){
                    if(err){
                        return reject(stepDef + err);
                    }
                    var action = new wd.TouchAction(client);
                    var opts ={
                        element:ele
                    }
                    var waitTime = config.timeOut.pollFreq;
                    action.press(opts).wait(waitTime).perform(()=>{
                        if(checkAction.getElementLocator(interface[element_2])){
                            using = checkAction.getElementLocator(interface[element_2]);
                            client.element(using, interface[element_2][using],function(err,ele_2){
                                if(err){
                                    return reject(stepDef + err);
                                }
                                ele_2.text(function(err,text){
                                    if(err){
                                        return reject(stepDef + err);
                                    }
                                    expect(text).to.equal(convertedValue);
                                    return resolve();
                                })
                            })
                        }else{
                            err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element_2);
                            err = err.replace("${interface}", step.interface);
                            return reject(err);
                        }
                    })
                })
            }else{
                err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element_1);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }
        }catch(err){
            return reject(stepDef + err);
        }
    });
}

module.exports = run