import { useEffect, useState } from "react";
import useLogout from "../hooks/useLogout";
import Chats from "./Chats";
export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const {logout}=useLogout()
  useEffect(() => {
    const getInfo = async () => {
      const obj = JSON.parse(localStorage.getItem("user"));
      let token=null;
      if(obj){
        token=obj.token;
      }
      if(token){
      const response = await fetch("http://localhost:3000/api/user/UserInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      response.json().then((res) => {
        setUserInfo(res);
      });
    }};
    return () => {
      getInfo();
    };
  }, []);
  const handleClick=()=>{
    logout()
  }
  return(
     
    <div className="h-screen w-screen flex flex-col ">
      {!userInfo && <div className="h-screen w-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>}
     { userInfo && <><div className="Navbar w-full shadow-lg shadow-gray-900 flex items-center justify-between  bg-slate-800 py-4 px-4 rounded-b-xl">
          <div className="userInformtion flex items-center justify-start w-2/5 gap-5 ">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Avatar" />
              </div>
            </div>
            <h1 className=" font-Parr text-xl text-gray-300">{userInfo.Name}</h1>
          </div>
          <button onClick={()=>{
           handleClick()
          }} className="btn btn-sm btn-outline">Logout</button>
        </div>
        <Chats></Chats></>
}
      </div>
   );
  
}
