const Problem = require("../Model/Problem");
const Submission = require("../Model/Submissions");
const { getLanguageId, submitBatch, submitToken } = require("../utils/problemUtility");

const submitProblem = async (req,res)=>{
    try{
        const userId = req.user._id;
        const problemId = req.params.id;

        const {code , language} = req.body;

        if(!userId || !problemId || !code || !language)
            return res.status(400).send("Some fields are missing");

        const problem = await Problem.findById(problemId);

        if(!problem)
            return res.status(400).send("Invalid problem id");

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code ,
            language,
            testCasesPassed:0,
            status : "pending",
            testCasesTotal:problem.hiddenTestCases.length
        })

        const languageId = getLanguageId(language);

        const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code : code,
            language_id : languageId,
            stdin : testcase.input,
            expected_output : testcase.output
        }))

        const submitResult = await submitBatch(submissions);
        const resultToken =  submitResult.map((value)=>value.token).join(',');
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for(const test of testResult){
            if(test.status_id === 3){
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory , test.memory);
            }else{
                if(test.status_id = 4){
                    status = "error";
                    errorMessage = test.stderr;
                }else{
                    status = "wrong";
                    errorMessage = test.stderr;
                }
            }
        }

        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        submittedResult.errorMessage = errorMessage;

        await submittedResult.save();

        if(status === "accepted"){
            if(!req.user.problemSolved.includes(problemId)){
                req.user.problemSolved.push(problemId);
                await req.user.save()
            }
        }
            

        res.status(200).send(submittedResult);

    }catch(err){
        res.send(`Error : ${err.message}`);
    }
}

const runProblem = async (req,res)=>{
    try{
        const userId = req.user._id;   //
        const problemId = req.params.id;

        const {code , language} = req.body;

        if(!userId || !problemId || !code || !language)
            return res.status(400).send("Some fields are missing");

        const problem = await Problem.findById(problemId);

        if(!problem)
            return res.status(400).send("Invalid problem id");

        const languageId = getLanguageId(language);

        const submissions = problem.visibleTestCases.map((testcase)=>({
            source_code : code,
            language_id : languageId,
            stdin : testcase.input,
            expected_output : testcase.output
        }))

        const submitResult = await submitBatch(submissions);
        const resultToken =  submitResult.map((value)=>value.token).join(',');
        const testResult = await submitToken(resultToken);

        res.status(200).send(testResult);
    }catch(err){
        res.send(`Error : ${err.message}`);
    }
}

module.exports = {submitProblem , runProblem}
