import styles from "./passwordReset.module.css";
import { useEffect, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PasswordReset = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const param = useParams();
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    const verifyUrl = async () => {
      try {
        const res = await axios.get(
          `/resetpass/verify/${param.id}/${param.token}`
        );
        console.log(res.data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [param]);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `/resetpass/reset/${param.id}/${param.token}`,
        { password }
      );
      const message = data.message;
      navigate("/login", { state: { message } });
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);

      setIsErrorAlertVisible(true);
      setTimeout(() => {
        setIsErrorAlertVisible(false);
      }, 3000);
    }
  };

  return (
    <Fragment>
      {validUrl ? (
        <div className={styles.container}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Add New Password</h1>
            <div className={styles.passwordInput}>
              <input
                type={passwordType}
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className={styles.input}
              />
              <button type="button" onClick={togglePassword}>
                {passwordType === "password" ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
            {isErrorAlertVisible && (
              <div className={styles.error_msg}>{error}</div>
            )}

            <button type="submit" className={styles.blue_btn} disabled={loading}>
              Submit
            </button>
          </form>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </Fragment>
  );
};

export default PasswordReset;
