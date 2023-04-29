import jwt from "jsonwebtoken";
import { createError } from "./error.js";

// middlewares
export const verifyToken = (req,res,next)=> {
  // the token which cookie is unsigned are accessed via the req.cookies object 
  const token = req.universalCookies.get("access_token");
  if(!token){
    return next(createError(401,"You are not authentificated"))
  }

  jwt.verify(token,process.env.JWT,(err,user)=>{
    // we've assigned the token data to user parameter
    if(err) return next(createError(402,"The token is not valid!"));
    req.user=user;
    //access the next operation(function) declared in the endpoint 
    next();
  })
}

export const verifyUser = (req,res,next)=> {
  verifyToken(req,res,()=>{
    // the next parameter is not neccesary here because it will launch the operation in checkauthentication endpoint
    if(req.user.id === req.params.id || req.user.isAdmin){
      next()
    }else{
      return next(createError(403,"You're not authorized!"));
    }
  })
}

export const verifyAdmin = (req,res,next)=> {
  verifyToken(req,res,()=>{
    // the next parameter is not neccesary here bacause it will lauch the operation in checkauthentication endpoint
    if(req.user.isAdmin){
      next()
    }else{
      return next(createError(403,"You're not authorized!"));
    }
  })
}