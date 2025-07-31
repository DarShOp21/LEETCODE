// import React, { useEffect, useState } from 'react'
// import NavBar from '../components/NavBar'
// import { useSelector } from 'react-redux'
// import axiosClient from '../utils/axiosClient'

// const Stats = () => {
//     const { user } = useSelector(state => state.auth)
//     const [submittedProb, setSubmittedProb] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)

//     // Fetch data only once on component mount
//     useEffect(() => {
//         async function getSubmitted() {
//             try {
//                 const response = await axiosClient.get('/problem/solvedProblems')
//                 setSubmittedProb(response.data)
//                 console.log("Initial data load:", response.data)
//             } catch (error) {
//                 console.error("Error fetching solved problems:", error)
//                 setError(error.message)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         getSubmitted()
//     }, []) // Empty dependency array ensures this runs only once

//     // Calculate difficulty counts
//     const countAsPerDiff = submittedProb.reduce((counts, prob) => {
//         if (prob.difficulty === 'easy') counts[0]++
//         else if (prob.difficulty === 'medium') counts[1]++
//         else counts[2]++
//         return counts
//     }, [0, 0, 0])

//     if (loading) return <div>Loading...</div>
//     if (error) return <div>Error: {error}</div>

//     return (
//         <div>
//             <NavBar/>
//             <div className='mt-36 mx-40 px-10 py-10 rounded-md bg-black h-200 text-white '>
//                 <div className='flex items-center gap-3'>
//                     <img className='w-9 rounded-2xl' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aLqEc2p9VE8uceFiKHFwYuLF-BRAwSXIbQ&s" alt="" />
//                     <div>
//                         <h1 className='font-semibold'>{user.firstName}</h1>
//                         <h3 className='text-xs text-amber-100 -mt-1.5'>{user.email}</h3>
//                     </div>
//                 </div>
//                 <div className='flex h-[680px] overflow-hidden mt-5'>
//                     <div className='w-[60%] h-full border-1 rounded-2xl py-2 px-3 '>
//                         <h1>Number of Problems Solved: {submittedProb.length}</h1>
//                         <div className='mt-0.5 text-sm text-gray-300'>
//                             <p>No of Easy Questions: {countAsPerDiff[0]}</p>
//                             <div className="w-[80%] bg-gray-200 h-4">
//                                 <div 
//                                     className="bg-green-500 h-4 transition-all duration-500" 
//                                     style={{ width: `${(countAsPerDiff[0]/10)*100}%` }}
//                                 ></div>
//                             </div>
//                             <p>No of Medium Questions: {countAsPerDiff[1]}</p>
//                             <div className="w-[80%] bg-gray-200 h-4">
//                                 <div 
//                                     className="bg-green-500 h-4 transition-all duration-500" 
//                                     style={{ width: `${(countAsPerDiff[1]/10)*100}%` }}
//                                 ></div>
//                             </div>
//                             <p>No of Hard Questions: {countAsPerDiff[2]}</p>
//                             <div className="w-[80%] bg-gray-200 h-4">
//                                 <div 
//                                     className="bg-green-500 h-4 transition-all duration-500" 
//                                     style={{ width: `${(countAsPerDiff[2]/10)*100}%` }}
//                                 ></div>
//                             </div>
//                         </div>

//                         <div>
//                             <h2 className='mt-60'>Previous Solved Problems</h2>
//                             {submittedProb.slice(0, 5).map((prob) => (
//                                 <p key={prob._id}>{prob.title}</p>
//                             ))}
//                         </div>
//                     </div>
//                     <div className='h-full w-[40%] bg-amber-200'></div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Stats



// File: StatsDashboard.jsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Flame, Code, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useSelector } from 'react-redux';

export default function StatsDashboard() {

  const User = useSelector(state => state.auth.User)

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Redux user:", User);

    async function getStats() {
      if (!User?._id) return;
  
      try {
        const response = await axiosClient.get(`/stats/${User._id}`);
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    }
  
    getStats();
  }, [User]);
  

  if (loading) {
    return <div className="p-6 text-center">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="p-6 text-center text-red-500">Failed to load stats</div>;
  }

  const {
    user,
    languageUsage,
    weeklyTrends,
    averagePerformance,
  } = stats;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Profile Summary */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardContent className="flex items-center gap-4 p-6">
          <img src={`https://ui-avatars.com/api/?name=${user.name}`} alt="avatar" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">Solved: {user.totalSolved}</p>
          </div>
        </CardContent>
      </Card>

      {/* Solved by Difficulty */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Solved by Difficulty
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm">Easy: {user.difficultyStats.easy}</p>
              <Progress value={user.difficultyStats.easy} />
            </div>
            <div>
              <p className="text-sm">Medium: {user.difficultyStats.medium}</p>
              <Progress value={user.difficultyStats.medium} />
            </div>
            <div>
              <p className="text-sm">Hard: {user.difficultyStats.difficult}</p>
              <Progress value={user.difficultyStats.difficult} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Submissions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTrends}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Language Usage */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5 text-green-600" /> Language Usage
          </h3>
          {languageUsage.map((lang) => (
            <div key={lang._id}>
              <p className="text-sm">{lang._id}: {lang.count}</p>
              <Progress value={lang.count} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Performance</h3>
          <p className="text-sm">Avg Runtime: {Math.round(averagePerformance.avgRuntime)} ms</p>
          <p className="text-sm">Avg Memory: {Math.round(averagePerformance.avgMemory)} KB</p>
        </CardContent>
      </Card>
    </div>
  );
}
