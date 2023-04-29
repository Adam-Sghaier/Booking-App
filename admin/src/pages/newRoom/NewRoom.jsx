import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

const NewRoom = () => {
  const { data, loading } = useFetch(`/hotels`);
  const [hotelId, setHotelId] = useState(undefined);
  const [roomsNumber, setRoomsNumber] = useState(undefined);
  const [info, setInfo] = useState({});
  const [errorR, setErrorR] = useState("");
  const [isErrorRAlertVisible, setIsErrorRAlertVisible] = useState(false);
  const [isSuccessRAlertVisible, setIsSuccessRAlertVisible] = useState(false);
  const [messageR, setMessageR] = useState("");
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    let roomNumbers = [];

    try {
      for (let i = 0; i < roomsNumber; i++) {
        roomNumbers.push({ number: i + 1 });
      }

      const newRoom = { ...info, roomNumbers, hotelId };
      const { data } = await axios.post(`/rooms`, newRoom);
      setMessageR(data);
      setIsSuccessRAlertVisible(true);
      setTimeout(() => {
        setIsSuccessRAlertVisible(false);
      }, 3000);
    } catch (error) {
      setErrorR(error.response.data.message); 
      setIsErrorRAlertVisible(true);
      setTimeout(() => {
        setIsErrorRAlertVisible(false);
      }, 3000);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    id={input.id}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Choose a Hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => {
                    setHotelId(e.target.value);
                    console.log(hotelId);
                  }}
                >
                  {loading
                    ? "Loading"
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <div className="formInput">
                <label>Choose number of rooms</label>
                <input
                  type="number"
                  placeholder="3"
                  onChange={(e) => setRoomsNumber(e.target.value)}
                />
              </div>
              {isErrorRAlertVisible && (
                <div className="error_msg">{errorR}</div>
              )}
              {isSuccessRAlertVisible && (
                <div className="success_msg">{messageR}</div>
              )}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
