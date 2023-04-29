import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

//create validator schema 
export const registerValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(30).label("Username").required(),
    email: Joi.string().email().label("Email").required(),
    country: Joi.string().min(4).label("Country").required(),
    img: Joi.string().label("Image").required(),
    city: Joi.string().min(4).label("City").required(),
    phone: Joi.string().regex(/^[0-9]{8}$/).message("Invalid Phone Number").label("Phone Number").required(),
    password: passwordComplexity().label("Password").required()
  });
  return schema.validate(data);
}

export const updateUserValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(30).label("Username"),
    email: Joi.string().email().label("Email"),
    country: Joi.string().min(4).label("Country"),
    city: Joi.string().min(4).label("City"),
    phone: Joi.string().regex(/^[0-9]{8}$/).message("Invalid Phone Number").label("Phone Number"),
    password: passwordComplexity().label("Password")
  });
  return schema.validate(data);
}

//create validator schema 
export const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().label("Email").required(),
    password: passwordComplexity().label("Password").required()
  });
  return schema.validate(data);
}

export const hotelValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(100).label("Name").required(),
    type: Joi.string().min(4).label("Type").required(),
    city: Joi.string().min(4).label("City").required(),
    address: Joi.string().min(15).label("Address").required(),
    distance: Joi.number().min(1).label("Distance").required(),
    title: Joi.string().min(7).label("Title").required(),
    desc: Joi.string().min(15).label("Description").required(),
    cheapestPrice: Joi.number().min(100).label("Price").required(),
    
    photos: Joi.array().min(3).label("Photos").required(),
  });
  return schema.validate(data);
}

export const hotelUpdateValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(100).label("Name"),
    type: Joi.string().min(4).label("Type"),
    city: Joi.string().min(4).label("City"),
    address: Joi.string().min(15).label("Address"),
    distance: Joi.number().min(1).label("Distance"),
    title: Joi.string().min(7).label("Title"),
    desc: Joi.string().min(15).label("Description"),
    cheapestPrice: Joi.number().min(100).label("Price"),
    photos: Joi.array().min(1).label("Photos"),
  });
  return schema.validate(data);
}
// {abortEarly:false}
export const roomValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(7).label("Title").required(),
    desc: Joi.string().min(15).label("Description").required(),
    price: Joi.number().min(100).label("Price").required(),
    maxPeople: Joi.number().min(1).max(5).label("Max People").required(),
    hotelId: Joi.string().label("Hotel").required(),
    roomNumbers: Joi.array().min(1).label("Rooms Array").required()
  });
  return schema.validate(data);
}