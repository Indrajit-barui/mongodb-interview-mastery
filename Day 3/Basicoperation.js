
const User=require("../models/user")
const connectDb=require("../config/db")
const insertUser=async()=>{
    try {
        await connectDb()
        const newUser=await User.create({
            name:"Indrajit barui",
            age:21,
            email:"example90@gmail.com",
            course:"Mca"
        })
        console.log("new user inserted")

    } catch (error) {
        console.log("error: ",error.message)
    }
}

insertUser()