import "./searchItem.css";
import { Link } from "react-router-dom";
const SearchItem = ({ item }) => {
  return (
    <div className="sItem">
      <img src={item.photos[0]} alt="" className="siImg" />

      <div className="sDesc">
        <h1 className="sTitle">{item.name}</h1>
        <span className="siDistance">
          {item.distance} km from centre . Beach nearby
        </span>
        <div className="specialFeatures">Breakfast included</div>
        <span className=" siSubtitle ">Deluxe Double Room with Shower</span>
        <span className=" siFeatures ">{item.desc}</span>
        <span className=" siCancelOp "> Free cancellation </span>
        <span className=" siCancelOpSubtitle ">
          You can cancel later , so lock in this great price today !
        </span>
      </div>

      <div className="sDetails">
        {item.rating && (
          <div className="sRating">
            <span className="srTitle">Superb</span>
            <button className="srBtn">{item.rating}</button>
          </div>
        )}

        <div className="sPriceDetails">
          <span className="sPrice">TND {item.cheapestPrice}</span>
          <span className="sPriceSubtitle">Includes taxes and fees</span>
          <Link to={`/hotels/${item._id}`}>
          <button className="siAvButton">See availability</button>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
