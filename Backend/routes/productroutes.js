import express from  'express'
import upload from '../middleware/multer.js'
import { databyid, niskenabelavayo, productcreate, publicdata, updateone } from '../controller/product.js'
import { authenticate } from '../middleware/user.js'
const router=express.Router()

router.post("/product" ,upload.single("image") ,authenticate,productcreate)
router.get("/get" ,publicdata)
router.get("/gets/:id",databyid)
router.delete("/remove/:id",niskenabelavayo)
router.put("/levelup/:id" ,upload.single("image"), updateone)

export default router