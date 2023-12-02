import React, { useEffect, useState, useRef } from "react";
import useSearchUsers from "../hooks/useSearchUsers";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
export default function SlideBar({ socket }) {
  const { chats, setChats, loadingChats } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const { SearchUsers } = useSearchUsers();
  const SU = useRef(null);
  const navigate = useNavigate();
  const handleEnterChat = (e) => {
    navigate(`/${e._id}`);
    socket.emit("join Chat", e._id);
  };
  const handleAdd = async (user) => {
    const obj = JSON.parse(localStorage.getItem("user"));
    let token = null;
    if (obj) {
      token = obj.token;
    }
    if (token) {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });
      response.json().then((res) => {
        const newChats = fetch("http://localhost:3000/api/chat", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          res.json().then((cha) => {
            setChats(cha);
            setSearch("");
            setSearching(false);
          });
        });
      });
    } else {
      console.log("error");
    }
  };
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
    return () => {
      GetChats();
    };
  }, []);
  return (
    <div className="w-full h-full rounded-t-2xl bg-gray-800 flex flex-col items-center ">
      <form
        className="w-[95%]   sticky top-3 z-10 shadow-lg "
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search Users"
            className="w-full  h-12  rounded-3xl   text-white/80  font-Parr text-lg px-3  placeholder:text-white/30 mt-2 bg-gray-700 shadow-md shadow-gray-900"
            ref={SU}
            onChange={(e) => {
              if (SU.current.value !== "" && SU.current.value) {
                setSearching(true);
                SearchUsers(setUsers, SU.current.value);
              }
            }}
          />
          {searching && (
            <div
              className="absolute right-5 top-5 transition-all hover:cursor-pointer"
              onClick={() => {
                setSearch("");
                setSearching(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>
      </form>
      {users && searching && (
        <ul
          className="bg-gray-700 backdrop-blur-0
         max-h-[400px] overflow-y-scroll rounded-xl mt-4 w-[95%] flex flex-col gap-2  items-center py-3 shadow-md z-20 "
        >
          {users.map((user, index) => {
            let exist = false;
            let c;
            chats.forEach((chat) => {
              if (chat) {
                chat.users.forEach( (usr) => {
                  if (usr._id === user._id) {
                    exist = true;
                    c=chat;
                  }
                });
              }
            });
            return (
              <li
                key={index}
                className="w-[96%] h-16 py-3  text-white/80  font-Parr text-lg px-3  mt-2 bg-gray-800  rounded-lg   shadow-inner shadow-gray-900/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-11 rounded-full ">
                      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                  </div>
                  <h1 className=" font-Parr text-xl text-gray-300">
                    {user.Name}
                  </h1>
                </div>
              {!exist &&  <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    handleAdd(user);
                  }}
                >
                  Add
                </button>
                }
                {exist && <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    navigate(`/${c._id}`)
                  }}
                >
                  Chat
                </button>}
              </li>
            );
          })}
          {users.length === 0 && searching && (
            <li className="h-14 flex justify-center items-center font-Parr text-xl ">
              No results
            </li>
          )}
        </ul>
      )}
      {chats.length !== 0 && (
        <div className=" flex shadow-inner flex-col absolute pb-2 top-16 w-[98%]  bg-gray-700 h-[90%] rounded-xl  p-0 items-center  overflow-scroll ">
          {chats.map((chat, index) => {
            return (
              <div
                key={index}
                className="w-[97%] h-16 py-3 group hover:bg-gray-900/70 transition-all hover:cursor-pointer text-white/70   text-lg px-3  mt-2 bg-gray-800  rounded-lg    shadow-gray-900/80 flex items-center justify-between"
                onClick={() => {
                  handleEnterChat(chat);
                }}
              >
                <div className="flex  items-center gap-3">
                  <div className="avatar">
                    <div className="w-11 rounded-full ">
                      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                  </div>

                  {chat.lastMessage && (
                    <div>
                      <h1 className=" font-Parr text-xl text-white/80">
                        {chat.name}
                      </h1>
                      <p className="font-thin max-w-[120px] whitespace-nowrap text-gray-400 text-base  overflow-x-auto text-ellipsis overflow-hidden ">
                        {chat.lastMessage.content}
                      </p>
                    </div>
                  )}
                  {!chat.lastMessage && (
                    <h1 className=" font-Parr text-xl text-white/80">
                      {chat.name}
                    </h1>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 group-hover:scale-110 duration-75 text-white/40"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      )}
      {loadingChats && (
        <div className="h-full flex justify-center items-center bg-gray-700 rounded-xl mt-4 w-[95%] gap-2   py-3 shadow-lg z-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {!loadingChats && chats.length === 0 && (
        <div className="font-Parr -z-0 text-white/30  absolute shadow-inner text-2xl  top-80 bg-gray-700/50 w-[90%] h-20 flex justify-center items-center rounded-lg">
          No Chats
        </div>
      )}
      {searching && (
        <div
          className="h-screen w-full backdrop-blur-sm fixed top-0 bg-black/50 "
          onClick={() => {
            setSearching(false);
          }}
        ></div>
      )}
    </div>
  );
}
