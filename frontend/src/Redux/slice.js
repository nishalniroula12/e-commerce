import { createSlice } from "@reduxjs/toolkit";

    const saveUser =JSON.parse(localStorage.getItem("user"))

    const initialState ={
        user:saveUser ||  null,
        isAuthenticate:saveUser ?true: false
    }

    export const slice =createSlice({
        name:"post",
        initialState,
        reducers:{
            logindata :(state, action)=>{
                console.log("kase ho tum lok",action.payload)
                state.user =action.payload.users;
                state.isAuthenticate =true


                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.users)
                )
                localStorage.setItem("token",action.payload.token)
            },
            logoutdata:(state)=>{
                state.user =null;
                state.isAuthenticate=false
                localStorage.removeItem("user")
            }
        }

    })
    export const {logindata ,logoutdata}=slice.actions