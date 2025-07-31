const express = require('express');
const { register, login, logout, adminRegister, deleteUser, checkAuth } = require('../controllers/userAuthent');
const userMiddleware = require('../middlewares/userMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userAuth = express.Router();

userAuth.post('/register',register)
userAuth.post('/login',login)
userAuth.post('/logout',userMiddleware,logout)
userAuth.post('/admin/register',adminMiddleware , adminRegister)
userAuth.delete('/delete',userMiddleware , deleteUser)
userAuth.post('/check',userMiddleware, checkAuth)


module.exports = userAuth