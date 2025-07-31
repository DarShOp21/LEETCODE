const express = require('express');
const userMiddleware = require('../middlewares/userMiddleware');
const {giveResponse  , getAudio}= require('../controllers/aiController');

const aiRouter = express.Router();

aiRouter.post('/chat',userMiddleware , giveResponse)

aiRouter.post('/textToAudio', userMiddleware , getAudio)

module.exports = aiRouter;