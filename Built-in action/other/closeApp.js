var deviceManager = require('../../Libs/deviceManager.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        var stepDef = step.step_definition + "\n\t";

        client.quit(function(err){
            if(err){
                return reject(stepDef + err);
            }
            deviceManager.clearDevice();
            return resolve();
        })
    })
}

module.exports = run;