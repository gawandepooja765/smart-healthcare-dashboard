import userModel from "../models/userSchema.js";

export const completeProfile = async (req, res) => {
  try {

    const { phone, gender, dob } = req.body;

    const userId = req.user.id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        phone,
        gender,
        dob: new Date(dob),
        isProfileComplete: true
      },
      { new: true }
    );

    console.log("UPDATED USER:", user);

    res.json({
      success: true,
      user
    });

  } catch (error) {
      res.status(500).json({
      message: error.message
    });
  }
};