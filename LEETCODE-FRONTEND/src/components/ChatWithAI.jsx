import React, { useState , useRef , useEffect } from 'react'
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input'
import axiosClient from '../utils/axiosClient';

const ChatWithAI = ({problem}) => {

  const [messages , setMessages] = useState([{
    role : 'user',
    parts:[{text : "What can you do for me ?"}]
  }, {
    role : 'model',
    parts:[{text : "An array is a linear data structure that stores a collection of elements in contiguous memory locations. All elements are typically of the same data type and can be individually accessed using an index. The index of an array starts from 0 and goes up to n-1 where n is the total number of elements."}]
  }]);

  const [zoom ,setZoom ] = useState(false);
  const [prompt , setPrompt] = useState([]);

  const messagesEndRef = useRef(null);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC"
  ];

  const handleChange = (e) => {
    // console.log(e.target.value);
    setPrompt(e.target.value);
    console.log(prompt)
  };
 
  const onSubmit = async(data) => {
    setMessages(prev => [...prev , {role : 'user' , parts:[{text: prompt}]}]);

    try{
      const response = await axiosClient.post('/ai/chat',{
        messages : prompt,
        title : problem.title,
        description : problem.description,
        testCases : problem.visibleTestCases,
        startCode : problem.startCode
      })
      console.log(response)
      setMessages(prev => [...prev , {
        role : 'model',
        parts:[{text : response.data.message}]
      }])
      console.log(messages)
    }catch(err){
      console.error("API Error:", err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts:[{text: "Error from AI Chatbot"}]
      }]);
    }
  };

  const [audioData , setAudioData ] = useState('');
  const textToSpeech = async (data) =>{
    const base64 = (await axiosClient.post('/ai/textToAudio',{data})).data.audios[0];
    const blob = new Blob([Uint8Array.from(atob(base64) , c => c.charCodeAt(0))] , { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.play();
    console.log(audio);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  return (
    <div className={`relative bg-white rounded-xl border-amber-400 border-1  transition-all duration-250 ease-in-out overflow-x-auto`}>
        <div className='text-gray-800 pt-2 flex items-center justify-between px-2'>
          <svg onClick={()=>{setZoom(!zoom)}} className='w-6.5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z"></path></svg>
        </div>
        <div className='text-black text-sm'>
        </div>
        <div className={`text-black text-sm overflow-y-auto ${zoom ? 'h-140 w-195' : 'h-110 w-100' } mb-11`}>{
          messages.map((mssg , index) => {
            if(mssg.role == 'user'){
              return <div key={index} className='bg-emerald-500 w-70  p-2 rounded-md ml-2 mb-2'>
                <p className=' '>
                  {mssg.parts[0].text}
                </p>
              </div>
            }
            return <div key={index} className='relative'>
                <p className={`bg-emerald-200 p-2 rounded-md ${zoom ? 'ml-80 max-w-120' : 'ml-40 max-w-60'} mr-2 mb-2`}>
                  {mssg?.parts[0].text}
                    <svg onClick={()=>{textToSpeech(mssg?.parts[0].text)}} className='absolute right-3 bottom-0  w-4 ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z"></path></svg>
                </p>
                
              </div>
          })  
        }
        <div ref={messagesEndRef}/>
        
        </div>
        <div className='absolute  bottom-0  w-full'>
            <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
        </div>
        

    </div>
  )
}

export default ChatWithAI