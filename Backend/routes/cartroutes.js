import express from 'express'
import { addcart } from "../controller/cart.js";
import { authenticate } from '../middleware/user.js';

const router =express.Router()
router.post("/cart" ,authenticate,addcart)

export default router