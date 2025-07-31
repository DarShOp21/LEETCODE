"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./hooks/useOutsideClick";
import axiosClient from "../utils/axiosClient";

export function ExpandableCard() {
  const [activeBlog, setActiveBlog] = useState(null);
  const id = useId();
  const ref = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActiveBlog(null);
      }
    }

    if (activeBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeBlog]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axiosClient.get('/blog/getAllBlogs');
        setBlogs(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogs();
  }, []);

  useOutsideClick(ref, () => setActiveBlog(null));

  if (loading) return <div className="text-center py-8">Loading blogs...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!blogs.length) return <div className="text-center py-8">No blogs found</div>;

  return (
    <>
      <AnimatePresence>
        {activeBlog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
            
            <div className="fixed inset-0 grid place-items-center z-[100]">
              <motion.button
                key={`close-button-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex absolute top-4 right-4 items-center justify-center bg-white rounded-full h-8 w-8 shadow-lg"
                onClick={() => setActiveBlog(null)}
              >
                <CloseIcon />
              </motion.button>

              <motion.div
                layoutId={`blog-${activeBlog._id}`}
                ref={ref}
                className="w-full max-w-3xl h-full md:h-[90vh] flex flex-col bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-xl"
              >
                <motion.div layoutId={`image-${activeBlog._id}`} className="relative h-64 md:h-80">
                  <img
                    src={activeBlog.imageUrl}
                    alt={activeBlog.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="p-6 overflow-y-auto flex-1">
                  <motion.h2
                    layoutId={`title-${activeBlog._id}`}
                    className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
                  >
                    {activeBlog.title}
                  </motion.h2>
                  
                  <motion.div

                    layoutId={`content-${activeBlog._id}`}
                    className="prose dark:prose-invert max-w-none text-white"
                    dangerouslySetInnerHTML={{ __html: activeBlog.description }}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              layoutId={`blog-${blog._id}`}
              key={blog._id}
              onClick={() => setActiveBlog(blog)}
              className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <motion.div layoutId={`image-${blog._id}`} className="h-48">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="p-4">
                <motion.h3
                  layoutId={`title-${blog._id}`}
                  className="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
                >
                  {blog.title}
                </motion.h3>
                
                <motion.p
                  layoutId={`excerpt-${blog._id}`}
                  className="text-gray-600 dark:text-white line-clamp-3"
                >
                  {blog.description.substring(0, 150)}...
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);