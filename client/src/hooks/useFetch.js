import { useEffect, useState } from "react";
import axios from "axios";
const useFetch = (url) => {
  // three usestates hooks for(data fetched, loading when the request is in process , error if occurs)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // the useEffect hook accepts two parameters , the callback funtion , and an array of elt(s) that will activate the effect (rerendering) our component(s) if their value change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // get endpoint defined using axios.get() which returns a promise
        const res = await axios.get(url);
        setData(res.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      // get endpoint defined using axios.get()
      const res = await axios.get(url);
      setData(res.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };
  return {data,loading,error,reFetch};
};

export default useFetch;
