import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import axiosClient from '../utils/axiosClient'
import { ExpandableCard } from '../components/ExpandableCard';

const Blogs = () => {
    const [blogs , setBlogs ] = useState([]);
    useEffect(()=>{
        async function getBlogs(){
            try {
                const response = await axiosClient.get('blog/getAllBlogs');
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        }
        getBlogs()
    },[])
    console.log(blogs)
  return (
    <div>
        <NavBar/>
        {/* <div className='mt-36 px-40 flex gap-x-4 gap-y-6 flex-wrap '>
            {
                blogs.map((blog)=>{
                    return <div className='h-110 w-190 bg-amber-300 px-4 py-4 rounded-3xl relative '>
                    <img className='w-full object-cover h-60 ' src={blog?.imageUrl} alt="" />
                    <h2 className='font-semibold text-xl'>{blog?.title}</h2>
                    <p className=''>{blog?.description}</p>
                    <p className='font-serif absolute right-4'>-Darshan Ayare</p>
                </div>
                })
            }
        </div> */}
        <div className='mt-36 px-40 flex gap-x-4 gap-y-6 flex-wrap '>
            <ExpandableCard/>
        </div>
        
    </div>
  )
}

export default Blogs