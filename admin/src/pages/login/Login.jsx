import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { isNullOrUndefined } from "url/util";
const Login = () => {
  const location = useLocation();
  const s_message = location.state?.message;
  
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const { loading, error, dispatch } = useContext(AuthContext);
  const isNull = isNullOrUndefined(s_message); 
  useEffect(()=>{
    setIsSuccessAlertVisible(true);
        setTimeout(() => {
          setIsSuccessAlertVisible(false);
        }, 3000);
  },[isNull])
  // updating the state value using the id of target input
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // or setCredentials((prev)=>{return{...prev,[e.target.id]:e.target.value}})
  };

  const navigate = useNavigate();
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const handleSubmit = async (e) => {
    // to prevent to page refresh
    e.preventDefault();
    // update the INITAL_STATE
    dispatch({ type: "LOGIN_START" });
    try {
      // post data to api server
      const res = await axios.post("/auth/login", credentials);
      // update the state data
      if (res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: "You are not allowed!" });
        setIsErrorAlertVisible(true);
        setTimeout(() => {
          setIsErrorAlertVisible(false);
        }, 3000);
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data.message });
      // send error to auth context
      setIsErrorAlertVisible(true);
      setTimeout(() => {
        setIsErrorAlertVisible(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.login_container}>
      {s_message !== undefined && isSuccessAlertVisible && (<div className={styles.success_alert}>{s_message}</div> )}
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <div className={styles.passwordInput}>
              <input
                type={passwordType}
                placeholder="Password"
                name="password"
                onChange={handleChange}
                required
                className={styles.input}
              />
              <button type="button" onClick={togglePassword}>
                {passwordType === "password" ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
            <Link
              to="/login/forgot_password"
              style={{ alignSelf: "flex-start" }}
            >
              <p style={{ padding: "0 15px" }}>Forgot Password ?</p>
            </Link>
            {isErrorAlertVisible && (
              <div className={styles.error_msg}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.blue_btn}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
