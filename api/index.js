import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// the import in express server require the extension .js

//When importing a default export, we don’t use curly brackets.
import authRoute from "./routes/auth.js";
import passwordResetRoute from "./routes/resetPassword.js"
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";

import cors from "cors";
import cookiesMiddleware from 'universal-cookie-express';
// creating an express app
const app = express();

// returns a process.env file containing the keys and their values defined in .env file
dotenv.config();

const connect = async () => { 
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongoDB");
  } catch (error) {
    throw error; 
  }
};

// To handle events after initial connection was established, you should listen for these events on the connection.(connected , disconnected , etc ...)
// 1-if disconnected
mongoose.connection.on("disconnected", () => { });
console.log(" mongoDB disconnected ! ");
// 2-if connected
mongoose.connection.on("connected", () => { });
console.log(" mongoDB connected ! ");

// middlewares
app.use(cors());
app.use(cookiesMiddleware());
// for the reason that express server cannot recognize the data sent ,we should parse it to json using the json() method
app.use(express.json())
// loading the router modules in the app
app.use("/api/auth", authRoute);
app.use("/api/resetpass", passwordResetRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
// error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something Went Wrong!";
  // customizing error using json format
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  });
})

// creating a http server listening to the port 8080 for any connection(request ,...),this function has two parameters the port and the callback function(http server)
app.listen(8080, () => {
  connect();
  console.log("connected to backend");
});
