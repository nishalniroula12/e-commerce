import express from 'express'
import { createseller } from "../controller/sellercontroller.js"
import upload from '../middleware/multer.js'
import {authenticate,sellerauth} from '../middleware/user.js'

const router =express.Router()

router.post("/seller",upload.single("shoplogo"),sellerauth,authenticate,createseller)

export default router