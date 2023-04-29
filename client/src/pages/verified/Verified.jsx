import { useState } from "react";
import styles from "./verified.module.css";
import check_mark from "../../images/check-mark.png";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const Verified = () => {
  // manage the url state
  const [validUrl, setValidUrl] = useState(false);
  const params = useParams();
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const res= await axios.get(`/auth/verify/${params.id}/${params.token}`);
        console.log(res.data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [params]);
  return (
    <>
      {validUrl ? (
        <div className={styles.container}>
          <img
            src={check_mark}
            alt="success_img"
            className={styles.success_img}
          />
          <h1>Email Verified Successfully</h1>

          <Link to="/login">
            <button className={styles.blue_btn}>Login</button>
          </Link>
        </div>
      ) : (
        <h1>404 not found </h1>
      )}
    </>
  );
};

export default Verified;
