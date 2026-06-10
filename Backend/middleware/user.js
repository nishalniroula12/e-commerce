import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const authetication=async(req,res,next)=>{
    try {
        const token =req.cookies.token;
        if(!token){
            return res.status(404).json({
                success:false,
                message:"no authentication"
            })
        }
        const decode =jwt.verify(token ,process.env.secret)
        const  user =await User.findById(decode.id).select("-password")
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        req.user =user;
        next()
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"invalid token"

        })
        
    }
}