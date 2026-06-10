import jwt from 'jsonwebtoken'

export const generatetoken =(user,secret,expiresIn)=>{
    return jwt.sign(user ,secret,{ expiresIn })
}