import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faPlane,
  faCar,
  faTaxi,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { useContext, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {SearchContext}  from "../../context/SearchContext";

const Header = ({ type }) => {
  const [alertOpen,setIsAlertOpen] = useState(false);
  //hook for the destination
  const [destination, setDestination] = useState("");
  // hook for the calendar opening and closing
  const [openDate, setOpenDate] = useState(false);
  // hook for the date range component
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  // The useNavigate hook returns a function that lets you navigate programmatically
  const navigate = useNavigate();
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        // if operation equals to increment , the value increments else it decrements
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
        // when clicking the + or - button the function will take the previous state , check the name and basing on the operation it modifies the value
      };
    });
  };

  const{dispatch}= useContext(SearchContext);
  // we can redirect our user to any page
  // the navigate function has two parameters the route target and the state (containing the data the we want to send )
  const handleSearch = () => {
    if(dates[0].startDate.getTime() === dates[0].endDate.getTime()){
      setIsAlertOpen(true);
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 3000);
      return ;
    }
    dispatch({type:"NEW_SEARCH",payload:{destination,dates,options}});
    navigate("/hotels", { state: { destination, dates, options } });
  };
  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car Rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span>Attractions</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airports Taxis</span>
          </div>
        </div>
        {/* the jsx fragment (<></>) is used to wrap jsx element */}
        {type !== "list" && (
          <>
            <h1 className="headerTitle">Find your next stay</h1>
            <p className="HeaderDesc">
              Search low prices on hotels, homes and much more..
            </p>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  placeholder="where are you going?"
                  className="headerSearchInput"
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                {/* on event handlings such as onClick , we should use the arrow function syntax to avoid the different callbacks during re-renderings or we should bind the function with this keyword which refers to the component*/}
                {/* format function takes two parameters the date and the date display format  */}
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >
                  {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(
                    dates[0].endDate,
                    "dd/MM/yyyy"
                  )}`}
                </span>

                {/* conditionnal rendering if openDate is true then show the dateRange component */}
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    ranges={dates}
                    minDate={new Date()}
                    // this attribute dissallows us (in this case to select previous date)
                    className="date"
                  />
                )}
              </div>

              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >
                  {`${options.adult}`} adult {`${options.children}`} children
                  {`${options.room}`} room
                </span>
                {openOptions && (
                  <div className="options">
                    <div className="option">
                      <span className="optionTitle">Adults</span>
                      <div className="optionCounter">
                        
                        <button
                          className="optionCounterButton"
                          onClick={() => {
                            handleOption("adult", "d");
                          }}
                          disabled={options.adult <= 1}
                        >
                          -
                        </button>
                        <span>{options.adult}</span>
                        <button
                          className="optionCounterButton"
                          onClick={() => {
                            handleOption("adult", "i");
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="option">
                      <span className="optionTitle">Children</span>
                      <div className="optionCounter">
                        <button
                          className="optionCounterButton"
                          onClick={() => {
                            handleOption("children", "d");
                          }}
                          disabled={options.children <= 0}
                        >
                          -
                        </button>
                        <span>{options.children}</span>
                        <button
                          className="optionCounterButton"
                          onClick={() => {
                            handleOption("children", "i");
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="option">
                      <span className="optionTitle">Rooms</span>
                      <div className="optionCounter">
                        <button
                          className="optionCounterButton"
                          onClick={() => {
                            handleOption("room", "d");
                          }}
                          disabled={options.room <= 1}
                        >
                          -
                        </button>
                        <span>{options.room}</span>
                        <button
                          className="optionCounterButton"
                          onClick={() => {
                            handleOption("room", "i");
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {alertOpen && <div className="alertOne"> Two different dates must be chosen </div>}
    </div>
  );
};

export default Header;
