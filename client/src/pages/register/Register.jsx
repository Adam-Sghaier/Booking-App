import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import styles from "./register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const Register = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    country: undefined,
    city: undefined,
    phone: undefined,
    password: undefined,
  });
  const [passwordType, setPasswordType] = useState("password");
  const [file, setFile] = useState("");
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [message, setMessage] = useState("");
  const { loading, error, dispatch } = useContext(AuthContext);
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  // updating the state value using the id of target input
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // or setCredentials((prev)=>{return{...prev,[e.target.id]:e.target.value}})
  };

  const handleSubmit = async (e) => {
    // to prevent page refresh
    e.preventDefault();
    let id;
    let formData = new FormData();
    formData.append("file", file);
    // update the INITAL_STATE
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/uploadtogoogledrive", formData);
      id = res.data.response.data.id;
      const url = `https://drive.google.com/uc?export=view&id=${id}`;

      const newUser = { ...credentials, img: url };
      // post data to api server
      const { data } = await axios.post("/auth/register", newUser);
      dispatch({ type: "LOGOUT" });
      setMessage(data.user);
      setIsSuccessAlertVisible(true);
      setTimeout(() => {
        setIsSuccessAlertVisible(false);
      }, 3000);
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      if (id) {
        const { data } = await axios.delete(`/auth/delete/${id}`);
        setMessage(data);
        setIsDeleteAlertVisible(true);
        setTimeout(() => {
          setIsDeleteAlertVisible(false);
        }, 2000);
      }
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.message });
      setIsErrorAlertVisible(true);
      setTimeout(() => {
        setIsErrorAlertVisible(false);
      }, 4000);
    }
  };

  return (
    <div className={styles.register_container}>
      <div className={styles.register_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Login
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className={styles.photo_container}>
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
              <div className={styles.formInput}>
                <label htmlFor="file">
                  <DriveFolderUploadOutlinedIcon className={styles.icon} />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                />
              </div>
              {isDeleteAlertVisible && <div className={styles.delete_msg}>{message}</div>}
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Country"
              name="country"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Phone Number"
              name="phone"
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

            {isErrorAlertVisible && (
              <div className={styles.error_msg}>{error}</div>
            )}
            {isSuccessAlertVisible && (
              <div className={styles.success_msg}>{message}</div>
            )}
            <button
              type="submit"
              className={styles.blue_btn}
              disabled={loading}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
