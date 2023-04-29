import styles from "./updateHotel.module.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import deleteIcon from "../../images/icon.png";
const UpdateHotel = ({ inputs }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/")[2];
  const [editVisible, setEditVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const { data, reFetch } = useFetch(`/hotels/${id}`);
  const res = useFetch(`/hotels/${id}/rooms`);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState({});
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const setValue = (idKey) => {
    let value;
    const entries = Object.entries(data);
    entries.map(([key, val]) => {
      if (key === idKey) {
        value = val;
      }
      return value;
    });
    return value;
  };

  const deleteRoom = async (roomId, hotelId) => {
    try {
      const { data } = await axios.delete(`/rooms/${roomId}/${hotelId}`);
      console.log(data);
      res.reFetch();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteImg = async (i) => {
    const imgSrc = document.getElementById(`img${i}`).getAttribute("src");
    if(!Array(data.photos).includes(imgSrc)){
      console.log("cannot delete unuploaded image");
    }else{
      const imgId = imgSrc.split("=")[2];
    
    console.log(imgId);
    console.log(imgSrc);

    try {
      const { data } = await axios.delete(`/auth/delete/${imgId}`);
      console.log(data);
      if (data) {
        const body = { imgSrc: imgSrc };
        const res = await axios.put(`/hotels/${id}/photo`, body);
        console.log(res.data);
        reFetch();
        // create endpoint for deleting img sources from photos array
      }
    } catch (err) {
      console.log(err);
    }
    }
    
  };

  const setPreview = (e, i) => {
    const imgSrc = e.target.files[0];
    document
      .getElementById(`img${i}`)
      .setAttribute("src", URL.createObjectURL(imgSrc));
    files.push(imgSrc);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let updatedHotel;
    let photosU = [];
    try {
      if (files.length !== 0) {
        const list = await Promise.all(
          files.map(async (file) => {
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

        updatedHotel = { ...info, photos: list };
      } else {
        updatedHotel = { ...info };
        console.log(updatedHotel);
      }

      if (Object.entries(updatedHotel).length > 0) {
        const res = await axios.put(`/hotels/${id}`, updatedHotel);
        console.log(res.data);
        setMessage("Hotel Successfully Updated");
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
      if (photosU.length > 0) {
        const response = await Promise.all(
          photosU.map(async (id) => {
            const { data } = await axios.delete(`/auth/delete/${id}`);
            return data;
          })
        );
        console.log(response);
      }
    }
  };
  return (
    <div className={styles.single}>
      <Sidebar />
      <div className={styles.singleContainer}>
        <Navbar />

        <div className={styles.top}>
          <div
            className={styles.editButton}
            onClick={() => {
              setEditVisible(true);
            }}
          >
            Edit
          </div>
          <h1 className={styles.title}>Information</h1>
          <div className={styles.item}>
            {/* <img
              src={ "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
              alt=""
              className="itemImg"
            /> */}
            <div className={styles.details}>
              <h1 className={styles.itemTitle}>{data.name}</h1>
              <div className={styles.detailItem}>
                <span className={styles.itemKey}>Type:</span>
                <span className={styles.itemValue}>{data.type}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.itemKey}>City:</span>
                <span className={styles.itemValue}>{data.city}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.itemKey}>Address:</span>
                <span className={styles.itemValue}>{data.address}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.itemKey}>City:</span>
                <span className={styles.itemValue}>{data.city}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.itemKey}>Title:</span>
                <span className={styles.itemValue}>{data.title}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.itemKey}>Description:</span>
                <span
                  className={styles.itemValue}
                  style={{ lineHeight: "25px" }}
                >
                  {data.desc}
                </span>
              </div>
              <div className={styles.hotelImages}>
                {data.photos?.map((photo, i) => (
                  <div className={styles.hotelImgWrapper} key={i}>
                    <img src={photo} alt="" className={styles.hotelImg} />
                  </div>
                ))}
              </div>
              <h1 className={styles.itemTitle}>Rooms</h1>
              <div className={styles.rooms}>
                {res.data?.map((room) => (
                  <div className={styles.roomItemWrapper}>
                    <div className={styles.detailItem}>
                      <span className={styles.itemKey}>Title:</span>
                      <span className={styles.itemValue}>{room.title}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.itemKey}>Description:</span>
                      <span className={styles.itemValue}>{room.desc}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.itemKey}>
                        Max People for single room:
                      </span>
                      <span className={styles.itemValue}>{room.maxPeople}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.itemKey}>Price:</span>
                      <span className={styles.itemValue}>{room.price} TND</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.itemKey}>
                        Identical rooms number:
                      </span>
                      <span className={styles.itemValue}>
                        {room.roomNumbers.length}
                      </span>
                    </div>
                    <div className={styles.buttons}>
                      <button
                        onClick={() => {
                          navigate(`/rooms/${room._id}`);
                        }}
                      >
                        Update {room.title}
                      </button>
                      <button
                        onClick={() => {
                          deleteRoom(room._id, id);
                        }}
                        style={{ backgroundColor: "red" }}
                      >
                        Delete {room.title}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {editVisible && (
          <div className={styles.bottom}>
            <h1 className={styles.title}>Edit Hotel</h1>
            <div className={styles.left}>
              {data.photos?.map((imgSrc, i) => (
                <div className={styles.imgWrapper} key={i}>
                  <img
                    src={imgSrc}
                    id={`img${i}`}
                    alt=""
                    className={styles.img}
                  />
                  <div className={styles.formInput} style={{ gap: "50px" }}>
                    <div>
                      <label htmlFor={`file${i}`}>
                        <DriveFolderUploadOutlinedIcon
                          className={styles.icon}
                        />
                      </label>
                      <input
                        type="file"
                        id={`file${i}`}
                        onChange={(e) => setPreview(e, i)}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className={styles.icon} onClick={() => deleteImg(i)}>
                      <img
                        src={deleteIcon}
                        alt=""
                        className={styles.deleteIcon}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.right}>
              <form>
                {inputs.map((input) => (
                  <div className={styles.formInput} key={input.id}>
                    <label>{input.label}</label>
                    {input.id === "title" ||
                    input.id === "desc" ||
                    input.id === "address" ? (
                      <textarea
                        onChange={handleChange}
                        id={input.id}
                        defaultValue={setValue(input.id)}
                      ></textarea>
                    ) : (
                      <input
                        onChange={handleChange}
                        type={input.type}
                        defaultValue={setValue(input.id)}
                        id={input.id}
                      />
                    )}
                  </div>
                ))}
                <div className={styles.formInput}>
                  <label>Featured</label>
                  <select
                    id="featured"
                    onChange={handleChange}
                    defaultValue={data.featured}
                    style={{ width: "55px" }}
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
                {isErrorAlertVisible && (
                  <div className={styles.error_msg}>{error}</div>
                )}
                {isSuccessAlertVisible && (
                  <div className={styles.success_msg}>{message}</div>
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

export default UpdateHotel;
