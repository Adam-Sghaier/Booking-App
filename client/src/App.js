import { Route, BrowserRouter, Routes } from "react-router-dom";
import ForgotPass from "./pages/forgotPassword/ForgotPass";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import HotelsList from "./pages/hotels list/HotelsList";
import Login from "./pages/login/Login";
import PasswordReset from "./pages/passwordReset/PasswordReset";
import Register from "./pages/register/Register";
import Verified from "./pages/verified/Verified";



function App() {
  return (
    <div>
      {/* we're defining our Routes  */}
      <BrowserRouter>
        <Routes>
          {/*  the element attribute is the component affected by this route*/}

          <Route path="/" element={<Home />} />
          {/* <Route path="/" exact element={<Navigate  replace to="/login" />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/users/verify/:id/:token" element={<Verified />} />
          <Route path="/login/forgot_password" element={<ForgotPass />} />
          <Route path="/login/password_reset/:id/:token" element={<PasswordReset />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotels" element={<HotelsList />} />
          {/* the : serve to add a parameter to use it to fetch data from db */}
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
