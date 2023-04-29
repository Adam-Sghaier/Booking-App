import express from "express";
import {multer} from "../utils/multerFileHandler.js";
// When importing a named export, you should use curly brackets.
import { login, register, upload, verifyLink } from "../controllers/authController.js";

// declaring a router for auth routes
const router = express.Router();

// define an endpoint(URI+ http method(get,post,...) ) for the auth route(path="/api/auth")
router.post("/register",register);

router.post("/login",login);

router.get("/verify/:id/:token",verifyLink);

router.post("/uploadtogoogledrive",multer.single("file"),upload);


// export it for external files use and allows us to give any name we want in the import statement
export default router;