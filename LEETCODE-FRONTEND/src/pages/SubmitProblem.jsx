import React, { useEffect, useRef, useState } from 'react'
import axiosClient from '../utils/axiosClient'
import NavBar from '../components/NavBar'
import Editor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useNavigate  , useParams} from 'react-router';
import ChatWithAI from '../components/ChatWithAI';

const SubmitProblem = () => {
    const [code , setCode] = useState('');
    const [showTestCase , setShowTestCase] = useState(true);
    const [language , setLanguage] = useState('javascript')
    const [result , setResult] = useState('Run the code to get the result');
    const [activeTab , setActiveTab] = useState('Description')
    const [chatWithAI , setChatWithAI] = useState(false);

    const {isAuthenticated} = useSelector(state => state.auth);
    const [problem, setProblem] = useState();
    const editorRef = useRef('');
    const {id} = useParams();
    const navigate = useNavigate();


    useEffect(()=>{
        let fetchProblem =  async ()=>{
            try{
                setProblem((await axiosClient.get(`/problem/${id}`)).data);
            }catch(err){
                console.error(`Error fetching problems : ${err}`)
            }
        }
        fetchProblem();
    },[id , navigate])


    console.log(problem);

    let diffCol = {
        easy : 'bg-green-400/40',
        medium : 'bg-yellow-400/40',
        hard : 'bg-red-400/40'
    }

    function getDifficultyClass(difficulty) {
        const lowerCaseDifficulty = difficulty?.toLowerCase();
        return diffCol[lowerCaseDifficulty];
    }

    function handleEditorChange(value, event) {
        setCode(value);
      }

    if(!isAuthenticated)
        navigate('/login')

    async function runCode(){
        try{
            const response = await axiosClient.post(`/submit/run/${id}`,{code:code,language:language});
            setShowTestCase(false)
            console.log(response)
            setResult(response?.data[0].status?.description)
            console.log(result)
        }   
        catch(err){
            console.error(err);
        }
    }

    async function submitCode(){
        try{
            const response = await axiosClient.post(`/submit/${id}`,{code:code,language:language});
            setShowTestCase(false)
            console.log(response)
            setResult(response?.data.status)
            console.log(result)
        }   
        catch(err){
            console.error(err);
        }
    }

  return (
    <div className='text-white w-full h-full px-25'>
        <NavBar/>
        <div className='bg-black rounded-4xl mt-32  min-h-200 flex p-10 gap-4'>
            <div className='w-1/2 relative'>
                <nav className='flex justify-between w-full bg-white/20 text-sm gap-4 py-2 px-2 mb-2 rounded-md'>
                    <div className='w-3/5 flex justify-between'>
                        <button className={`${activeTab === 'Description' ? 'text-white' : 'text-white/50'}`} onClick={()=>{setActiveTab('Description')}}>Description</button>
                        <button className={`${activeTab === 'Editorial' ? 'text-white' : 'text-white/50'}`} onClick={()=>{setActiveTab('Editorial')}}>Editorial</button>
                        <button className={`${activeTab === 'Solutions' ? 'text-white' : 'text-white/50'}`} onClick={()=>{setActiveTab('Solutions')}}>Solutions</button>
                    </div>
                    <button className='text-black p-1 rounded-md bg-amber-300 ' onClick={()=>{setChatWithAI(!chatWithAI)}}>Chat with AI</button>
                </nav>
                <div>
                    <h1 className='font-bold text-2xl text-white'>{problem?.title}</h1>
                    <div className='flex gap-4 mt-4'>
                        <p className='bg-yellow-400/50 rounded-md py-0.5 px-1.5 text-center'>{problem?.tags}</p>
                        <p className={`${getDifficultyClass(problem?.difficulty)} rounded-md py-0.5 px-1.5 text-center`}>{problem?.difficulty}</p>
                    </div>
                    <h2 className='mt-4 text-lg'>The Problem : </h2>
                    <h3 className=' text-sm my-2 p-2 bg-white/20 rounded-md '>{problem?.description}emdjbyw  ui ieib e uruw  yrgru cewrcurhbfu rgyyegfyurfguyrjeh heede gwyuru4h uih uif huehui huifhf eyfiuewh oeg rhe78y3 3247 eewew hriehrewhruiewyr mdjbyw  ui ieib e uruw  yrgru cewrcurhbfu rgyyegfyurfguyrjeh heede gwyuru4h uih uif huehui huifhf eyfiuewh oeg rhe78y3 3247 eewew hriehrewhruiewyr mdjbyw  ui ieib e uruw  yrgru cewrcurhbfu rgyyegfyurfguyrjeh heede gwyuru4h uih uif huehui huifhf eyfiuewh oeg rhe78y3 3247 eewew hriehrewhruiewyr</h3>
                    <hr className='border-1 mt-2 rounded-md'/>
                    <h2 className='mt-4 mb-2 text-lg'>Example : </h2>
                    {
                        problem?.visibleTestCases.map((example , index)=>{
                            return (<div key={index} className='bg-white/20 w-full min-h-20 text-sm p-3 rounded-md space-y-1.5'>
                                <p className='text-purple-500'>Input : <span className='bg-gray-400/50 px-2 text-white'>{example?.input}</span></p>
                                <p className='text-blue-400'>Output : <span className='bg-gray-400/50 text-white px-2'>{example?.output}</span></p>
                                <p className='text-white/80'>{example?.explanation} jeytvte3et3teu3 3eu yudueued eduyeuwyd ewidew diuwehudh ehwduih ewuidh iu ehwduih ewuidh iu ehduiheudyuewgduygeuywg dyuewg dyu gewdgeygduygeyudgjygeqw yqd yuget dyd ydgd yegdy edgyu geayiu d7 yuedet  dedg uudui egdy dyu gayugdugdg egd  wgd agdyageduy agedy gey  dyu</p>
                            </div>)
                        })
                    }
                </div>
                {
                    chatWithAI ? <div className=' absolute top-15 right-0' ><ChatWithAI problem={problem}/></div> : <div></div>
                }
            </div>
            <vr className='border-1'/>
            <div className='w-1/2 mx-4'>
                <div className='flex items-center justify-between'>
                    <select value={language} onChange={(e)=>{setLanguage(e.target.value)}} defaultValue={'js'} className='bg-blue-500 py-1 px-2 rounded-m'>
                        <option value='javascript'>Javascript</option>
                        <option value='java' >Java</option>
                        <option value='c++'>C++</option>
                    </select>
                    <div className='flex items-center justify-between gap-10'>
                        <button onClick={()=>{runCode()}} className='bg-yellow-300 text-black py-1 px-2 rounded-md w-23'>Test Run</button>
                        <button onClick={()=>{submitCode()}} className='bg-emerald-400 py-1 px-2 rounded-md w-23'>Submit</button>
                    </div>
                </div>
                <div  className='h-100 mt-6' >
                    {console.log(language)}
                    <Editor ref={editorRef}
                        language={language.toLowerCase() == 'c++' ? 'cpp' : language.toLowerCase()}
                        onChange={handleEditorChange}
                        theme="vs-dark"
                        defaultValue={'//Enter the code'}/>
                </div>
                <div className='flex items-center justify-center my-4 gap-1'>
                    <button onClick={()=>{setShowTestCase(true)}}  className='w-1/2 bg-amber-200 rounded-md py-1'>Test Cases</button>
                    <button onClick={()=>{setShowTestCase(false)}} className='w-1/2 bg-amber-800 rounded-md py-1'>Result</button>
                </div>
                {
                    showTestCase ? (
                        <div>
                        {
                            problem?.visibleTestCases?.map((testCase, index) => (
                                <div key={index} className='bg-white/20 w-full min-h-20 text-sm p-3 rounded-md space-y-1.5 my-2'>
                                    <p>Test Case {index+1}</p>
                                    <p className='text-purple-500'>Input : <span className='bg-gray-400/50 px-2 text-white'>[ {testCase?.input.split(' ').join(' , ')} ]</span></p>
                                    <p className='text-blue-400'>Expected : <span className='bg-gray-400/50 text-white px-2'>[ {testCase?.output.split(' ').join(' , ')} ]</span></p>
                                </div>
                            ))
                        }
                        </div>
                    ) : (
                        <div className='text-white bg-emerald-700'>{result}</div>
                    )
                    }
            </div>
        </div>
    </div>
  )
}

export default SubmitProblem