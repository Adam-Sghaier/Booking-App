import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import UpdateUser from "./pages/updateUser/UpdateUser";
import NewUser from "./pages/newUser/NewUser";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { hotelInputs, roomInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { hotelColumns, roomColumns, userColumns } from "./datatablesource";
import NewHotel from "./pages/newHotel/NewHotel";
import NewRoom from "./pages/newRoom/NewRoom";
import axios from "axios";
import UpdateHotel from "./pages/updateHotel/UpdateHotel";
import UpdateRoom from "./pages/updateRoom/UpdateRoom";
import { useCookies } from 'react-cookie';
import ForgotPass from "./pages/forgotPassword/ForgotPass";
import PasswordReset from "./pages/passwordReset/PasswordReset";


function App() {
  const { darkMode } = useContext(DarkModeContext);


  // protected route used to wrap these routes inordre to add a security layer to the app
  // the children here related to app routes
  // for example we gonna wrap the home components so if we are not the admin we are not eligible to access this route
  const ProtectedRoute = ({ children }) => {

    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const { user, dispatch } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }

    const verifyAdmin = async () => {
      try {
        await axios.get("/users/admin");
      } catch (error) {
        if (error.response.status === 404) {
          removeCookie('access_token');
          dispatch({ type: "LOGOUT" });
        }

      }
    };

    verifyAdmin();

    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login">
              <Route index element={<Login />} />
              <Route path="forgot_password" element={<ForgotPass />} />
              <Route path="password_reset/:id/:token" element={<PasswordReset />} />
            </Route>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={userColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    <UpdateUser inputs={userInputs} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewUser inputs={userInputs} title="Add New User" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="hotels">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={hotelColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":hotelId"
                element={
                  <ProtectedRoute>
                    <UpdateHotel inputs={hotelInputs} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewHotel />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="rooms">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={roomColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":roomId"
                element={
                  <ProtectedRoute>
                    <UpdateRoom inputs={roomInputs} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRoom />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
