import mongoose from "mongoose";

const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    fromValue:{
      type:String,
      required:true
    },
    toValue:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true, 
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
