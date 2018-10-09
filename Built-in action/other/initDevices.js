var wd = require('wd');
var asserters = wd.asserters;
var config = require('../../Config/Config.json');
const deviceManager = require('../../Libs/deviceManager');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');
var deviceID, interface, element, timeOut, convertedValue;
var pollFreq = config.timeOut.pollFreq;
var defaultTime = config.timeOut.defaultTime;
var stepDef, err, using, newConnection, desiredCaps;
var variableManager = require('../../Libs/variableManager.js');

function run(client, step) {
    return new Promise(function(resolve, reject){
        // Get the action value from the test case
        var actionName = step.action;
        deviceID = step.device;
        interface = step.interface;
        element = step.element;
        stepDef = step.step_definition + "\n\t";
        var result = null;
        var appLocation = __dirname + '/../../AppBuild/';

        // Check the parameter
        if(!checkAction.isParameterDefined(deviceID)){
            err = stepDef + errorMsg.noDevice.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

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
                    err = stepDef + errorMsg.wrongTimeOutFormat.message;
                    err = err.replace("${value}",step.timeOut);
                    err = err.replace("${action}",actionName);
                    return reject(err);
                }
            }else if(step.timeOut < 0){
                err = stepDef + errorMsg.wrongTimeOutValue.message;
                err = err.replace("${value}",step.timeOut);
                err = err.replace("${action}",actionName);
                return reject(err);
            }else{
                timeOut = step.timeOut;
            }
        }
        else{
            timeOut = config.timeOut.mediumTime;
        }

        try{
            convertedValue = variableManager.convertVariable(deviceID);
            var host = {
                hostname:config[convertedValue].hostName,
                port: config[convertedValue].port
            }
        }catch(err){
            err = stepDef + errorMsg.undefinedDevice.message.replace("${device}", deviceID);
            return reject(err);
        }

        appLocation = appLocation + config[convertedValue].app;
        newConnection = wd.remote(host);
        desiredCaps = {
            browserName: '',
            deviceName: config[convertedValue].deviceName,
            platformVersion: config[convertedValue].platformVersion,
            platformName: config[convertedValue].platformName,
            app: appLocation,
            unicodeKeyboard: true,
            resetKeyboard: true,
            newCommandTimeout:0,
        }

        try{
            interface = require('../../Interface/' + interface);
            if(typeof interface[element] === 'undefined'){
                err = stepDef + errorMsg.undefinedElement.message.replace("${element}", element);
                err = err.replace("${interface}", step.interface);
                return reject(err);
            }
        }catch(err){
            return reject(stepDef + err);
        }

        newConnection.sessions(function(err, sessions){
            if(err){
                return reject(stepDef + err);
            }

            if(typeof sessions[0] !== 'undefined'){
                newConnection.sessionID = sessions[0].id;
                newConnection.quit(function(){ 
                    newConnection.sleep(defaultTime,function(){
                        newConnection.sessionID = null;
                        startApp().then(
                        (result)=>{
                            return resolve(result);
                        }).catch((err)=>{
                            return reject(stepDef + err);
                        });
                    })
                })
            }else{
                startApp().then(
                (result)=>{
                    return resolve(result);
                }).catch((err)=>{
                    return reject(err);
                });
            }
        })
    })
}

function startApp(){
    return new Promise(function(resolve, reject){
        newConnection.init(desiredCaps,function(err,device, capabilities){  
            if(err){
                return reject(stepDef + err);
            }

            newConnection.platform = config[convertedValue].platformName;
            if(checkAction.getElementLocator(interface[element])){
                using = checkAction.getElementLocator(interface[element]);
                newConnection.waitForElement(using,interface[element][using],asserters.isDisplayed,timeOut,pollFreq,function(err,data){  
                    if(err){
                        newConnection.quit(function(){ 
                            return reject(stepDef + err);
                        })
                    }
                    deviceManager.addDevice(newConnection);
                    return resolve();                   
                })    
            }else{
                newConnection.quit(function(){   
                    err = stepDef + errorMsg.undefinedElementLocator.message.replace("${element}", element);
                    err = err.replace("${interface}", step.interface);
                    return reject(err);      
                })
            }               
        })
    })
}

module.exports = run;
