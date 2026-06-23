import express from 'express'
import { addcart, getcart, removeFromCart, updatecart } from "../controller/cart.js";
import { authenticate } from '../middleware/user.js';

const router =express.Router()
router.post("/cart" ,authenticate,addcart)
router.get("/findcart" ,authenticate,getcart)
router.put("/cartupdate/:id",authenticate,updatecart)
router.delete("/remove/:productid", removeFromCart);

export default router