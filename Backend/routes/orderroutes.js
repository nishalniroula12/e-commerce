import express from "express"
import {  createorder, getorder } from "../controller/ordercontroller.js"
import { authenticate } from "../middleware/user.js"
const router =express.Router()


router.post('/order',authenticate,createorder)
router.get('/createorder',authenticate,getorder)
export default router   