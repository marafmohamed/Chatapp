import React from "react";
import SlideBar from "./SlideBar";
import useAuth from "../hooks/useAuth";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function Chats({ socket ,userInfo}) {
  const [GroupUsers, setGroupUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [UsersSearched, setUsersSearched] = useState([]);
  const { chats, setChats } = useAuth();
  const navigate = useNavigate();
  const GroupName = useRef(null);
  const Search = useRef(null);
  const [ErrorCreateGroup, setErrorCreateGroup] = useState(null);
  const handleCreateGroup = async () => {
    setLoading(true);
    const obj = JSON.parse(localStorage.getItem("user"));
    let token = null;
    if (obj) {
      token = obj.token;
    }
    if (GroupName.current.value.length === 0) {
      console.log("Group Name is required");
      setLoading(false);
      return;
    }
    if (GroupUsers.length <= 1) {
      console.log("Group must have at least two user");
      setLoading(false);
      return;
    }

    if (token) {
      const fres = await fetch("http://localhost:3000/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          users: GroupUsers,
          chatname: GroupName.current.value,
        }),
      });
      fres.json().then((res) => {
        if (res.status === 400) {
          setErrorCreateGroup(res);
          console.log("i am here ", ErrorCreateGroup);
          setLoading(false);

          return;
        } else {
          setChats([res[0], ...chats]);
          GroupName.current.value = "";
          setGroupUsers([]);
          setUsersSearched([]);
          Search.current.value = "";
          setLoading(false);
        }
      });
    }
  };
  const handleSearch = async (Q) => {
    if (Q.length !== 0) {
      const obj = JSON.parse(localStorage.getItem("user"));
      let token = null;
      if (obj) {
        token = obj.token;
      }
      if (token) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/user/search?search=${Q}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          response.json().then((res) => {
            setUsersSearched(res);
          });
          console.log(UsersSearched);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <>
      <main className="h-[90%] mt-3 rounded-t-2xl flex justify-center items-center shadow-gray-500 shadow-lg bg-gray-800 relative">
        <SlideBar socket={socket} userInfo={userInfo} />
        <div className="hidden  border-gray-900/90 border-2 shadow-inner p-7  lg:flex w-[72%] justify-self-center lg:flex-col lg:items-center lg:justify-evenly marker: h-[90%] bg-gray-700 rounded-3xl gap-7">
          <h1 className="font-Chat text-3xl text-center">Create Group Chat</h1>
          <div className="flex w-full items-center justify-between px-7">
            <form className="flex flex-col items-center gap-10">
              <input
                ref={GroupName}
                type="text"
                placeholder="Group Name"
                className="w-[300px] p-2 shadow-inner shadow-gray-800 rounded-md text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Search user to add"
                className="w-[300px] p-2 rounded-md shadow-inner shadow-gray-800 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                ref={Search}
              />
              <div className="flex justify-start w-[300px] max-w-[300px] gap-2  flex-wrap">
                {GroupUsers.length !== 0 &&
                  GroupUsers.map((user, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => {
                          setGroupUsers(
                            GroupUsers.filter((u) => u._id !== user._id)
                          );
                        }}
                        className="badge badge-info hover:badge-outline hover:cursor-pointer gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-4 h-4 stroke-current  "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        {user.Name}
                      </li>
                    );
                  })}
              </div>
              {!loading && (
                <button
                  className="btn btn-wide "
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateGroup();
                  }}
                >
                  Create Group
                </button>
              )}
              {loading && (
                <button className="btn btn-wide bg-slate-300">
                  <span className="loading loading-spinner">Loading</span>
                </button>
              )}
            </form>
            <div className="h-[250px] w-[40%] rounded-md  bg-gray-600">
              {UsersSearched.length === 0 && (
                <div className="w-full h-full rounded-md flex justify-center items-center font-Parr text-lg bg-gray-600">
                  No user Searched
                </div>
              )}
              {UsersSearched.length !== 0 && (
                <ul className="w-full h-full py-1 px-1 flex flex-col gap-3 max-h-[250px] overflow-y-scroll">
                  {UsersSearched.map((user, index) => {
                    const exist = GroupUsers.find((u) => u._id === user._id);
                    return (
                      <div>
                        {!exist && (
                          <li
                            key={index}
                            className="flex  h-10  py-7 items-center justify-between px-3 shadow-md bg-gray-800 rounded-xl"
                          >
                            <div className="flex h-full items-center gap-4 w-[50%]">
                              <div className="avatar">
                                <div className="w-6 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                  <img
                                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                    alt="Avatar"
                                  />
                                </div>
                              </div>
                              <h1 className="font-Parr text-lg text-white">
                                {user.Name}
                              </h1>
                            </div>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                setGroupUsers([...GroupUsers, user]);
                              }}
                            >
                              Add
                            </button>
                          </li>
                        )}
                      </div>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
