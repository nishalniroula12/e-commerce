import Seller from "../models/seller.js";
import User from "../models/user.js";

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().populate("user", "name email");
    console.log(sellers);

    res.json({
      success: true,
      sellers,
    });
    console.log(sellers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved or rejected

    // Validate status
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    console.log("Params ID:", req.params.id);

    const sellerBefore = await Seller.findById(req.params.id);
    console.log("Seller before update:", sellerBefore);
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        verificationstatus: status,
      },
      { new: true }
    );
    console.log(seller);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Seller ${status} successfully`,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
