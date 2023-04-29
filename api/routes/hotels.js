import express from "express";
import {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getHotels,
  countByCity,
  countByType
  
} from "../controllers/hotelController.js";
import { getHotelRooms } from "../controllers/roomController.js";

import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
// declaring a router for auth routes
const router = express.Router();


//create
router.post("/", verifyAdmin, createHotel);

// Update
router.put("/:id", verifyAdmin, updateHotel);

// Delete
router.delete("/:id", verifyAdmin, deleteHotel);

// Get
router.get("/:id", getHotel);
// Get All
router.get("/", getHotels);

// Get
router.get("/get/countbycity", countByCity);
// Get 
router.get("/get/countbytype", countByType);

router.get("/:id/rooms", getHotelRooms);
// export it for external files use and allows us to give any name we want in the import statement
export default router;
