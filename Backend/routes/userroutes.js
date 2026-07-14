import express from 'express'
import { loginone, logoutla, registerdata, verifyotped,forgetpass,resetpassword } from "../controller/user.js"


const router =express.Router()

router.post("/register" ,registerdata)
router.post("/login" ,loginone)
router.post("/niske" ,logoutla)

router.post("/check", verifyotped)
router.post("/forget" ,forgetpass)
router.post("/reset" ,resetpassword)


export default router