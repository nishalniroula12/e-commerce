import express from "express"
import {  createOrder } from "../controller/ordercontroller.js"
import { authenticate } from "../middleware/user.js"
const router =express.Router()


router.post('/order',authenticate,createOrder)
export default router   