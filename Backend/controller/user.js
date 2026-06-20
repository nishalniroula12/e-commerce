import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../utlis/generate.js";
// register
export const registerdata =async(req,res)=>{
    try {
        console.log(req.body)
        const {username ,email,password ,role} =req.body;
        
        if(!username || !email || !password){
            return res.status(404).json({
                success:false,
                message:"User not Found"
            })
        }
        const existinguser =await User.findOne({email})
        if(existinguser){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }
        const hashpassword =await bcrypt.hash(password ,10)
        const newuser =new User({
            username,
            email,
            password:hashpassword,
            role,
        })
        await newuser.save()
        res.status(200).json({
            success:true,
            message:" user create successfully"
        })
        
    } catch (error) {
        console.log(error)
        
    }
}

export const loginone =async(req,res)=>{
    try {
        const {email ,password} =req.body;
    if (!email || !password){
        return res.status(404).json({
            success:false,
            message:"All Field required"
        })

    }
    const user =await User.findOne({email})
    console.log(user);

    if(!user){
        return res.status(400).json({
            success:false,
            message:"User not Found"
        })
    }
    const matchpassword =await bcrypt.compare(password ,user.password)
    console.log(matchpassword)
    if(!matchpassword){
        return res.status(400).json({
            success:false,
            message:"Invalid password"
        })
    }
    const token =generatetoken({id:user._id}, process.env.JWT_SECRET ,"7d")
    res.cookie("token",token,{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path:"/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    console.log(token)
    res.status(200).json({
        success:true,
        message:"user login",
        users:user,
        token:token
    })
        
    } catch (error) {
        console.log(error)
        
    }
}
export const logoutla =async(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
           

        })
        res.json({
            message:"logout vayo la"
        })
        
    } catch (error) {
        console.log(error)
        
    }

}
