const User=require("../../models/user")
const connectDb=require("../../config/db")

const QueryOperators=async () => {
    try {
            await connectDb()

    // const data=await User.find(

        
    //     {
    //         marks:{
    //             $gt:80
    //         }
    //     },
    //     {
    //         name:1
    //     }
    // )
    const data=await User.find({
      
        $and:[
            {course:"BCA"},
            {marks:{
                $gt:80
            }}
        ]
      
    })
 console.log(data)
    } catch (error) {
        console.log(error.message)
    }

   
}

QueryOperators()