import React, { useEffect } from "react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
export default function Notification({ realChat }) {
  const chatId=useParams();
  const {
    isNewNotification,
    setisNewNotification,
    socket,
    messages,
    setMessages,
    notification,
    setNotification
  } = useAuth();
  
  const [appear, setAppear] = useState(false);
  const handleClickNotification = () => {
    setisNewNotification(false);
    setAppear(!appear);
  };
  useEffect(() => {
    console.log("this is notica: ", notification);
  }, [notification]);

  return (
    <div className="relative">
      {isNewNotification && (
        <div className=" absolute w-3 h-3 bg-red-700 rounded-full right-0"></div>
      )}
      <svg
        onClick={() => {
          handleClickNotification();
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 hover:cursor-pointer hover:text-gray-200"
      >
        <path
          fillRule="evenodd"
          d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
          clipRule="evenodd"
        />
      </svg>
      {appear && (
        <div className="absolute  w-96  max-h-[300px]">
          {notification.length !== 0 && (
            <ul className="min-h-[100px] w-60">
              {notification.map((message) => {
                return (
                  <li className="w-[90%] h-7 py-2 flex items-center">
                    <div className="avatar">
                      <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-semibold text-gray-200">
                        {message.content}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
