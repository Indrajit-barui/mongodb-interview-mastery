
// limit()
// limit() restricts the maximum number of documents returned.

const connectDb=require("../../config/db")
const User=require("../../models/user")

const limit=async () => {
    try {
        await connectDb()

        const data=await User.find({
            //condition
        }).limit(3).sort(
            {
                createdAt: -1 //Three newest documents
            }
        )

        console.log(data)
    } catch (error) {
        console.log("error: ",error.message)
    }
}

// skip() is used to skip a specified number of documents before returning the results.
const skip=async () => {
    try {
        await connectDb()

        const data=await User.find().skip(2)

        console.log(data)
    } catch (error) {
        console.log(error.message)
    }
}

skip()