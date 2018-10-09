var mkdirp = require('mkdirp');
var fs = require('fs');
var screenShotLocation = "../ScreenShot/";

function captureImage(client, testSuite, testCase){
    return new Promise((resolve, reject) => {
        var path = screenShotLocation + testSuite;

        if(!fs.existsSync(path)){
            mkdirp(path, function(err) { 
                if(err){
                    return reject(err);
                }
            })
        }

        var date = new Date();
        var combineString = "_";
        var day = date.getDate();
        var year = date.getFullYear();
        var hour = date.getHours();
        var min = date.getMinutes();
        var second = date.getSeconds();
        var locale = "en-us";
        var month = date.toLocaleString(locale, {month: "long"});

        var now = month + combineString + day + combineString + year
        + combineString + hour + combineString + min + combineString + second;
        var imgPath = path + "/" + testCase + combineString + now + ".png";

        if(client != null){
            client.saveScreenshot(imgPath,function(err, filePath){
                console.log('Screen shoot will be saved in ', imgPath);
                if(err){
                    return reject(err);
                }
                resolve();
            }) 
        }else{
            resolve();
        }
    })
}

module.exports = {
    captureImage: captureImage
}