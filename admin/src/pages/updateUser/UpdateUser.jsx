import "./updateUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const UpdateUser = ({ inputs }) => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [editVisible, setEditVisible] = useState(false);
  const [file, setFile] = useState("");
  const { data, reFetch } = useFetch(`/users/${id}`);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState({});
  const [updateState, setUpdateState] = useState("");
  const { dispatch, loading } = useContext(AuthContext);

  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(true);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
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
  const setValue = (idKey) => {
    let value;
    const entries = Object.entries(data);
    entries.map(([key, val]) => {
      if (key === idKey) {
        value = val;
      }
    });
    return value;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });
    try {
      if (Object.entries(info).length > 0) {
        await axios.put(`/users/${id}`, info);
      } else if (Object.entries(info).length === 0 && file === "") {
        dispatch({ type: "LOGIN_FAILURE" });
        setError("Change at least 1 property to update");
        setUpdateState("ERROR_VALIDATION");
        setIsErrorAlertVisible(true);
        setTimeout(() => {
          setIsErrorAlertVisible(false);
        }, 3000);
      }

      if (file) {
        let formData = new FormData();
        formData.append("file", file);
        let idImg = setValue("img").split("=")[2];
        await axios.delete(`/auth/delete/${idImg}`);
        setUpdateState("DELETE_RECENT");
        setError("Recent Image deleted");
        setIsErrorAlertVisible(true);
        setTimeout(() => {
          setIsErrorAlertVisible(false);
        }, 2000);

        const { data } = await axios.post(
          "/auth/uploadtogoogledrive",
          formData
        );
        idImg = data.response.data.id;
        setUpdateState("IS_UPLOADED");
        setMessage("New photo Successfully Uploaded");
        setIsSuccessAlertVisible(true);
        setTimeout(() => {
          setIsSuccessAlertVisible(false);
        }, 2000);
        const url = `https://drive.google.com/uc?export=view&id=${idImg}`;
        setTimeout(async () => {
          const res = await axios.put(`/users/${id}`, { img: url });
          setMessage(res.data);
          dispatch({ type: "LOGIN_FAILURE" });
          setUpdateState("IS_UPDATED");
          setIsSuccessAlertVisible(true);
          setTimeout(() => {
            setIsSuccessAlertVisible(false);
          }, 3000);
        }, 2200);
      }

      reFetch();

      if (data.isAdmin) {
        const { username, email, ...otherInfos } = data;
        dispatch({ type: "LOGIN_SUCCESS", payload: { username, email } });
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      setError(error.response.data.message);
      setUpdateState("ERROR_VALIDATION");
      setIsErrorAlertVisible(true);
      setTimeout(() => {
        setIsErrorAlertVisible(false);
      }, 3000);
    }
  };
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />

        <div className="top">
          <div
            className="editButton"
            onClick={() => {
              setEditVisible(true);
            }}
          >
            Edit
          </div>
          <h1 className="title">Information</h1>
          <div className="item">
            <img
              src={data.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
              alt=""
              className="itemImg"
            />
            <div className="details">
              <h1 className="itemTitle">{data.username}</h1>
              <div className="detailItem">
                <span className="itemKey">Email:</span>
                <span className="itemValue">{data.email}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Phone:</span>
                <span className="itemValue">{data.phone}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Country:</span>
                <span className="itemValue">{data.country}</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">City:</span>
                <span className="itemValue">{data.city}</span>
              </div>
            </div>
          </div>
        </div>

        {editVisible && (
          <div className="bottom">
            <h1 className="title">Edit User</h1>
            <div className="left">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : data.img
                    ? data.img
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
              {updateState === "DELETE_RECENT" && isErrorAlertVisible && (
                <div className="error_msg">{error}</div>
              )}
              {updateState === "IS_UPLOADED" && isSuccessAlertVisible && (
                <div className="success_msg">{message}</div>
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
                      defaultValue={
                        input.label !== "Password" ? setValue(input.id) : ""
                      }
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
                {updateState === "ERROR_VALIDATION" && isErrorAlertVisible && (
                  <div className="error_msg">{error}</div>
                )}
                {updateState === "IS_UPDATED" && isSuccessAlertVisible && (
                  <div className="success_msg">{message}</div>
                )}
                <button onClick={handleClick} disabled={loading}>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateUser;
