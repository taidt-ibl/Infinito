
var listDevices = [];
var currentDevice = null;

function addDevice(device) {
    listDevices.push(device);
}

function getCurrentDevice() {
    if( currentDevice == null && listDevices.length > 0) {
        currentDevice = listDevices[0];
    }
    return currentDevice;
}

function changeDevice(indexDevice) {
    currentDevice = listDevices[indexDevice]
}

function clearDevice(){
    currentDevice = null;
    listDevices = [];
}

function correctXpath(oldXPath) {
    return oldXPath;
}

module.exports = {
    addDevice: addDevice,
    getCurrentDevice: getCurrentDevice,
    changeDevice: changeDevice,
    clearDevice: clearDevice,
    correctXpath: correctXpath,
}