const connectDb=require("../../config/db")
const User=require("../../models/user")
// db.collection.find(
//     { filter_condition },
//     { projection_condition }
// )
const projection=async () => {
    await connectDb()
    const data=await User.find(    //You cannot normally mix inclusion (1) and exclusion (0) in the same projection.
        {course:"BCA"}, // You want to find BCA students, but only want to show their name.
        {
         name:1, 
         _id: 0
        }
    )

    console.log(data)
}

projection()