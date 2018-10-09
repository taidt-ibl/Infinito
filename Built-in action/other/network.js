var wd = require('wd');
var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');

function run(client, step, data) {
    return new Promise((resolve, reject) => {
        var actionName = step.action;
        var network = step.networkConnectionStatus;
        var stepDef = step.step_definition + "\n\t";

        // Check the parameter
        if(!checkAction.isParameterDefined(network)){
            err = stepDef + errorMsg.noNetworkConnection.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }

        if(network == "on"){
            client.setNetworkConnection(6,function(err){
                if(err){
                    return reject(stepDef + err);
                }
                resolve();
            })
        } else {
            client.setNetworkConnection(1,function(err){
                if(err){
                    return reject(stepDef + err);
                }
                return resolve();
            })
        }
    });
}

module.exports = run;

/* Soure: http://webdriver.io/api/mobile/setNetworkConnection.html
it('should emulate network connection', function () {
    browser.setNetworkConnection(0) // airplane mode off, wifi off, data off
    browser.setNetworkConnection(1) // airplane mode on, wifi off, data off
    browser.setNetworkConnection(2) // airplane mode off, wifi on, data off
    browser.setNetworkConnection(4) // airplane mode off, wifi off, data on
    browser.setNetworkConnection(6) // airplane mode off, wifi on, data on
});
*/