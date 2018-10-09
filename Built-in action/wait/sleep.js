var errorMsg = require('../../Config/ErrorMsg.json');
var config = require('../../Config/Config.json');

function run(client, step, data) {
    return new Promise((resolve, reject) => {
        var timeOut;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err;

        // Check the parameter
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
            timeOut = config.timeOut.defaultTime;
        }
        
        client.sleep(timeOut,function(){
            return resolve();
        })
    });
}

module.exports = run;
