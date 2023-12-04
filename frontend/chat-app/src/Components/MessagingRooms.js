import React, { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Messeges from "./Messeges";
import Message from "../SmallComponents/Message";
import useMessage from "../hooks/useMessage";
import Notification from "../SmallComponents/Notification";
import io from "socket.io-client";
export default function MessagingRooms() {
  const chatId = useParams();
  const [loading, setLoading] = useState(false);
  const {
    chats,
    user,
    ENDPOINT,
    socket,
    setNotification,
    notification,
    setisNewNotification,
    setMessages,
    messages,
  } = useAuth();

  const [received, setReceived] = useState(false);
  const scrolll = useRef(null);
  const messg = useRef(null);
  const [realChat, setChat] = useState(null);
  const navigate = useNavigate();
  const [ChatName, setChatName] = useState("");
  const [Typing, setTyping] = useState(false);
  const [senderName,setSenderName]=useState('')
  const handleClick = () => {
    console.log("clicked");
  };
  const { sendMessage } = useMessage();

  const handleSendMessage = () => {
    if (messg.current.value === "" || !messg.current.value) {
      return console.log("message can't be empty");
    }
    const messag = {
      chatId: realChat._id,
      content: messg.current.value,
    };
    console.log("this is messag : ", messag);
    sendMessage(messag)
      .then((res) => {
        console.log("this is the message sent : ", res.message);
        socket.emit("new message", res.message);
        setMessages([...messages, res.message]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setSenderName('');
    setChat(chats.find((chat) => chatId.id == chat._id));
    const getMessages = async () => {
      const obj = JSON.parse(localStorage.getItem("user"));
      let token = null;
      if (obj) {
        token = obj.token;
      }
      const results = await fetch(
        `http://localhost:3000/api/message/${chatId.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      results.json().then((res) => {
        setMessages(res);
        setLoading(false);
      });
    };

    return () => {
      getMessages();
      setLoading(false);
    };
  }, []);
  const [realUser, setRealUser] = useState(null);
  useEffect(() => {
    if (realChat) {
      if (realChat.isGroupChat) {
        setChatName(realChat.name);
      } else {
        setChatName(realChat.users.find((u) => u.Email !== user.Email).Name);
      }
      if (realChat.isGroupChat) {
        user.Email == realChat.GroupAdmin.Email
          ? setRealUser(realChat.GroupAdmin)
          : setRealUser(realChat.users.find((u) => u.Email === user.Email));
      } else {
        setRealUser(realChat.users.find((u) => u.Email === user.Email));
      }
    }
  }, [realChat]);
  useEffect(() => {
    if (scrolll.current !== null) {
      scrolll.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);
  useEffect(() => {
    socket.on("received", (newMessageReceived) => {
      setTyping(false);
      setMessages([...messages, newMessageReceived]);
    });
    socket.on("UserTyping", (name) => {
      setTyping(true);
      setSenderName(name);
      setTimeout(() => {
        setTyping(false);
        setSenderName('')
      },  3000);
    });
  });
  useEffect(() => {
    if (scrolll.current !== null && Typing) {
      scrolll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [Typing]);
  return (
    <>
      {realChat && (
        <div className="h-screen  overflow-x-hidden w-screen bg-gray-600  flex flex-col ">
          <div className="px-3 rounded-b-2xl w-full bg-gray-700 flex items-center py-0 h-20 row-span-1 justify-between shadow-lg z-10 ">
            <div>
              <div className="otherInfos flex justify-center items-center gap-3">
                <svg
                  onClick={() => {
                    setChat(null);
                    setMessages([]);
                    navigate("/");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 hover:cursor-pointer hover:text-gray-400 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                <div className="avatar">
                  <div className="w-10 rounded-full ring  ring-offset-base-100 ring-offset-2">
                    <img
                      src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <h1 className="text-2xl font-Parr text-white/80">{ChatName}</h1>
              </div>
            </div>

            <div
              className="parametre group"
              onClick={() => {
                handleClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 group-hover:text-gray-100 transition-all group-hover:cursor-pointer "
              >
                <path
                  fillRule="evenodd"
                  d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex w-full h-[91%] ">
            <div className="bg-blue-400 hidden"></div>
            <div className="messages w-full">
              <div className="bg-gray-600 h-[92%]   max-h-[45rem] px-2 w-full flex flex-col  overflow-y-scroll ">
                {loading && (
                  <div className="w-full h-full rounded-md flex justify-center items-center font-Parr text-lg bg-gray-600">
                    getting messages
                  </div>
                )}
                {!loading && messages.length === 0 && (
                  <div className="w-full h-full rounded-md flex justify-center items-center font-Parr text-lg bg-gray-600">
                    No messages
                  </div>
                )}
                {!loading && (
                  <ul className="h-full">
                    {messages.length !== 0 &&
                      messages.map((message, index) => {
                        const sender = message.sender.Email === user.Email;
                        let sameSender = false;
                        if (index !== 0) {
                          sameSender =
                            message.sender._id ===
                            messages[index - 1].sender._id;
                        }
                        return (
                          <li key={index} ref={scrolll}>
                            <Message
                              message={message}
                              sender={sender}
                              sameSender={sameSender}
                            />
                          </li>
                        );
                      })}
                    {Typing && (
                      <div>
                        {senderName !='' && <h1 className="chat-header font-Parr">{senderName}</h1>}
                        <div className="h-6 rounded-2xl w-10  bottom-0 bg-gray-800/50 ml-12 flex justify-center items-center ">
                          <span className="loading loading-dots loading-md"></span>
                        </div>
                      </div>
                    )}
                  </ul>
                )}
              </div>

              <div className="bg-gray-700 shadow-lg flex h-[8%] w-full  items-center justify-center ">
                <form
                  className="w-[90%] flex justify-around items-center relative gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                    messg.current.value = "";
                  }}
                >
                  <input
                    type="text"
                    className="w-[95%] h-10 rounded-3xl mt-1 bg-gray-600 shadow-lg border text-lg  px-4 font-Parr  "
                    placeholder="Write message"
                    ref={messg}
                    onChange={(e) => {
                      e.preventDefault();
                      socket.emit("typing", realChat, realUser);
                    }}
                  />
                  <button
                    type="submit"
                    className="flex justify-center items-center group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 group-hover:scale-105 group-hover:text-gray-300 "
                    >
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
