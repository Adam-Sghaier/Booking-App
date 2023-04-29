import useFetch from "../../hooks/useFetch";
import "./cities.css";

const Cities = () => {
  const { data, loading, error } = useFetch(
    "/hotels/get/countbycity?cities=Hammamet,Sousse,Monastir"
  );

  return (
    <div className="cities">
      {loading ? ("Loading please wait") :(
        <>
          <div className="cityItem" key={1}>
            <img
              src="https://t-cf.bstatic.com/xdata/images/city/540x270/654396.webp?k=dbdfc0888b130425ba0b1f187b1319db0f7ef0b05ab6b4e2d6cf29d500708f78&o="
              alt=""
              className="cityImg"
            />

            <div className="cityInfo">
              <div className="cityTitle">
                <h1>Hammamet</h1>
                <img
                  src="https://t-cf.bstatic.com/static/img/flags/24/tn/9078c1bc028b21e98758546a07ba80cb06c73097.png"
                  alt=""
                />
              </div>
              <h2>{data[0]} properties</h2>
            </div>
          </div>
          <div className="cityItem" key={2}>
            <img
              src="https://t-cf.bstatic.com/xdata/images/city/540x270/654465.webp?k=e986e4c928c7135f9195b209f97f430b5abeb12de717a5c2ac02d850befb8018&o="
              alt=""
              className="cityImg"
            />
            <div className="cityInfo">
              <div className="cityTitle">
                <h1>Sousse</h1>
                <img
                  src="https://t-cf.bstatic.com/static/img/flags/24/tn/9078c1bc028b21e98758546a07ba80cb06c73097.png"
                  alt=""
                />
              </div>
              <h2>{data[1]} properties</h2>
            </div>
          </div>
          <div className="cityItem" key={3}>
            <img
              src="https://t-cf.bstatic.com/xdata/images/city/540x270/654411.webp?k=2cb0c76c103ef53ca3a05174a1d9bbc3026684df0a659263f747ff53cfc50e11&o="
              alt=""
              className="cityImg"
            />
            <div className="cityInfo">
              <div className="cityTitle">
                <h1>Monastir</h1>
                <img
                  src="https://t-cf.bstatic.com/static/img/flags/24/tn/9078c1bc028b21e98758546a07ba80cb06c73097.png"
                  alt=""
                />
              </div>
              <h2>{data[2]} properties</h2>
            </div>
          </div>
        </>)
      }
    </div>
  );
};

export default Cities;
