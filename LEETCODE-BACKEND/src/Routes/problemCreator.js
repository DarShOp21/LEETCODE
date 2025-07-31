const express = require('express');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddleware')
const {createProblem, updateProblem, deleteProblem, getProblem, getAllProblems, getSolvedProblems, submittedProblem} = require('../controllers/problemController');

const problemRouter = express.Router();

// admin
problemRouter.post('/create', adminMiddleware, createProblem);
problemRouter.put('/update/:id', adminMiddleware ,updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware , deleteProblem);

//user
problemRouter.get('/allProblems' , userMiddleware , getAllProblems);
problemRouter.get('/solvedProblems', userMiddleware , getSolvedProblems);
problemRouter.get('/submittedProblem/:pid', userMiddleware , submittedProblem)
problemRouter.get('/:id' , userMiddleware , getProblem); 



module.exports = problemRouter