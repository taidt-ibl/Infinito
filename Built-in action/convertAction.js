var errorMsg = require('../Config/ErrorMsg.json');

function getAction(client,step) {
    return new Promise((resolve, reject) => {
        var result, action, err;

        var actionMap =
        {
            // check
            'checkElementAttribute': require('./check/checkElementAttribute'),
            'checkElementText': require('./check/checkElementText'), 
            'checkElementTextAfterTap': require('./check/checkElementTextAfterTap'),
            'checkTextContain': require('./check/checkTextContain'),
            'checkTextExist': require('./check/checkTextExist'),
            'checkTextNotExist': require('./check/checkTextNotExist'),

            // do
            'callGroup': require('./do/callGroup'),
            'generateRandomNumber': require('./do/generateRandomNumber'),
            'moveElement': require('./do/moveElement'),
            'scrollToElement': require('./do/scrollToElement'),
            'tap': require('./do/tap'),
            'tapByText': require('./do/tapByText'),
            'type': require('./do/type'),   

            // get
            'getElementLocation': require('./get/getElementLocation'),
            'getElementText': require('./get/getElementText'),
            'getJsonAttribute': require('./get/getJsonAttribute'),

            // logic
            'calculate': require('./logic/calculate'),
            'round': require('./logic/round'),

            // other
            'closeApp': require('./other/closeApp'),
            'initDevice': require('./other/initDevices'),
            'netWork': require('./other/network'),
            'removeApp': require('./other/removeApp'),

            // set
            'setJsonVariable': require('./set/setJsonVariable'),
            'setVariable': require('./set/setVariable'),

            // support
            'getTransactionFee': require('./support/getTransactionFee'),

            // wait
            'sleep': require('./wait/sleep'),
            'waitForElementAttribute': require('./wait/waitForElementAttribute'),
            'waitForElementAttributeNotExist': require('./wait/waitForElementAttributeNotExist'),
            'waitForElementExist': require('./wait/waitForElementExist'),
            'waitForElementNotExist': require('./wait/waitForElementNotExist'),
            'waitForTextContain': require('./wait/waitForTextContain'),
            'waitForTextExist': require('./wait/waitForTextExist'),
            'waitForTextNotExist': require('./wait/waitForTextNotExist'),
        };
        this.action = actionMap[step.action]
        if(typeof this.action === 'undefined'){
            err = errorMsg.noSupportedAction.message;
            err = err.replace("${action}",step.action);
            return reject(err);
        }
        this.action(client,step).then(
            (result)=>{
                return resolve(result);
            }).catch((err)=>{
                return reject(err);
            });
    });
}

function run(client, step) {
    return getAction(client, step);
}

module.exports = {
    getAction: getAction,
    run: run 
}