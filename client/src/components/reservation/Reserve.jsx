import "./reserve.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      // if the checkbox is checked , it's added to rest of selected rooms , else we gonna pull the elt from the array using filter function
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let list = [];
    // we can compare two dates directly using comparison signs
    while (start <= end) {
      list.push(new Date(start).getTime());
      start.setDate(start.getDate() + 1);
    }

    return list;
  };
  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);
  
  const isAvailable = (roomNumber) => {
    // A function that accepts up to three arguments. The some method calls the predicate(1st parameter) function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.
    const isFound = roomNumber.unavailableDates.some((date) => {
      return allDates.includes(new Date(date).getTime());
    });

    return !isFound;
  };

  const navigate =useNavigate();
  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: allDates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select Your Room</span>
        {loading
          ? " Please Wait"
          : data.map((item) => (
              <div className="rItem">
                <div className="rItemInfo">
                  <div className="rTitle">{item.title}</div>
                  <div className="rDesc">{item.desc}</div>
                  <div className="rMax">
                    Max People : <b>{item.maxPeople}</b>
                  </div>
                  <div className="rPrice">{item.price}</div>
                </div>
                <div className="rSelectRooms">
                  {item.roomNumbers.map((roomNumber) => (
                    <div className="room">
                      <label>{roomNumber.number}</label>
                      <input
                        type="checkbox"
                        value={roomNumber._id}
                        onChange={handleSelect}
                        disabled={!isAvailable(roomNumber)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
