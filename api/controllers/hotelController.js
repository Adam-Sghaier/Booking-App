import Hotel from "../models/Hotel.js";
import { hotelUpdateValidator, hotelValidator } from "../utils/validator.js";
import Room from "../models/Room.js";
// the callback function should be async because there some functions that should execute before it so they takes time(the db connection + the collection and document creation)
export const createHotel = async (req, res, next) => {
  const { featured, ...otherinfos } = req.body;

  const { error } = hotelValidator({ ...otherinfos });
  if (error) return res.status(400).send({ message: error.details[0].message });
  // creating a hotel instance basing on req data
  const newHotel = new Hotel(req.body);

  try {
    // saving the hotel in DB (awaiting for save promise)
    await newHotel.save();
    // if saved , the hotel returned in json format
    return res.status(200).json("Hotel Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    // updating the hotel info  (awaiting for save promise)
    // the findByIdAndUpadate method take as parameters,the id taken from the request and the mongodb $set function , and finally the new parameter that allows us to get the updated version of the document
    const { error } = hotelUpdateValidator(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    let updatedHotel;
    if (req.body.photos) {
      const { photos, ...otherFields } = req.body;
      updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...otherFields },
          $push: { "photos": photos }
        },
        { new: true }
      );
    } else {
      updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    }

    // if saved , the hotel returned in json format
    return res.status(200).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const deletedRooms = await Promise.all(hotel.rooms.map((room) => {
      return Room.findByIdAndDelete(room);
    }));
    await Hotel.findByIdAndDelete(req.params.id);
    // if saved , the hotel returned in json format
    return res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    return res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const getHotels = async (req, res, next) => {
  // define the structure of query object
  const { min, max, ...others } = req.query;
  try {
    // the limit fucntion limits the numbers of fetched documents
    const hotels = await Hotel.find({
      ...others,
      // the $gt & $lt (greater then & less then allows us to limit the numbers of hotels fetched depending on their cheapest price)
      cheapestPrice: { $gt: min || 1, $lt: max || 2000 },
    }).limit(req.query.limit);
    return res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    // Promise.all returns an array of promises
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );

    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apratment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotels", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (error) {
    next(error);
  }
};




