import express from "express"
import {  createorder } from "../controller/ordercontroller.js"
import { authenticate } from "../middleware/user.js"
const router =express.Router()


router.post('/order',authenticate,createorder)
export default router   