const Problem = require("../Model/Problem");
const Submission = require("../Model/Submissions");
const User = require("../Model/User");
const { validateProblem, getLanguageId, submitBatch, submitToken } = require("../utils/problemUtility");

async function createProblem(req,res){
    validateProblem(req.body);
    const {title , description ,difficulty , tags , visibleTestCases , hiddenTestCases , startCode  , solution } = req.body;
    try{
        
        for(const {language , code} of solution){
            const languageId = getLanguageId(language);
            
            const submissions = visibleTestCases.map((testcase)=>({
                source_code : code,
                language_id : languageId,
                stdin : testcase.input,
                expected_output : testcase.output
            }));
            
            const submitResult = await submitBatch(submissions);
            const resultToken =  submitResult.map((value)=>value.token).join(',');
            const testResult = await submitToken(resultToken);

            console.log(testResult)
            for(const test of testResult){
                if(test.status.id != 3){
                    console.log("Failed test details:", JSON.stringify(test, null, 2));
                    return res.status(400).json({
                        error: "Solution failed test cases",
                        status: test.status.description,
                        stderr: test.stderr,
                        actual_output: test.stdout,
                        expected_output: test.expected_output
                    });
                }
            }
        }

        await Problem.create({...req.body , problemCreator : req.user._id});
        res.send("Problem saved")
    }catch(err){
        res.send(`Error : ${err.message}`);
    }
}

async function updateProblem(req,res){
    validateProblem(req.body);
    const {id} = req.params;
    const {title , description ,difficulty , tags , visibleTestCases , hiddenTestCases , startCode  , solution } = req.body;
    try{
        if(!id)
            return res.send("ID not present")

        if(! await Problem.findById(id))
            return res.send('Problem not found');

        for(const {language , code} of solution){
            const languageId = getLanguageId(language);
            
            const submissions = visibleTestCases.map((testcase)=>({
                source_code : code,
                language_id : languageId,
                stdin : testcase.input,
                expected_output : testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            const resultToken =  submitResult.map((value)=>value.token).join(',');
            const testResult = await submitToken(resultToken);

            console.log(testResult)
            for(const test of testResult){
                if(test.status.id != 3){
                    console.log("Failed test details:", JSON.stringify(test, null, 2));
                    return res.status(400).json({
                        error: "Solution failed test cases",
                        status: test.status.description,
                        stderr: test.stderr,
                        actual_output: test.stdout,
                        expected_output: test.expected_output
                    });
                }
            }
        }

        const updatedProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true , new:true});

        res.status(200).send(updatedProblem);
    }catch(err){
        res.status(500).send(`Error : ${err.message}`);
    }
}

async function deleteProblem(req,res){
    const {id} = req.params;
    try{
        if(!id)
            return res.send("ID not present")

        if(! await Problem.findById(id))
            return res.send('Problem not found');

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem)
            return res.status(404).send('Problem is missing');

        return res.status(200).send('Problem dDeleted , Successfully')
    }catch(err){
        res.status(404).send(`Error : ${err.message}`);
    }
}

async function getProblem(req,res){
    const {id} = req.params;
    try{
        if(!id)
            return res.status(400).send("ID not present");

        const problem = await Problem.findById(id)
            .select('_id title description difficulty tags visibleTestCases');
    
        if(!problem)
            return res.status(400).send("Problem not found");

        res.status(200).send(problem);
    }catch(err){
        res.status(404).send(`Error : ${err.message}`);
    }
}

async function getAllProblems(req,res) {
    try{
        console.log("Fetching problems...");
        const getProblem = await Problem.find({}).select('_id title description difficulty tags');
        console.log("Found problems:", getProblem);

        if(getProblem.length==0)
            return res.status(404).send("Problem is missing");

        res.status(200).send(getProblem)
    }catch(err){
        console.log("Error fetching problems:", err);
        return res.status(404).send(`Error : ${err.message}`)
    }
}

async function getSolvedProblems(req,res){
    try{
        const userId = req.user._id;
        const user = await User
            .findById(userId)
            .populate({
            path:"problemSolved",
            select : "_id title description difficulty tags"
        })
        console.log(`Solved Problems : ${user.problemSolved}`)
        res.status(200).send(user.problemSolved);
    }catch(err){
        return res.status(404).send(`Error : ${err.message}`)
    }
}

async function submittedProblem(req,res){
    try{
        const userId = req.user._id;
        const problemId = req.params.pid;
        const result = await Submission.find({userId , problemId});
        
        if(result.length == 0)
            res.status(200).send("No submissions");

        res.status(200).send(result);
    }catch(err){
        return res.status(404).send(`Error : ${err.message}`)
    }
}

module.exports = {createProblem , updateProblem , deleteProblem , getProblem , getAllProblems , getSolvedProblems , submittedProblem};