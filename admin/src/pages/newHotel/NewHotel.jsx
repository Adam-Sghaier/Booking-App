import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { hotelInputs } from "../../formSource";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [errorH, setErrorH] = useState("");
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const { loading, dispatch } = useContext(AuthContext);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  // because files is an object we've transformed it to an array using Object.values(files)due to the reason that promise.all accepts an array
  const resizeTextArea = (e) => {
    e.target.style.height = "30px";
    // scroll height is the entire height of an elt including padding only
    // scrollHeight=actual height+non visible elts height+padding top and bottom
    let scHeight = e.target.scrollHeight;
    e.target.style.height = `${scHeight}px`;
  };
  const handleClick = async (e) => {
    e.preventDefault();
    let photosU = [];
    dispatch({ type: "LOGIN_START" });
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          let formData = new FormData();
          formData.append("file", file);
          const { data } = await axios.post(
            "/auth/uploadtogoogledrive",
            formData
          );
          const url = `https://drive.google.com/uc?export=view&id=${data.response.data.id}`;
          photosU.push(data.response.data.id);
          return url;
        })
      );

      const newHotel = { ...info, photos: list };
      const res = await axios.post("/hotels", newHotel);
      setMessage(res.data);
      dispatch({ type: "LOGIN_FAILURE" });
      setIsSuccessAlertVisible(true);
      setTimeout(() => {
        setIsSuccessAlertVisible(false);
      }, 3000);
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      if (photosU.length > 0) {
        const response = await Promise.all(
          photosU.map(async (id) => {
            const { data } = await axios.delete(`/auth/delete/${id}`);
            return data;
          })
        );
        console.log(response);
        setMessage("Photos Succesfully Deleted");
        setIsDeleteAlertVisible(true);
        setTimeout(() => {
          setIsDeleteAlertVisible(false);
        }, 2500);
      }
      setErrorH(error.response.data.message);
      setIsErrorAlertVisible(true);
      setTimeout(() => {
        setIsErrorAlertVisible(false);
      }, 5000);
    }
  };
  // const handleSelect = (e) => {
  //   const value = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   console.log(value);
  //   setRooms(value);
  // };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {files === "" ? (
              <img
                src={
                  files
                    ? URL.createObjectURL(files[0])
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
            ) : (
              <div className="photosContainer">
                {Object.values(files).map((file) => (
                  <img
                    src={
                      files
                        ? URL.createObjectURL(file)
                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    }
                    alt=""
                  />
                ))}
              </div>
            )}
             {isDeleteAlertVisible && <div className="delete_msg">{message}</div>}
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
                    setFiles(e.target.files);
                  }}
                  style={{ display: "none" }}
                  multiple
                  required
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.id === "title" ||
                  input.id === "desc" ||
                  input.id === "address" ? (
                    <textarea
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      id={input.id}
                      onKeyUp={(e) => resizeTextArea(e)}
                      required
                    ></textarea>
                  ) : (
                    <input
                      onChange={handleChange}
                      type={input.type}
                      id={input.id}
                      required
                    />
                  )}
                </div>
              ))}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              {isErrorAlertVisible && <div className="error_msg">{errorH}</div>}
              {isSuccessAlertVisible && (
                <div className="success_msg">{message}</div>
              )}
              <button disabled={loading} onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
