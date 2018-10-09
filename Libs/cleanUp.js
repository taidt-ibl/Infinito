var deviceManager = require('../Libs/deviceManager.js');
var image = require('../Libs/image.js');
var variableManager = require('../Libs/variableManager.js');

async function clearAllData(testSuite, testState, testTitle){
        var curDevice = deviceManager.getCurrentDevice();
        if(testState == "failed"){
            await image.captureImage(curDevice, testSuite, testTitle);
        }

        if(curDevice != null){
            await curDevice.quit(function(){   
                deviceManager.clearDevice();
            })
        }
                
        variableManager.clearVariables();
}

module.exports = {
    clearAllData: clearAllData
}
