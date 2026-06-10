import Seller from "../models/seller.js";
import { Uploadcloudinary } from "../utlis/cloudinaryupload.js";

export const createseller = async (req, res) => {
  try {
    console.log(req.user)
    const {
      shopname,
      user,
      description,
      rating,
      taxnumber,
      verificationstatus,
      verificationdate,
      bankdetails:{
        bankname,
        accountname,
        accountnumber

      },
      totalsales,
      address,
    } = req.body;
    const result =await Uploadcloudinary(req.file.buffer,"seller")
    console.log(result)

    const seller = await Seller.create({
      shopname,
      user,
      description,
      rating,
      taxnumber,
      verificationstatus,
      verificationdate,
      bankdetails: {
            accountname: req.body.accountname,
            accountnumber: req.body.accountnumber,
            bankname: req.body.bankname,
          },
        
      
      totalsales,
      address,
      shoplogo:result.secure_url,
      public_id:result.public_id
    });
    return res.status(400).json({
        success:true,
        meassge:"Seller is create",
        seller
    })
  } catch (error) {
    console.log(error)
  }
};
