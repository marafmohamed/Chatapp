import React, { useEffect, useState } from "react";
import { createContext, useReducer } from "react";
import io from "socket.io-client";
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, {
    user: null,
  });
  const ENDPOINT = "http://localhost:3000";
  const [chats, setChats] = useState([]);
  const [load, setLoad] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [socket, setSocket] = useState(io(ENDPOINT));
  const [isNewNotification, setisNewNotification] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    const GetChats = async () => {
      const obj = JSON.parse(localStorage.getItem("user"));
      let token = null;
      if (obj) {
        token = obj.token;
      }
      if (token) {
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        response.json().then((res) => {
          setChats(res);
        });
      }
    };
    socket.on("received", (newMessageReceived) => {
      GetChats();
    });
  });
  useEffect(() => {
    setLoad(true);
    const U = JSON.parse(localStorage.getItem("user"));
    if (U) {
      dispatch({ type: "LOGIN", payload: U });
    }
    setLoad(false);

    const GetChats = async () => {
      setLoadingChats(true);
      const obj = JSON.parse(localStorage.getItem("user"));
      let token = null;
      if (obj) {
        token = obj.token;
      }
      if (token) {
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        response.json().then((res) => {
          setChats(res);
        });
      }
      setLoadingChats(false);
    };
    return () => {
      GetChats();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...user,
        dispatch,
        load,
        chats,
        setChats,
        loadingChats,
        ENDPOINT,
        socket,
        setSocket,
        setisNewNotification,
        isNewNotification,
        messages,
        setMessages,
        notification,
        setNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
