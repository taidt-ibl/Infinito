var Excel = require('exceljs');
var fs = require('fs');
var errorMsg = require('../Config/ErrorMsg.json');
var result = [];

function getTestData(fileName, sheetName){
    return new Promise((resolve, reject) => {
        var workbook = new Excel.Workbook();
        var testDataLocation = __dirname + '/../TestData/';
        var testData = testDataLocation + fileName;
        var arrProperty = [];
        var err;
        if(!fs.existsSync(testData)){
            err = errorMsg.undefinedFile.message.replace("${file}", fileName);
            return reject(err);
        }
        
        workbook.xlsx.readFile(testData).then(function() {
            var sheet = workbook.getWorksheet(sheetName);
            if(typeof sheet === 'undefined'){
                err = errorMsg.undefinedFileSheet.message.replace("${sheet}", sheetName);
                err = err.replace("${file}", fileName);
                return reject(err);
            }

            sheet.eachRow({ includeEmpty: false}, function(row, rowNumber) {
                var values = row.values;

                if(rowNumber == 1){
                    for(var i = 0; i < values.length; i++){
                        arrProperty.push(values[i])
                    }
                }else{
                    var obj = {};
                    for(var u = 0; u < values.length; u++){
                        obj[arrProperty[u]] = values[u];
                    }
                    result.push(obj);
                }
            });
            resolve(result);  
        })
    })
}

module.exports = {
    getTestData: getTestData
}