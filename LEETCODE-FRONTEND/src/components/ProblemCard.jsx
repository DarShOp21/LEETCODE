import React from 'react'

const ProblemCard = ({data}) => {

    const difficultyColor = {
        easy: "text-green-500 font-bold bg-green-900/20 px-2 py-1 rounded",
        medium: "text-yellow-500 font-bold bg-yellow-900/20 px-2 py-1 rounded",
        hard: "text-red-500 font-bold bg-red-900/20 px-2 py-1 rounded",
      };

  return (
    <div className='text-white bg-gray-400/20 my-5 p-5 flex items-center justify-between'>
        <div>
            <h3 className='text-xl font-bold'>{data.title}</h3>
            <p className='text-sm pt-1'>{data.description}</p>
            
        </div>
        <p className='mt-2 bg-blue-500 w-fit py-1 px-2 rounded-md'>{data.tags}</p>
        <p className={difficultyColor[data.difficulty.toLowerCase()]}>{data.difficulty}</p>
    </div>
  )
}

export default ProblemCard