const fs = require('fs');
const async = require('async');
var actions = require('../Built-in action/convertAction');
const deviceManager = require('../Libs/deviceManager.js');
const variableManager = require('../Libs/variableManager.js');

async function startWithFile(step, data) {
    return new Promise((resolve, reject) => {
        var index = 0;
        if(typeof step.Tc !== 'undefined'){
            console.log('\n\--- Test case',step.Tc);
        }

        if(typeof data === 'object'){
            variableManager.initVariable(data);
        }
        
        async.whilst(
            () => { 
                return index < step.steps.length; 
            },
            (next) => {
                var curDevice = deviceManager.getCurrentDevice();
                console.log('--- Step',step.steps[index].step_definition);
                actions
                    .run(curDevice, step.steps[index])
                    .then(() => {
                        index++;
                        next();
                    })
                    .catch((err) => {
                        next(err);
                    })
            },
            (err) => {
                if(err) { 
                    return reject(err); 
                }
                console.log('--- Finish ---');
                resolve();
            }
        );
    });
}

module.exports = {
    startWithFile: startWithFile
}

