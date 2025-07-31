const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/User')
const validateUser = require('../utils/validateUser');
const redisClient = require('../config/redisDB');
const Submission = require('../Model/Submissions');

async function register(req,res){
    try{
        validateUser(req.body);
        const {firstName , email , password} = req.body;

        req.body.password = await bcrypt.hash(password , 10);
        req.body.role = "user";

        const user = await User.create(req.body)
        const token = jwt.sign({id : user._id , email:email , role:'user'},process.env.JWT_KEY, {expiresIn:60*60});
        res.cookie('token',token,{maxAge : 60*60*1000});

        const reply = {
            firstName : user.firstName,
            email:user.email,
            _id : user._id,
        }

        res.status(200).json({
            user : reply,
            message : "User Registered successfully"
        });
    }catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }
}

async function login (req,res){
    try{
        const {email , password } = req.body;
        if(!email)
            throw new Error('Enter the email');
        if(!password)
            throw new Error('Enter the password');

        const user = await User.findOne({email:email});
        if(!user)
            throw new Error('Invalid Credentials');

        const check = await bcrypt.compare(password , user.password);
        if(!check)
            throw new Error('Invalid Credentials');

        const token = jwt.sign({id : user._id , email:email , role:user.role  },process.env.JWT_KEY, {expiresIn:60*60});
        res.cookie('token',token,{maxAge : 60*60*1000});

        const reply = {
            firstName : user.firstName,
            email:user.email,
            _id : user._id
        }

        res.status(200).json({
            user : reply,
            message : "User Logged In successfully"
        });
    }catch(err){
        res.status(400).send(`Error : ${err.message}`)
    }
    
}

async function logout (req,res){
    try{
        //Add token in Redis
        const token = req.cookies.token;

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,"Blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp)

        //clear the token
        res.cookie('token',null,{expires : new Date(Date.now())});
        res.send('Logged out successfully');
    }catch(err){
        res.send(`Error : ${err.message}`);
    }
    
}

async function adminRegister(req,res) {
    try{
        validateUser(req.body);
        const {firstName , email , password} = req.body;

        req.body.password = await bcrypt.hash(password , 10);
        req.body.role = "admin";

        const user = await User.create(req.body)
        const token = jwt.sign({id : user._id , email:email , role:'admin'},process.env.JWT_KEY, {expiresIn:60*60});
        res.cookie('token',token,{maxAge : 60*60*1000});

        res.status(200).send('User Registered Successfully');
    }catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }
}

async function deleteUser(req,res){
    try{
        const userId = req.user._id;

        await User.findByIdAndDelete(userId);

        await Submission.deleteMany({userId})
    }catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }
}

async function checkAuth(req,res) {
    try{
        const user = req.user;

        const reply = {
            firstName : user.firstName,
            email:user.email,
            _id : user._id
        }

        res.status(200).json({
            user : reply,
            message : "User Logged In successfully"
        });
    }catch(err){
        res.status(400).send(`Error : ${err.message}`);
    }   
}


module.exports = {register , login , logout , adminRegister , deleteUser , checkAuth}