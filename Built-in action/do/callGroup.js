var errorMsg = require('../../Config/ErrorMsg.json');
var checkAction = require('../../Libs/checkAction.js');
const startFile = require('../../Libs/run.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var path = step.path;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var err;

        // Check the parameter
        if(!checkAction.isParameterDefined(path)){
            err = stepDef + errorMsg.noPath.message;
            err = err.replace("${action}",actionName);
            return reject(err);
        }
           
        try{
            path = require('../../High level action/' + path);
        }catch(err){
            return reject(stepDef + err);
        }

        //Run Group
        startFile.startWithFile(path, "")
        .then(()=>{
            console.log("--- Finish callGroup action ---")
            return resolve();
        })
        .catch((err)=>{
            reject(stepDef + err);
        })
    });
}

module.exports = run;