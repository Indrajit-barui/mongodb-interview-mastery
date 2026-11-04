const User=require("../../models/user")
const connectDb=require("../../config/db")

const insertone=async () => {
    try {
        await connectDb()
        const newUser=await User.insertOne({
            name:"akash munian",
            age:21,
            course:"bca",
            email:"akash56@gmail.com"
        })
  
        console.log("new user inserted successfully! ")
    } catch (error) {
        console.log("error: ",error.message)
    }
}

insertone()