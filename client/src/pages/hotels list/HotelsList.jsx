import "./hotelsList.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { format  } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch.js";
import { SearchContext } from "../../context/SearchContext";


const HotelsList = () => {
  //the useLoction hook return Location object containing infos about the current URL
  const {dispatch} = useContext(SearchContext);
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [alertOpen,setIsAlertOpen] = useState(false);
  // we wrap the path in a backtick in order to add js variables using ${}
  const { data, loading, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 1}&max=${max || 3000}`
  );
  // Search button click handler
  const handleClick = () => {
    if(dates[0].startDate.getTime() === dates[0].endDate.getTime()){
      setIsAlertOpen(true);
      setTimeout(() => {
        setIsAlertOpen(false);
      }, 3000);
      return ;
    }
    dispatch({type:"NEW_SEARCH",payload:{destination,dates,options}});
    reFetch();
  };

  const handleChange = (e) => {
    setOptions((prev)=>({...prev,[e.target.id]:e.target.value}));
  };

  return (
    <div style={{ margin: -8 }}>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        {alertOpen && <div className="alert"> two differrent dates must be chosen</div>}
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label htmlFor="">Destination</label>
              <input
                type="text"
                placeholder={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
              />
            </div>
            <div className="lsItem">
              <label htmlFor="">Check-in Date</label>
              <span
                onClick={() => {
                  setOpenDate(!openDate);
                }}
              >
                {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate,"dd/MM/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    setDates([item.selection]);
                  }}
                  minDate={new Date()}
                  ranges={dates}
                  
                />
              )}
              {/* in this case the mindate attribute disallows us to choose any previous date*/}
            </div>
            <div className="lsItem">
              <label htmlFor="">Options</label>
              <div className="lsOptionItem">
                <span className="lsOptionTitle">
                  Min price <small>(per night)</small>
                </span>
                <input
                  type="number"
                  onChange={(e) => {
                    setMin(e.target.value);
                  }}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionTitle">
                  Max price <small>(per night)</small>
                </span>
                <input
                  type="number"
                  onChange={(e) => {
                    setMax(e.target.value);
                  }}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionTitle">Adult</span>
                <input type="number" min={1} id="adult" placeholder={options.adult} onChange={handleChange}/>
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionTitle">Children</span>
                <input type="number" min={0} id="children" placeholder={options.children} onChange={handleChange}/>
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionTitle">room</span>
                <input type="number" min={1} id="room" placeholder={options.room} onChange={handleChange}/>
              </div>
            </div>
            <button className="btnSearch" onClick={handleClick}>
              Search
            </button>
          </div>
          <div className="listResult">
            {loading ? (
              "Please Wait"
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} dates={dates} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsList;
