const { useState } = require("react");

const useLogin = () => {
  const [Error, setError] = useState(null);
  const [Lauding, setLauding] = useState(false);
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
      setLauding(false);
    }
    return json;
  };
  return { Error, Login, Lauding };
};

export default useLogin;
