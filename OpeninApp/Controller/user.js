const {Mongoose} =  require("mongoose");
const User = require("../models/user");
require ("dotenv").config();
exports.createuser = async (req,res)=>
{
    try{
        const{
            name,
            phone,
            priority,
        } = req.body;
        if(
            !name ||
            !phone ||
            !priority
        ){
            return res.status(403).send({
                success: false,
                message:"All fields are required",
            });
        }
        const existingUser = await User.findOne({ phone });
		if (existingUser) {
			return res.status(400).json({
				success: false,
                message: "User already exists with this phone no. Kindly use this below userToken to create task.",
                userToken: existingUser.tokens[0].token,
				
			});
		}
    const user = await User.create({
        name:name,
        phone:phone,
        priority:priority,
    });
    const token = await user.generateToken();
    return res.status(200).json({
        success: true,
        //user : user._id,
        message: "user added Successfully Kindly use this below userToken to create task",
        tokenvalue: token,
        
    });
}
catch(error){
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"user can't be created Please try again",
    });
}
};