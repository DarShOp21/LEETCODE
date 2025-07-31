import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {logoutUser} from '../authSlice'
import NavBar from '../components/NavBar'
import axiosClient from '../utils/axiosClient'
import { CardSpotlight } from '../components/ui/card-spotlight'
import ProblemCard from '../components/ProblemCard'
import { Link } from 'react-router'

const HomePage = () => {

  const {user} = useSelector(state => state.auth)
  const [allProblems , setAllProblems ] = useState([]);
  const [solvedProblems , setSolvedProblems] = useState([]);
  const dispatch = useDispatch();

  console.log(user);
  
  const [typeOfProblems, setTypeOfProblems] = useState('All Problems')
  const [difficulty, setDifficulty] = useState('All Difficulties')
  const [tag, setTag] = useState('All Tags')

  useEffect(()=>{
    const fetchProblems = async()=>{
      try{
        const {data} = await axiosClient.get('/problem/allProblems')
        setAllProblems(data);
        console.log(`allProblems : ${allProblems.length}`)
      }catch(err){
        console.error(`Error fetching problems : ${err}`)
      }
    }
    
    const fetchSolvedProblems = async ()=>{
      try{
        const {data} = await axiosClient.get('/problem/solvedProblems')
        setSolvedProblems(data);  
        console.log(`Solved Problems : ${solvedProblems}`)
      }catch(err){
        console.error(`Error fetching solved problems : ${err}`)
      }
    }
    
    fetchProblems();
    if(user)
      fetchSolvedProblems();
  },[user])

  const handleLogout = ()=>{
    dispatch(logoutUser());
    setSolvedProblems([]);
  }
  
  const filteredProblems = allProblems.filter((problem)=>{
    const difficultyMatch = difficulty === "All Difficulties" || problem.difficulty.toLowerCase() === difficulty.toLowerCase();
    const tagMatch = tag === "All Tags" || problem.tags === tag.toLowerCase();
    const statusMatch = typeOfProblems === "All Problems" || (typeOfProblems === "Solved Problems" && solvedProblems.some(sp => sp._id === problem._id));
    
    return tagMatch&&difficultyMatch&&statusMatch;
  })

  return(
    <div>
      <NavBar/>
      <div className='mt-36 px-40'>
        <CardSpotlight>
          <p className="text-xl font-bold relative z-20 mt-2 text-white">
            Problems
          </p>
          <hr className='border-gray-300 mt-2 mb-6'/>

          <div className='text-white flex items-center justify-between w-1/3'>
            <select className='bg-gray-100/20 p-2 rounded-md' value={typeOfProblems}
              onChange={(e)=>{setTypeOfProblems(e.target.value)}}
            >
              <option>All Problems</option>
              <option>Solved Problems</option>
            </select>

            <select className='bg-gray-100/20 p-2 rounded-md' value={tag}
              onChange={(e)=>{setTag(e.target.value)}}
            >
              <option>All Tags</option>
              <option>Array</option>
              <option>String</option>
              <option>LinkedList</option>
              <option>Graph</option>
              <option>db</option>
            </select>

            <select className='bg-gray-100/20 p-2 rounded-md' value={difficulty}
              onChange={(e)=>{setDifficulty(e.target.value)}}
            >
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

          </div>
          {
            filteredProblems.map((problem)=>{
              return(
                  <div  key={problem._id} className='z-20'>
                      <Link to={`/problem/${problem._id}`}>
                        <ProblemCard data={problem}/>
                      </Link>
                  </div>
              )
            })
          }
        </CardSpotlight>
      </div>
      
    </div>
  )
}

export default HomePage