const mongoose = require("mongoose");
const  jwt = require("jsonwebtoken");
require ("dotenv").config();
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    priority:{
        type: Number,
        required: true,
        enum:{
            values:[0,1,2],
            message:`{VALUE} is not valid`,
        },
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
  
});

userSchema.methods.generateToken = async function(){
    try{
        const token = jwt.sign(
            {
                userId: this._id,
                phone:this.phone,
                priority:this.priority,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );
        this.tokens = this.tokens.concat({token:token})
        console.log(token);
        await this.save();
        return token;
    }
    catch(error){
        console.error(error);
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;