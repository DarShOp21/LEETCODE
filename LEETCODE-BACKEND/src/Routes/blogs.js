const express = require('express');
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const { getAllBlogs, createBlog } = require('../controllers/blogsController');

const blogRouter = express.Router();

blogRouter.get('/getAllBlogs' , userMiddleware, getAllBlogs );
blogRouter.post('/addBlogs' , adminMiddleware, createBlog);

module.exports = blogRouter;