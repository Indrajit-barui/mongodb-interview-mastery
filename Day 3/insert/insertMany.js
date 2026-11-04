const connectdb=require("../../config/db")
const User=require("../../models/user")

const insertmany=async () => {
    try {
        await connectdb()
        const newuser=await User.insertMany([{
            name:"dev",
              age:23,
            email:"dev12@gmail.com",
            course:"BCA"
          
        },
        {
            name:"raj barui",
            age:20,
            course:"BA",
            email:"raj56@gmail.com"
        },
        {
            name:"vikas pal",
            age:22,
            course:"BCA",
            email:"vikas89@gmail.com"
        }

    ])

    console.log("multiple user created successfully! ")
        
    } catch (error) {
        console.log("error: ",error.message)
    }
}
insertmany()