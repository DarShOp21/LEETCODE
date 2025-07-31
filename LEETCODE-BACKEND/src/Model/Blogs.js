const mongoose = require('mongoose');

const {Schema} = mongoose;

const blogsSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

const Blog = mongoose.model('blog',blogsSchema);

module.exports = Blog