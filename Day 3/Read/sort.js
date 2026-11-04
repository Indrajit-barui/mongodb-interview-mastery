// Sorting

const connectDb=require("../../config/db")
const User=require("../../models/user")


// db.collectionName.find().sort({
//     fieldName: 1
// })
const sort=async () => {
    try {
    await connectDb()

    const data=await User.find(
        {course:"BCA"},
        {
            name:1,
            _id:0

        }
    ).sort({
        age:1
    })

    console.log(data)

    } catch (error) {
        console.log("error: ",error.message)
    }

}

sort()