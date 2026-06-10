import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.js";
import { Uploadcloudinary } from "../utlis/cloudinaryupload.js";

export const productcreate =async(req,res)=>{
    try {
        const {title,slug,description ,status,price,discounted,category,stock,code} =req.body;
        const result =await Uploadcloudinary(req.file.buffer,"product")
        console.log(result)
        console.log("Category from req.body:", category);
        const product =await Product.create({
            title,
            slug,
            description,
            status,
            price,
            discounted,
            code,
            stock,
            category,
            image:result.secure_url,
            public_id:result.public_id
        })
        console.log(product);
        return res.status(404).json({
            success:true,
            message:"Product List is Created",
            product
        })
        
    } catch (error) {
        console.log(error)
        
    }
}
//public
export const publicdata =async(req,res)=>{
    try {
        const product =await Product.find().populate("category")
        console.log(product)
        res.status(200).json({
            success:true,
            message:"Get all product",
            product
        })
    } catch (error) {
        console.log(error)
        
    }

}
//get data by id
export const databyid =async(req,res)=>{
    try {
        const product =await Product.findById(req.params.id).populate("category")
        return res.status(200).json({
            success:true,
            message:"data get by id",
            product
        })

        
    } catch (error) {
        console.log(error)
        
    }
}
export const niskenabelavayo = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Received ID:", id);

        const product = await Product.findById(id);

        console.log("Product found:", product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await cloudinary.uploader.destroy(product.public_id);
        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateone =async(req,res)=>{
    try {
        const {title,slug,description ,status,price,discounted,category,stock,code} =req.body;
        console.log(req.body)

        const product =await Product.findById(req.params.id).populate("category")
        if(!product){
            return res.status(201).json({
                success:false,
                message:"Product not found"
            })
        }

        product.title =title || product.title
        product.category =category || product.category
        product.slug =slug || product.slug
        product.description =description || product.description
        product.code =code || product.code
        product.stock =stock || product.stock
        product.status =status || product.status
        product.stock =stock || product.stock
        product.price =price || product.price
        product.discounted =discounted || product.discounted

        if(req.file){
            await cloudinary.uploader.destroy(product.public_id)
            const result =await Uploadcloudinary(req.file.buffer, "product")
            product.image =result.secure_url
            product.public_id=result.public_id
            console.log(result.public_id)

        }
        const uploadproduct =await product.save()
        return res.status(200).json({
            success:true,
            message:"product data is updated",
            product:uploadproduct
        })
        
        
    } catch (error) {
        console.log(error)
        
    }
}