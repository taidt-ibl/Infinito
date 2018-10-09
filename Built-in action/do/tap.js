var wd = require('wd');
var errorMsg = require('../../Config/ErrorMsg.json');
var config = require('../../Config/Config.json');
var checkAction = require('../../Libs/checkAction.js');
var asserters = wd.asserters;

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var interface = step.interface;
        var element = step.element;
        var timeOut = config.timeOut.defaultTime;
        var pollFreq = config.timeOut.pollFreq;
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

        try{
            interface = require('../../Interface/' + interface);
            if(typeof interface[element] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }

            if(checkAction.getElementLocator(interface[element])){
                using = checkAction.getElementLocator(interface[element]);
                client.waitForElement(using,interface[element][using],asserters.isDisplayed,timeOut,pollFreq,function(err,ele){
                    if(err){
                        err = stepDef + errorMsg.notExistedElement.message.replace("${element}", element);
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