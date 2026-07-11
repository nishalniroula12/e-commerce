import express from "express"
import {deleteSeller, getAllSellers, updateSellerStatus } from "../controller/Admincontroller.js"

const router =express.Router()

router.get("/getseller",getAllSellers)
router.put("/sellerapprove/:id" , updateSellerStatus)

router.delete("/sellerdelete/:id",deleteSeller)

export default router