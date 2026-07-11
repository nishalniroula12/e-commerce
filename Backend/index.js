import express from "express"
import dotenv from 'dotenv'

import connectdb from "./config/db.js"

dotenv.config()
import cors from 'cors'
import userroutes from './routes/userroutes.js'
import categoryroutes from './routes/categoryroutes.js'
import productroutes from './routes/productroutes.js'
import sellerroutes from './routes/sellerroutes.js'
import orderroutes from './routes/orderroutes.js'
import cartroutes from './routes/cartroutes.js'
import adminroutes from './routes/adminroutes.js'
import cookieParser from "cookie-parser";

const app =express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

connectdb()

app.use("/api" ,userroutes)
app.use("/api",categoryroutes)
app.use("/api" ,productroutes)
app.use("/api" ,sellerroutes)
app.use("/api" ,orderroutes)
app.use("/api",cartroutes)
app.use("/api", adminroutes)
app.get("/" ,(req,res)=>{
    res.json({
        success:true,
        message:"database connnected"
    })
})
const PORT =process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log(`running server ${PORT} `)
})