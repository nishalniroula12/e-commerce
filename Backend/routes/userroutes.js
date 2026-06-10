import express from 'express'
import { loginone, logoutla, registerdata } from "../controller/user.js"

const router =express.Router()

router.post("/register" ,registerdata)
router.post("/login" ,loginone)
router.post("/niske" ,logoutla)

export default router