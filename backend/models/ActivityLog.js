import mongoose from "mongoose";

const activityLogSchema = mongoose.Schema({
    taskId:{
       type:mongoose.Schema.Types.ObjectId,
       ref: "Task",
       required:true

    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fromStatus:String,
    toStatus:String,
    action:String
},
   { timeStamps:true }
)

export default mongoose.model("ActivityLog", activityLogSchema)