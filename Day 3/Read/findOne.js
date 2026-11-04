const connectDb=require("../../config/db")
const User=require("../../models/user")
const findone=async () => {
    try {
     await connectDb()
    /*
     const find=await User.findOne({
        // and
        // {name:"Indrajit barui",
        //  course:"Mca"

        // }

        // or
        $or:[
             {name:"Indrajit barui"},
             {course:"MCA"}
        ]
        })
        
     console.log(find)
     */

     const findmany=await User.find({
        age:21
     })
     console.log(findmany)
    } catch (error) {
        console.log("error: ",error.message)
    }


}
findone()