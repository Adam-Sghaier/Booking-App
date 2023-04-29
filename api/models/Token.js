import mongoose from "mongoose";
const { Schema } = mongoose;


const TokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref:"user",
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt:{type:Date , default:Date.now() , expires: 3600}//after a minute the token expires
  },
  
);
// the model function comports two parameters the name of model returned and the schema of this model
export default mongoose.model("Token", TokenSchema);

