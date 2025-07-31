import {createAsyncThunk , createSlice} from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData , {rejectWithValue})=>{
        try{
            const response = await axiosClient.post('/auth/register',userData);
            return response.data.user;
        }catch(err){
            return rejectWithValue(err)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials , {rejectWithValue})=>{
        try{
            const response = await axiosClient.post('/auth/login',credentials);
            return response.data.user;
        }catch(err){
            return rejectWithValue(err);
        }
    }
)

export const checkAuth = createAsyncThunk(
    'auth/chech',
    async (_ , {rejectWithValue})=>{
        try{
            const response = await axiosClient.post('/auth/check');
            return response.data.user;
        }catch(err){
            return rejectWithValue(err);
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_ , {rejectWithValue})=>{
        try{
            const response = await axiosClient.post('/auth/logout');
            return response.data.user;
        }catch(err){
            return rejectWithValue(err);
        }
    }
)

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        isAuthenticated : false,
        loading : true,
        error : null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            //Register User Cases
            .addCase(registerUser.pending , (state)=>{
                state.loading = true,
                state.error = null
            })
            .addCase(registerUser.fulfilled , (state , action)=>{
                state.loading = false,
                state.isAuthenticated = !!action.payload;
                state.user = action.payload
            })
            .addCase(registerUser.rejected , (state , action)=>{
                state.loading = false,
                state.isAuthenticated = false,
                state.error = action.payload?.message  ||  'Something went wrong',
                state.user = null
            })


            //Login User Cases
            .addCase(loginUser.pending , (state)=>{
                state.loading = true,
                state.error = null
            })
            .addCase(loginUser.fulfilled , (state, action)=>{
                state.loading = false,
                state.isAuthenticated = !!action.payload,
                state.user = action.payload
            })
            .addCase(loginUser.rejected , (state , action)=>{
                state.loading = false,
                state.isAuthenticated = false,
                state.error = action.payload?.message  ||  "Something went wrong"
            })


            //Check Auth Cases
            .addCase(checkAuth.pending , (state)=>{
                state.loading = true,
                state.error = null
            })
            .addCase(checkAuth.fulfilled , (state , action)=>{
                state.loading = false,
                state.isAuthenticated = !!action.payload,
                state.user = action.payload
            })
            .addCase(checkAuth.rejected , (state , action)=>{
                state.loading = false,
                state.isAuthenticated = false,
                state.error = action.payload?.message  ||  "Something went wrong"
            })


            //Logout Cases
            .addCase(logoutUser.pending , (state)=>{
                state.loading = true,
                state.error = null
            })
            .addCase(logoutUser.fulfilled , (state , action)=>{
                state.loading = false,
                state.isAuthenticated = !!action.payload,
                state.user = action.payload
            })
            .addCase(logoutUser.rejected , (state , action)=>{
                state.error = action.payload?.message  ||  "Something went wrong",
                state.loading = false,
                state.isAuthenticated = false
            })
    }
})


export default authSlice.reducer;