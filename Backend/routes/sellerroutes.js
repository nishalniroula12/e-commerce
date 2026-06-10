import express from 'express'
import { createseller } from "../controller/sellercontroller.js"
import upload from '../middleware/multer.js'

const router =express.Router()

router.post("/seller",upload.single("shoplogo"),createseller)

export default router