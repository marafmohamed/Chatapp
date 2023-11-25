import { useState } from "react";
import useAuth from "./useAuth";
const useSignup = () => {
  const [Error, setError] = useState(null);
  const [Lauding, setLauding] = useState(false);
  const {user , dispatch}=useAuth()
  const Signup = async (name, email, password) => {
    setLauding(true);
    const response = await fetch("http://localhost:3000/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Name: name, Password: password }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json);
      setLauding(false);
      setTimeout(() => {
        setError(null);
      }, 2500);
    }
    if (response.ok) {
      // storing the token in local storage
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({type:'LOGIN', payload:json});
    }
    setLauding(false);
    return json;
  };
  return { Error, Signup, Lauding };
};
export default useSignup;
