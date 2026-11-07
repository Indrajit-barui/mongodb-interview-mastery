const user=require("../models/user")

const connect =require("../config/db")

const arrays=async () => {

    try {
        await connect()  

        // const data=await user.find(
        //     {skills:{ $size: 3}}
        // )
         
        // const updataData=await user.updateOne(
        //     {name:"Amit"},
        //     {          
        //             $push:{
        //                 skills:"C#"
        //             }
        //     }
        // )
        // console.log(updataData)

        // What if you don't want duplicate skills?
  
        // const value=await user.updateOne(
        //     {name:"Priya"},
        //     {
        //         $addToSet:{
        //             skills:"JavaScript"
        //         }
        //     }
        // )
        // console.log("update successfully")

        
        // $pull  
        await user.updateOne(
            {
                name:"Priya"
            },
            {
                $pull:{
                    skills:"JavaScript"
                }
            }
        )
        console.log("update done")
    } catch (error) {
        console.log(error.message)
    }
    
}

arrays()