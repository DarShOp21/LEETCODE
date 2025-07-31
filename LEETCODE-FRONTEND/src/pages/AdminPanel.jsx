import React from 'react'
import { cn } from "../lib/utils";
import { Label } from '../components/ui/label';
import { Input, Textarea } from '../components/ui/input';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import Editor from '@monaco-editor/react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  solution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

const AdminPanel = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className='bg-black text-white max-w-full min-h-screen pt-20 px-4 px-40'>
      <h1 className='text-2xl font-bold mb-10'>Create New Problem</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <LabelInputContainer>
              <Label>Title</Label>
              <Input placeholder="Problem title" {...register('title')}/>
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label>Description</Label>
              <Textarea 
                className="w-full p-2 bg-gray-700 rounded min-h-[150px] text-white" 
                {...register('description')}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label>Difficulty</Label>
              <select 
                className="w-full p-2 bg-gray-700 rounded text-white" 
                {...register('difficulty')}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty.message}</p>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label>Tags</Label>
              <select 
                className="w-full p-2 bg-gray-700 rounded text-white" 
                {...register('tags')}
              >
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>
              {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
            </LabelInputContainer>
          </div>
        </section>

        {/* Test Cases Section */}
        <section className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
          <div className="space-y-8">
            {/* Visible Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Visible Test Cases</h3>
                <button 
                  onClick={() => appendVisible({input: '', output: '', explanation: ''})}  
                  type="button" 
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  Add Visible Case
                </button>
              </div>
              
              {visibleFields.map((field, index) => (
                <div key={field.id} className="mb-6 p-4 bg-gray-700 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabelInputContainer>
                      <Label>Input</Label>
                      <Textarea 
                        className="w-full p-2 bg-gray-600 rounded text-white" 
                        {...register(`visibleTestCases.${index}.input`)}
                      />
                      {errors.visibleTestCases?.[index]?.input && (
                        <p className="text-red-500 text-sm">{errors.visibleTestCases[index].input.message}</p>
                      )}
                    </LabelInputContainer>
                    
                    <LabelInputContainer>
                      <Label>Output</Label>
                      <Textarea 
                        className="w-full p-2 bg-gray-600 rounded text-white" 
                        {...register(`visibleTestCases.${index}.output`)}
                      />
                      {errors.visibleTestCases?.[index]?.output && (
                        <p className="text-red-500 text-sm">{errors.visibleTestCases[index].output.message}</p>
                      )}
                    </LabelInputContainer>
                    
                    <LabelInputContainer className="md:col-span-2">
                      <Label>Explanation</Label>
                      <Textarea 
                        className="w-full p-2 bg-gray-600 rounded text-white" 
                        {...register(`visibleTestCases.${index}.explanation`)}
                      />
                      {errors.visibleTestCases?.[index]?.explanation && (
                        <p className="text-red-500 text-sm">{errors.visibleTestCases[index].explanation.message}</p>
                      )}
                    </LabelInputContainer>
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Hidden Test Cases</h3>
                <button 
                  type="button" 
                  className="px-3 py-1 bg-green-600 rounded"
                  onClick={() => appendHidden({input: '', output: ''})}
                >
                  Add Hidden Case
                </button>
              </div>
              
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="mb-6 p-4 bg-gray-700 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LabelInputContainer>
                      <Label>Input</Label>
                      <Textarea 
                        className="w-full p-2 bg-gray-600 rounded text-white" 
                        {...register(`hiddenTestCases.${index}.input`)}
                      />
                      {errors.hiddenTestCases?.[index]?.input && (
                        <p className="text-red-500 text-sm">{errors.hiddenTestCases[index].input.message}</p>
                      )}
                    </LabelInputContainer>
                    
                    <LabelInputContainer>
                      <Label>Output</Label>
                      <Textarea 
                        className="w-full p-2 bg-gray-600 rounded text-white" 
                        {...register(`hiddenTestCases.${index}.output`)}
                      />
                      {errors.hiddenTestCases?.[index]?.output && (
                        <p className="text-red-500 text-sm">{errors.hiddenTestCases[index].output.message}</p>
                      )}
                    </LabelInputContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Template Section */}
        <section className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 ">Code Template</h3>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Initial Code</h3>
              {[0, 1, 2].map((index) => (
                <div key={index} className="mb-4">
                  <LabelInputContainer>
                    <Label className={'my-4 text-lg'}>
                      {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                    </Label>
                    <Editor
                      language={index === 0 ? 'cpp' : index === 1 ? 'java' : 'javascript'}
                      onChange={()=>{}}
                      theme='vs-dark'
                      defaultValue={'//Enter the code'}
                      className='h-100'
                    />
                    
                    {errors.startCode?.[index]?.initialCode && (
                      <p className="text-red-500 text-sm">{errors.startCode[index].initialCode.message}</p>
                    )}
                  </LabelInputContainer>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 mt-20 ">Solution Code</h3>
              {[0, 1, 2].map((index) => (
                <div key={index} className="mb-4">
                  <LabelInputContainer>
                    <Label className={'text-lg my-4'}>
                      {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                    </Label>
                    <Editor
                      language={index === 0 ? 'cpp' : index === 1 ? 'java' : 'javascript'}
                      onChange={()=>{}}
                      theme='vs-dark'
                      defaultValue={'//Enter the code'}
                      className='h-100 w-30' 
                    />
                    {errors.referenceSolution?.[index]?.completeCode && (
                      <p className="text-red-500 text-sm">{errors.referenceSolution[index].completeCode.message}</p>
                    )}
                  </LabelInputContainer>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-6 py-2 mb-10 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Problem
          </button>
        </div>
      </form>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default AdminPanel;