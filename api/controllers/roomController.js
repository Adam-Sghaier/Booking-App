import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";
import { roomValidator } from "../utils/validator.js";

// the callback function should be async because there some functions that should execute before it so they takes time(the db connection | the collection and document creation, etc )
// An async function is a function declared with the async keyword, and the await keyword is permitted within it. The async and await keywords enable asynchronous, promise-based behavior to be written in a cleaner style
export const createRoom = async (req, res, next) => {
  const { error } = roomValidator(req.body);
  if (error) return next(createError(404, error.details[0].message));
  const { hotelId, ...otherInfos } = req.body;
  const newRoom = new Room({...otherInfos});
  // it's recommended to use try/catch block with api requests and DB interactions( like the datasave)
  try {
    const savedRoom = await newRoom.save();

    // the mongoDB $push method allows us to add any elt to rooms array
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });

    return res.status(200).json("Room Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    // updating the Room info  (awaiting for save promise)
    // the findByIdAndUpadate method take as parameters,the id taken from the request and the mongodb $set function , and finally the new parameter that allows us to get the updated version of the document
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // if saved , the Room returned in json format
    return res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const getHotelId = async (req, res, next) => {
  try {
    const hotel = await Hotel.find({ rooms: { $eq: req.params.roomId } });

    return res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const roomId = req.params.id;
  try {
    await Room.findByIdAndDelete(roomId);
    try {
      // the mongoDB $pull method allows us to delete any elt from rooms array
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: roomId },
      });
      
    } catch (error) {
      next(error);
    }
    
    return res.status(200).json({ message: "Room has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const rooms = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    // the mongo DB properties are allowed to be wrapped with double quotes
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          // to get access to nested properties u should use the $ sign ,because roomNumbers is an array of Identical Rooms
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    // if saved , the Room returned in json format
    return res.status(200).json("Room Status has Been updated");
  } catch (error) {
    next(error);
  }
};
