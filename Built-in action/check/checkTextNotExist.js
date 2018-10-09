var variableManager = require('../../Libs/variableManager.js');
var errorMsg = require('../../Config/ErrorMsg.json');
var expect = require('chai').expect;
var checkAction = require('../../Libs/checkAction.js');

function run(client, step) {
    return new Promise((resolve, reject) => {
        // Get the action value from the test case
        var text = step.text;
        var actionName = step.action;
        var stepDef = step.step_definition + "\n\t";
        var using = "xpath";
        var err;

        // Check parameter text
        if(!checkAction.isParameterDefined(text)){
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

        if(convertedValue != text){
            if(!checkAction.isParameterDefined(convertedValue)){
                err = stepDef + errorMsg.noText.message;
                err = err.replace("${action}",actionName);
                return reject(err);
            }
        }

        var elementXpath = "//*[@text='" + convertedValue + "']";
        client.element(using, elementXpath,function(err,ele){
            if(err){
                ele  = false;
            }else{
                ele = true;
            }
            expect(false).to.equal(ele);
            return resolve();
        })    
    })
}

module.exports = run;
