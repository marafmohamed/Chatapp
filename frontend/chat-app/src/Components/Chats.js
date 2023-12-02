import React from "react";
import SlideBar from "./SlideBar";
import Messeges from "./Messeges";
import useAuth from "../hooks/useAuth";
export default function Chats({socket}) {
 
  return (
    <>
      <main className=" h-[90%] mt-3  rounded-t-2xl  shadow-gray-500 shadow-lg bg-gray-800 relative ">
          <SlideBar socket={socket}/>
      </main>
    </>
  );
}
