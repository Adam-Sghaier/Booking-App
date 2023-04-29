import "./hotel.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reservation/Reserve";

const Hotel = () => {
  const location = useLocation();
  const [sliderNumber, setSliderNumber] = useState(0);
  const [openSlider, setOpenSlider] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const id = location.pathname.split("/")[2];
   
  const { data, loading } = useFetch(`/hotels/${id}`);
  const { user } = useContext(AuthContext);
  const { dates, options } = useContext(SearchContext);
  
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    // getTime method returns a a number representing the milliseconds elapsed between 1 January 1970 00:00:00 UTC and the given date.
    const timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0]?.endDate, dates[0]?.startDate);

  const handleOpen = (i) => {
    setSliderNumber(i);
    setOpenSlider(true);
  };
 
  const handleImage = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber = sliderNumber === 0 ? 5 : sliderNumber - 1;
    } else {
      newSlideNumber = sliderNumber === 5 ? 0 : sliderNumber + 1;
    }
    setSliderNumber(newSlideNumber);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    }else{
      navigate("/login");
    }
  };

  return (
    <div style={{ margin: -8 }}>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "Loading"
      ) : (
        <div className="hotelItemContainer">
          {openSlider && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpenSlider(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleImage("l")}
              />
              <div className="sliderImgWrapper">
                <img
                  src={data.photos[sliderNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleImage("r")}
              />
            </div>
          )}
          <div className="hotelItemWrapper">
            <button className="hotelBookBtn" onClick={handleClick}> Reserve or Book Now!</button>
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelLocation">
              <FontAwesomeIcon icon={faLocationDot} />
              <span className="hLTitle">{data.address}</span>
            </div>
            <span className="hotelLoFeatures">
              Excellent location: {data.distance} m from Hammamet Beaches
            </span>
            <span className="hotelSpecFeatures">
              You're eligible for a Genius discount! , to save at this property
              , all you have to do is sign in.
            </span>
            <div className="hotelImages">
              {/* Calls a defined callback function on each element of an array, and returns an array that contains the results */}
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper">
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDesc">
              <div className="hDescText">
                <h1 className="hotelDescTitle">{data.title}</h1>
                <div className="hfullDesc">
                  <p>{data.desc}</p>
                </div>
              </div>
              <div className="hotelHighlights">
                <h1>Perfect for a {days}-night stay!</h1>
                <div className="feature">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>Top location: Highly rated by recent guests (9.4)</span>
                </div>

                <h2>
                  <b>TND {data.cheapestPrice * days * options.room}</b> ({days}
                   Nights)
                </h2>

                <button className="BookBtn" onClick={handleClick}>
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
    </div>
  );
};

export default Hotel;
