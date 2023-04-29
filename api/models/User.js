import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required :true
    },
    img : {
      type:String,
      required :true
    },
    city: {
      type: String,
      required:true,
    },
    phone: {
      type: String,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    //timestamps field adds createdAt & updatedAt fields to your schema
  }
);
// the model function comports two parameters the name of model returned and the schema of this model
export default mongoose.model("User", UserSchema);
