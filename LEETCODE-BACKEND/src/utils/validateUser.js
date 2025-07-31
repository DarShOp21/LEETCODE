const validator = require('validator')
const isEmail = require('validator');

function validateUser(data){
    const mandatoryFields = ['firstName','email','password'];
    const isAllowed = mandatoryFields.every((field)=>Object.keys(data).includes(field));

    if(!isAllowed)
        throw new Error('Missing fields');

    if(!validator.isEmail(data.email))
        throw new Error('Invalid Email');

    if(!validator.isStrongPassword(data.password))
        throw new Error('Weak Password');
} 

module.exports = validateUser;