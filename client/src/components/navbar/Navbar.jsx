import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user,dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleClick = (e)=>{
    dispatch({type:"LOGOUT"});
    
    navigate("/");
  }
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Booking</span>
        </Link>

        {user ? (
          <div className="navItems">
            {user.username}
            <button className="navButton" onClick={handleClick}>Logout</button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
            <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
