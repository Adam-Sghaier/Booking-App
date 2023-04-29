import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  getAdmin
} from "../controllers/userController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

// declaring a router for auth routes
const router = express.Router();

// verifyToken
router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in");
});
// // check user identity
// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//   res.send("hello user, you are logged in and u can delete your account");
// });

// // check user identity
router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("hello admin, you are logged in and u can delete all accounts");
});
// set JWT verification middleware functions for endpoints
// Update
router.put("/:id", verifyUser, updateUser);
// Delete
router.delete("/:id", verifyAdmin, deleteUser);
// Get
router.get("/admin", verifyAdmin, getAdmin);
router.get("/:id", verifyUser, getUser);
// Get All
router.get("/", verifyAdmin, getUsers);
// export it for external files use and allows us to give any name we want in the import statement
export default router;
