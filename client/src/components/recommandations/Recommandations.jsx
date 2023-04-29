import "./recommandations.css";
import useFetch from "../../hooks/useFetch.js";
const Recommandations = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=4");
  return (
    <div className="recomList">
      {loading ? (
        "Loading "
      ) : (
        <>
          {data.map((item) => (
            <div className="recomItem">
              <img src={item.photos[0]} alt="" className="recomImg" />
              <span className="recomName">{item.name}</span>
              <span className="recomCity">{item.city}</span>
              <span className="recomPrice">
                Starting from {item.cheapestPrice} TND
              </span>
              {item.rating && (
                <div className="recomRating">
                  <button>{item.rating}</button>
                  <span>Excellent</span>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Recommandations;
