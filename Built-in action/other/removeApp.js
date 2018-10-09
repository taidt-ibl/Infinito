var errorMsg = require('../../Config/ErrorMsg.json');
var config = require('../../Config/Config.json');
var wd = require('wd');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var appId = config.app.package;
        var timeOut;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";

        // Check the parameter
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
            timeOut = config.timeOut.shortTime;
        }

        client.removeAppFromDevice(appId, function(){
            client.sleep(timeOut,function(){
                return resolve();
            })
        })
    })
}
module.exports = run;