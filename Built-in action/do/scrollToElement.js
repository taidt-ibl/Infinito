var wd = require('wd');
var errorMsg = require('../../Config/ErrorMsg.json');
var config = require('../../Config/Config.json');
var checkAction = require('../../Libs/checkAction');
var variableManager = require('../../Libs/variableManager');
var async = require('async');

function run(client, step) {
    return new Promise(function (resolve, reject){
        // Get the action value from the test case
        var interface = step.interface;
        var element = step.element;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err;

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

        try{
            interface = require('../../Interface/' + interface);
            if(typeof interface[element] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }

            if(checkAction.getElementLocator(interface[element])){
                using = checkAction.getElementLocator(interface[element]);
                if(client.platform.toLowerCase() == 'android'){
                    client.elementByAndroidUIAutomator("new UiScrollable(new UiSelector().scrollable(true).className(\"android.widget.ScrollView\").instance(0)).scrollIntoView("+interface[element][using]+")", function(err, ele){
                        if(err){
                            return reject(stepDef + err);
                        }
                        ele.tap(function(err){
                            if(err){
                                return reject(stepDef + err);
                            }
                            return resolve();
                        })   
                    })
                }else if(client.platform.toLowerCase() == 'ios'){
                    client.elementByIosUIAutomation("new UiScrollable(new UiSelector().scrollable(true).className(\"ios.widget.ScrollView\").instance(0)).scrollIntoView("+interface[element][using]+")", function(err, ele){
                        if(err){
                            return reject(stepDef + err);
                        }
                        ele.tap(function(err){
                            if(err){
                                return reject(stepDef + err);
                            }
                            return resolve();
                        })   
                    })
                }else{
                    err = stepDef + errorMsg.noSupportedPlatform.message;
                    err = err.replace("${platform}",client.platform);
                    return reject(err);
                }
            }else{
                err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }
        }catch(err){
            return reject(stepDef + err);
        }
    })
}

module.exports = run;
