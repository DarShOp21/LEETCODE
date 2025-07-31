const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required : true
    },

    description:{
        type:String,
        required:true
    },

    difficulty:{
        type:String,
        enum:['easy','medium','difficult'],
        required:true
    },

    tags:{
        type:String,
        enum:['array','linkedList','graph','db','string'],
        required:true
    },

    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            }
        }
    ],

    startCode:[{
        language:{
            type:String,
            required:true
        },
        initialCode :{
            type:String,
            required:true
        }
    }],

    problemCreator :{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },

    solution :[
        {
            language:{
                type:String,
                required:true
            },
            code :{
                type:String,
                required:true
            },
            explanation:{
                type:String
            }
        }
    ]
})

const Problem = mongoose.model('problem',problemSchema);

module.exports = Problem