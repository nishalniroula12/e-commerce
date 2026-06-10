import express from  'express'
import upload from '../middleware/multer.js'
import { databyid, niskenabelavayo, productcreate, publicdata, updateone } from '../controller/product.js'
const router=express.Router()

router.post("/product" ,upload.single("image") ,productcreate)
router.get("/get" ,publicdata)
router.get("/gets/:id", databyid)
router.delete("/remove/:id",niskenabelavayo)
router.put("/levelup/:id" ,upload.single("image"), updateone)

export default router