import express from 'express'
import { addcart, clearcart, getcart, removecart, updatecart } from "../controller/cart.js";
import { authenticate } from '../middleware/user.js';

const router =express.Router()
router.post("/cart" ,authenticate,addcart)
router.get("/findcart" ,authenticate,getcart)
router.put("/cartupdate/:id",authenticate,updatecart)
router.delete("/cartclear" ,authenticate,clearcart)
router.delete("/removecart/:id" ,authenticate,removecart)

export default router