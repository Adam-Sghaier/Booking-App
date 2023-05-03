import "./newUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const NewUser = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [addState, setAddState] = useState("");
  const [message, setMessage] = useState("");
  const { loading, dispatch } = useContext(AuthContext);
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const handleClick = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file);
    dispatch({ type: "LOGIN_START" });
    try {
      if (file.length === 0) {
        setMessage("Image required");
        setAddState("Image required");
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 1500);
      }

      const res = await axios.post("/auth/register", { ...info });

      if (res) {
        const { data } = await axios.post(
          "/auth/uploadtogoogledrive",
          formData
        );
        const id = data.response.data.id;
        const url = `https://drive.google.com/uc?export=view&id=${id}`;
        setMessage("Image Uploaded");
        setAddState("image_uploaded");
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
        await axios.put(`/users/${res.data.id}`, { img: url });
        dispatch({ type: "LOGIN_FAILURE" });
        setAddState("user_added");
        setMessage(res.data.admin);
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        dispatch({ type: "LOGIN_FAILURE" });
        setAddState("error_validation");
        setMessage(error.response.data.message);
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 2000);
      }, 1600);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
            {addState === "image_uploaded" && isAlertVisible && (
              <div className="success_msg">{message}</div>
            )}
            {addState === "Image required" && isAlertVisible && (
              <div className="error_msg">{message}</div>
            )}
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
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

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={
                      input.label === "Password" ? passwordType : input.type
                    }
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                  {input.label === "Password" && (
                    <button
                      type="button"
                      className="pButton"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </button>
                  )}
                </div>
              ))}
              {addState === "error_validation" &&isAlertVisible && (
                <div className="error_msg">{message}</div>
              )}
              {addState === "user_added" && isAlertVisible && (
                <div className="success_msg">{message}</div>
              )}
              <button onClick={handleClick} disabled={loading}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
