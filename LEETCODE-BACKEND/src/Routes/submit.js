const express = require('express');
const userMiddleware = require('../middlewares/userMiddleware');
const { submitProblem, runProblem } = require('../controllers/userSubmission');
const submitRouter = express.Router();

submitRouter.post('/run/:id',userMiddleware , runProblem);

submitRouter.post('/:id',userMiddleware , submitProblem);

module.exports = submitRouter;