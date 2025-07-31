"use client";
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem, SignOutLink } from "./ui/navBarTemplate";
import { cn } from "../lib/utils";
import { useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";


export default function NavBar({
  className
}) {
  const [active, setActive] = useState(null);
  const [blogs , setBlogs] = useState([]);
  // let blogs = [];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = ()=>{
        dispatch(logoutUser());
        navigate('/');
    }   

    useEffect(()=>{
      async function getBlogs() {
        const response = await axiosClient.get('./blog/getAllBlogs');
        // console.log(response);
        // blogs = response.data;
        setBlogs(response.data);
        // console.log(blogs);
      }
      getBlogs();
    },[])

    useEffect(() => {
      console.log('Blogs updated:', blogs);
    }, [blogs]);
  return (
    <div
      className={cn("fixed top-6 inset-x-0 max-w-3xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <div className="w-full flex items-center justify-between">
            <Link to={'/'} className="text-white">Home</Link>
            <MenuItem href={'/'} setActive={setActive} active={active} item="Problems">
            <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/web-dev">Array</HoveredLink>
                <HoveredLink href="/interface-design">Link List</HoveredLink>
                <HoveredLink href="/seo">Map</HoveredLink>
            </div>
            </MenuItem>
            <Link to={'/blogs'}>
            <MenuItem setActive={setActive} active={active} item="Blogs">
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">

              {
                blogs.map((blog)=>(
                  <ProductItem
                    key={blog._id}
                    title={blog.title}
                    src={blog.imageUrl}
                    description={`${blog.description.trim().slice(0,200)}...`}
                  />
                ))
              }
                
                {/* <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before." />
                
                <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project" />
                
                <ProductItem
                title="Moonbeam"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes." />
                
                <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI" /> */}
            </div>
            </MenuItem>
            </Link>
            
            <MenuItem setActive={setActive} active={active} item="Profile">
            <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/hobby">Submissions</HoveredLink>
                <HoveredLink href="/"><Link to={'/stats'}>Stats</Link></HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <SignOutLink onClick={handleSignOut}>SignOut</SignOutLink>
            </div>
            </MenuItem>
        </div>
        
      </Menu>
    </div>
  );
}
