const run = require('../Libs/run.js');
var testData = require('../Libs/testData.js');
var config = require('../Config/Config.json');
var Test_dataSet = require('../TestCase/version_2/Test_dataSet.json');
var cleanUp = require('../Libs/cleanUp.js');
var testCaseTime = config.timeOut.testCaseTime; 

describe('SmokeTest_dataSet',async function () {
    var data;
    var testSuite = this.title;
    this.timeout(testCaseTime);

    // it("testcase_01",async function(){
    // data = await testData.getTestData("dataSet.xlsx", "Sheet2");
    // data.forEach(async function(file) {
    //         describe("testcase_01_dataSet",function() {
    //             this.timeout(testCaseTime);

    //             it("testcase_01_dataSet",async function(done){
    //                 try{
    //                     await run.startWithFile(Test_dataSet, file);
    //                     done();
    //                 }catch(err){
    //                     done(new Error(err));
    //                 }
    //             })

    //             afterEach(async function(done){
    //                 try{
    //                     await cleanUp.clearAllData(testSuite, this.currentTest.state, this.currentTest.title);
    //                     done();
    //                 }catch(err){
    //                     done(new Error(err));
    //                 }
    //              });
    //         })
    //     })
    // })
    
    //final close app
    afterEach(async function(done){
        try{
            await cleanUp.clearAllData(testSuite, this.currentTest.state, this.currentTest.title);
            done();
        }catch(err){
            done(new Error(err));
        }
    });
});
