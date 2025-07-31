import { Navigate, Route, Routes } from "react-router";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import {useDispatch , useSelector} from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import SubmitProblem from "./pages/SubmitProblem";
import Blogs from './pages/Blogs'
import UploadBlog from "./pages/UploadBlog";
import Stats from "./pages/Stats";

export default function App(){

  const dispatch = useDispatch();
  const {isAuthenticated ,user, loading} = useSelector((state)=>state.auth);

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch])

  if (loading) {
    return <div>Loading...</div>;  // Add a proper loading component
  }
  console.log(user);

  return(
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/"/> : <Login/> }/>
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/"/> : <SignUp/> }/>
        <Route path="/admin-login" element={user?.role == 'admin' ? <Navigate to='/admin'/> : <AdminLogin/>}/>
        <Route path="/admin" element={isAuthenticated ? <AdminPanel/> : <Navigate to='/admin-logn'/> }/>
        <Route path="/problem/:id" element={<SubmitProblem />}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path="/create-blog" element={<UploadBlog/>} />
        <Route path="/stats" element={isAuthenticated ? <Stats/> : <Navigate to="/login"/>}/>
      </Routes>
    </>
  )
}