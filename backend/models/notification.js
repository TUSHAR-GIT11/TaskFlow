import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:[
        "COMMENT_ADDED",
        "ROLE_CHANGED",
        "USER_ENABLED",
        "USER_DISABLED",
        "STATUS_CHANGED",
        ],
        required:true
    },
     message:{
        type:String,
        required:true
     },
     isRead:{
        type:Boolean,
        default:false
     }
},{ timestamps:true }
);

export default mongoose.model("Notification",notificationSchema)