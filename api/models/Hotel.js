import mongoose from "mongoose";
const { Schema } = mongoose;

const HotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  photos: {
    type: [String],
    validate: v => Array.isArray(v) && v.length >= 3,
    required : true
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    min: 0,
    max: 5,
  },
  rooms: {
    type: [String],
    validate: v => Array.isArray(v) && v.length >= 0,
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});
// the model function comports two parameters the name of model returned and the schema of this model
export default mongoose.model("Hotel", HotelSchema);
