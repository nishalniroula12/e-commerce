import express from "express"
import { orderone } from "../controller/ordercontroller.js"
const router =express.Router()

router.post('/order',orderone)
export default router