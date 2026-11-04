const mongoose=require("mongoose")
const userScehme=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    course:{
        type:String,
        default:"BCA"
    }
})

const User=mongoose.model("user",userScehme)
module.exports=User