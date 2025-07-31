const axios = require('axios');

function validateProblem(data){
    const mandatoryFields = ['title','description','difficulty','tags','visibleTestCases','hiddenTestCases','startCode','solution'];

    const isAllowed = mandatoryFields.every((field)=> Object.keys(data).includes(field));

    if(!isAllowed)
        throw new Error('Some Fields are missing');

    const visibleTestCasesReq = ['input','output','explanation'];
    const visibleTestCasesAllowed = data.visibleTestCases.every((testCase)=>{ 
        return visibleTestCasesReq.every((field)=>Object.keys(testCase).includes(field));
    })
    if(!visibleTestCasesAllowed)
        throw new Error('Some Fields are missing in the visible test cases');

    const hiddenTestCasesReq = ['input','output'];
    const hiddenTestCasesAllowed = data.hiddenTestCases.every((testCase)=>{
        return hiddenTestCasesReq.every((field)=>Object.keys(testCase).includes(field));
    })
    if(!hiddenTestCasesAllowed)
        throw new Error('Some Fields are missing in the hidden test cases')

    const startCodeReq = ['language','initialCode']
    const startCodeAllowed = startCodeReq.every((field)=>Object.keys(data.startCode).includes(field))
    if(!startCodeAllowed)
        throw new Error('Some Fields are missing in the Initial code snippet')

    const solutionReq = ['language','code']
    const solutionAllowed = data.solution.every((set)=>{
        return solutionReq.every((field)=>Object.keys(set).includes(field));
    })
    if(!solutionAllowed)
        throw new Error('Solution is not present')
}

function getLanguageId(lang){
    const language = {
        'c' : 50,
        'c++':  54,
        'java': 62,
        'javascript': 63
    };

    return language[lang.toLowerCase()];
}

async function submitBatch(submissions){ 

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false',
            wait: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_API,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {submissions}
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(`Error : ${error}`);
        }
    }

    return await fetchData();
}

async function submitToken(resultToken){

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens: resultToken,
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': process.env.JUDGE0_API,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    while(true){
        const result = await fetchData();

        const obtainedResult = result.submissions.every((value) => value.status_id > 2)
        if(obtainedResult){
            return result.submissions;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    }

module.exports = {validateProblem , getLanguageId , submitBatch , submitToken}