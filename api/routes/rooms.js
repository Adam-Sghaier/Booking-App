import express from "express";
import {
  createRoom,
  deleteRoom,
  getHotelId,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/roomController.js";
import { verifyAdmin } from "../utils/verifyToken.js";
// declaring a router for auth routes
const router = express.Router();

//create
router.post("/", verifyAdmin, createRoom);

// Update
router.put("/:id", verifyAdmin, updateRoom);
router.put("/availability/:id",updateRoomAvailability);

// Delete
router.delete("/:id/:hotelId", verifyAdmin, deleteRoom);
// Get
router.get("/:id", getRoom);
router.get("/hotel/:roomId", getHotelId);
// Get All
router.get("/", getRooms);

// export it for external files use and allows us to give any name we want in the import statement
export default router;
