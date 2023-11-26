import { useState } from "react";
import useAuth from "./useAuth";
const useLogin = () => {
  const [Error, setError] = useState(null);
  const [Lauding, setLauding] = useState(false);
  const {user , dispatch}=useAuth()

  const Login = async (email, password) => {
    setLauding(true);
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
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
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({type:'LOGIN', payload:json});
      setLauding(false);
    }
    return json;
  };
  return { Error, Login, Lauding };
};

export default useLogin;
