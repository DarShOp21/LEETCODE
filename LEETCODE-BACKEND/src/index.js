const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')

const connectMongoDB = require('./config/mongoDB');
const redisClient = require('./config/redisDB');
const cookieParser = require('cookie-parser');

const userAuth = require('./Routes/userAuth');
const problemRouter = require('./Routes/problemCreator');
const submitRouter = require('./Routes/submit');
const aiRouter = require('./Routes/gpt');
const blogRouter = require('./Routes/blogs');
const statsRouter = require('./Routes/statsRouter')

app.use(cors({
    origin:"http://localhost:5173",
    allowedHeaders: ['Content-Type'],
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/auth',userAuth);
app.use('/problem',problemRouter);
app.use('/submit',submitRouter);
app.use('/ai', aiRouter)
app.use('/blog', blogRouter)
app.use('/stats',statsRouter)

async function main(){
    try{
        await Promise.all([connectMongoDB() , redisClient.connect()]);
        console.log("DB CONNECTED");

        app.listen(process.env.PORT , ()=>{
            console.log(`Listening at port http://localhost:${process.env.PORT}`)
        })
    }catch(err){
        console.log(`ERROR : ${err.message}`)
    }
}

main();