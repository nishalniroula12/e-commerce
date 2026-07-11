import express from 'express'
import { createseller } from "../controller/sellercontroller.js"
import upload from '../middleware/multer.js'
import {authenticate} from '../middleware/user.js'

const router =express.Router()

router.post("/seller",upload.single("shoplogo"),authenticate,createseller)


export default router