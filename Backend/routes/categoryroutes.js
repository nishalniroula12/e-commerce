import { categorybyid, createcategory, createone, niskinebelavayo, updatenow } from "../controller/category.js"
import upload from "../middleware/multer.js"
import express from 'express'

const router =express.Router()

router.post("/create" ,upload.single("image") ,createcategory)
router.get("/public" ,createone)
router.get("/system/:id",categorybyid)
router.delete("/getout/:id" ,niskinebelavayo )
router.put("/edit/:id" ,upload.single("image"),updatenow)

export default router