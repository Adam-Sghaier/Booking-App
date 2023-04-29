import mongoose from "mongoose";
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    // a special property to differenciate similar rooms (having properties with same values)
    roomNumbers: [{
      number: Number,
      unavailableDates: {type:[Date]},
    }],
  },
  {
    timestamps: true,
    //timestamps field adds createdAt & updatedAt fields to your schema
  }
);
// the model function comports two parameters the name of model returned and the schema of this model
export default mongoose.model("Room", RoomSchema);
