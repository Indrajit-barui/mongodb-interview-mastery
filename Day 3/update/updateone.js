const connectDb=require("../../config/db")
const User=require("../../models/user")
// db.collection.updateOne(
//     { filter_condition },
//     { update_operation }
// )

const updateOne=async () => {
    await connectDb()
    const updateData=await User.updateOne(
        {name:"Indrajit barui"},{
        $set:{
           course:"BCA",
            
        }
        }
    )

    console.log("data updated successfully! ",updateData)
}

updateOne()