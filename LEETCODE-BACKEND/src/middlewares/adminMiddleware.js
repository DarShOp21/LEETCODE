const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const redisClient = require('../config/redisDB');


const adminMiddleware = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token not found");

        const payload = jwt.verify(token , process.env.JWT_KEY);

        const {id , role} = payload;

        if(!id)
            throw new Error("ID is missing");

        if(role!='admin')
            throw new Error("Invalid user");

        const user = await User.findById(id);

        if(!user)
            throw new Error("User not found");

        const isBlocked = await redisClient.exists(`token :  ${token}`);
        if(isBlocked)
            throw new Error("Invalid Token")

        req.user = user;

        next()
    }catch(err){
        res.send(`Error : ${err.message}`)
    }
}

module.exports = adminMiddleware