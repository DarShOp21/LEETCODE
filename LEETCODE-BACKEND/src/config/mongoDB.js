const mongoose = require('mongoose')

async function connectMongoDB(){
    await mongoose.connect(process.env.DB_CONNECTION);
}

module.exports = connectMongoDB;