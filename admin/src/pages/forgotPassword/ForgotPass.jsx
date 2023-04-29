import axios from "axios";
import { useState } from "react";
import styles from "./forgotPass.module.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isErrorAlertVisible, setIsErrorAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `/resetPass/send`;
      const { data } = await axios.post(url, { email });
      setMsg(data.message);
      setLoading(false);
      setError("");
      setIsSuccessAlertVisible(true);
      setTimeout(() => {
        setIsSuccessAlertVisible(false);
      }, 3000);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setLoading(true);
        setError(error.response.data.message);
        setLoading(false);
        setIsErrorAlertVisible(true);
        setTimeout(() => {
          setIsErrorAlertVisible(false);
        }, 3000);
        setMsg("");
      }
    }
  };
  return (
    <div className={styles.container}>
      <form className={styles.form_container} onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        {isErrorAlertVisible && <div className={styles.error_msg}>{error}</div>}
        {isSuccessAlertVisible && (
          <div className={styles.success_msg}>{msg}</div>
        )}
        <button type="submit" disabled={loading} className={styles.blue_btn}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPass;
