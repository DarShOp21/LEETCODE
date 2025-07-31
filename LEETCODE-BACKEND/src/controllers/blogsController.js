const cloudinary = require('cloudinary').v2;
const express = require('express');
const Blog = require('../Model/Blogs')

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

async function getAllBlogs (req,res){
    try{
        const blogs = await Blog.find({});

        if(!blogs || blogs.length == 0)
            res.status(400).send("Blogs not found")

        res.status(200).send(blogs);
    }catch(err){
        res.status(500).send(`Error occured : ${err}`)
    }
}

async function createBlog(req,res) {
    const {title , imageUrl , description} = req.body;
    try{
        const isAllowed = ['title','imageUrl','description'].every((field)=>Object.keys(req.body).includes(field))
        
        if(!isAllowed)
            throw new Error('Some Fields are missing');

        const blog = req.body;
        await Blog.create(blog)
        res.status(200).send(blog);
    }catch(err){
        res.status(500).send(`Error Occured : ${err}`)
    }
}


module.exports = {getAllBlogs , createBlog}



