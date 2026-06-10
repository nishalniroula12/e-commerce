import cloudinary from "../config/cloudinary.js"
import Category from "../models/category.js"
import User from "../models/user.js"
import { Uploadcloudinary } from "../utlis/cloudinaryupload.js"

export const createcategory =async(req,res)=>{
    try {
        const {title,description ,slug,status,sortorder} =req.body
        const result =await Uploadcloudinary(req.file.buffer,"categorys")
        console.log(result)

        const category=await Category.create({
            title,
            slug,
            description,
            status,
            sortorder,
            image:result.secure_url,
            public_id:result.public_id,
        })
        res.status(200).json({
            success:true,
            message:"data is created",
            category

        })
        
    } catch (error) {
        console.log(error)
        
    }


}

//public

export const createone =async(req,res)=>{
    try {
        const category =await Category.find()
        return res.status(200).json({
            success:true,
            message:'category gets',
            category
        })
        
    } catch (error) {
        console.log(error)
        
    }
}

//getbyid

export const categorybyid=async(req,res)=>{
    try {
        const {id} =req.params;
        console.log(id)
        const category =await User.findById(id)
        return res.status(400).json({
            success:true,
            message:"Get by id",
            category

        })
        
    } catch (error) {
        console.log(error)
        
    }
}

export const niskinebelavayo =async(req,res)=>{
    try {
        const category =await Category.findById(req.params.id)
        if(!category){
            return res.status(200).json({
                success:false,
                message:"Niskiyo",
                
            

            })
        }
        await cloudinary.uploader.destroy(category.public_id)
        await category.deleteOne()
        return res.status(400).json({
            success:true,
            message:"niskiyo ",
            category
        })
        
    } catch (error) {
        console.log(error)
        
    }
}
export const updatenow = async (req, res) => {
    try {
      const { title, slug, description, status, sortorder } = req.body;
  
      const category = await Category.findById(req.params.id);
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }
      console.log(req.body)
  
      category.title = title || category.title;
      category.slug = slug || category.slug;
      category.description = description || category.description;
      category.status = status || category.status;
      category.sortorder = sortorder || category.sortorder;
  
      if (req.file) {
await cloudinary.uploader.destroy(category.public_id)
const result =await Uploadcloudinary(req.file.buffer)   
category.image =result.secure_url
category.public_id =result.public_id
console.log(result.public_id)
   }
  
      const updatedCategory = await category.save();
  
      return res.status(200).json({
        success: true,
        category: updatedCategory
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };