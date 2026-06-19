import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Protectedroutes = () => {
    const token =localStorage.getItem("token")
    console.log("protectedroutes",token)
  return token ? <Outlet/>
  : <Navigate to="/login" replace/>
   
}

export default Protectedroutes
