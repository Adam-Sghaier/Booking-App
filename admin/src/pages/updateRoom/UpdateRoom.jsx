import "./updateRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";

const UpdateRoom = ({ inputs }) => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [editVisible, setEditVisible] = useState(false);
  const [file, setFile] = useState("");
  const { data,reFetch } = useFetch(`/users/${id}`);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState({});
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
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
    let idImg, updatedUser;
    try {
      let formData = new FormData();
      formData.append("file", file);
      

      if (file) {
        if (setValue("img")) {
          idImg = setValue("img").split("=")[2];
          console.log(idImg);
          const { data } = await axios.delete(`/auth/delete/${idImg}`);
          console.log(data);
        }
        const { data } = await axios.post(
          "/auth/uploadtogoogledrive",
          formData
        );
        idImg = data.response.data.id;
        const url = `https://drive.google.com/uc?export=view&id=${idImg}`;
        updatedUser = { ...info, img: url };
      } else {
        updatedUser = { ...info };
      }

      if (Object.entries(updatedUser).length > 0) {
        const res = await axios.put(`/users/${id}`, updatedUser);
        console.log(res.data);
        setMessage("User Successfully Updated");
        setIsSuccessAlertVisible(true);
        setTimeout(() => {
          setIsSuccessAlertVisible(false);
        }, 3000);
        reFetch();
      } else {
        setError("change at least 1 elt to update");
        setIsErrorAlertVisible(true);
        setTimeout(() => {
          setIsErrorAlertVisible(false);
        }, 3000);
      }
    } catch (error) {
      setError(error.response.data.message);
      setIsErrorAlertVisible(true);

      setTimeout(() => {
        setIsErrorAlertVisible(false);
      }, 3000);
      if (file) {
        const { data } = await axios.delete(`/auth/delete/${idImg}`);
        console.log(data);
      }
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
                      placeholder={
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
                {isErrorAlertVisible && (
                  <div className="error_msg">{error}</div>
                )}
                {isSuccessAlertVisible && (
                  <div className="success_msg">{message}</div>
                )}
                <button onClick={handleClick}>Send</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateRoom;
