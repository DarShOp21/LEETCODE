// "use client";
import React ,{useEffect, useState } from "react";
import { Link } from "react-router";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import {IconBrandGithub, IconBrandGoogle} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { Error } from "../components/ui/error";


import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { email, required } from "zod/v4-mini";
import { loginUser } from "../authSlice";
import { useDispatch  ,  useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RiEyeLine , RiEyeOffLine} from "@remixicon/react";

//SchemaValidation of signup form

const loginSchema = z.object({
  email:z
    .string()
    .email(required,"Enter valild email"),
  password:z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
})

export default function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isAuthenticated , loading , error} = useSelector(state => state.auth)
  const [showPassword , setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({resolver:zodResolver(loginSchema)});

  useEffect(()=>{
    if(isAuthenticated)
      navigate('/');
  },[isAuthenticated , navigate])

  const onSubmit = (data)=>{
    dispatch(loginUser(data))
  }

  return (
    <div>
      <div
      className="shadow-input mx-auto mt-38 w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome Back to Master
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to Master Coding if you want to level up your coding skills with our comprehensive platform.
      </p>
      <form className="my-8" onSubmit={handleSubmit((data)=>onSubmit(data))}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input {...register('email')} id="email" placeholder="projectmayhem@fc.com" type="email" />
          {errors.email && <Error>{errors.email.message}</Error>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-6 relative">
          <Label htmlFor="password">Password</Label>
          <Input {...register('password')} id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
          {errors.password && <Error>{errors.password.message}</Error>}
          <div className="absolute right-0 mt-8.5 mr-2">
            {showPassword ?<RiEyeLine
              size={18} 
              color="white" 
              className="my-icon " 
              onClick={()=>{setShowPassword(!showPassword)}}
            /> : <RiEyeOffLine
              size={18}
              color="white" 
              className="my-icon " 
              onClick={()=>{setShowPassword(!showPassword)}}
            /> }
          </div>
          
        </LabelInputContainer>
        

        <button
          className="group/btn  relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit">
          Sign In &rarr;
          <BottomGradient />
        </button>
        <p className="mt-2 ml-25 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create an account? <Link className="text-blue-400" to={'/signup'}>Sign Up</Link>
        </p>
        <p className="mt-2"><Link className=" ml-34 text-sm text-yellow-500" to={'/admin-login'}>Login as Admin</Link></p>
        <div
          className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex space-x-4">
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit">
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit">
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
    </div>
    
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
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
