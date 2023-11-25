import React from "react";
import { useRef, useState } from "react";
import Navbar from "../SmallComponents/Navbar";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";
export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Error, Signup, Lauding } = useSignup();
  const handleSubmit = async () => {
    const res = await Signup(name, email, password);
    if (!Error) {
      console.log(res);
    }
  };
  return (
    <div className="h-screen w-screen transition-all flex flex-col justify-between items-center bg-[url(C:\Users\DELL\OneDrive\Bureau\jl.jfif)]  bg-no-repeat bg-cover">
      <Navbar />
      <div className="w-10/12  max-w-lg h-1/2 sm:h-3/5 bg-white/30  shadow-lg  bg-blend-soft-light backdrop-blur-4xl	 mb-6 flex flex-col items-center justify-evenly rounded-xl pb-3">
        <div className="flex flex-col justify-start px-6 gap-4 pt-6 pb-3">
          <h1 className="font-Parr text-4xl text-stone-800">Sign up</h1>
          <p className="text-sm font-paragraph text-stone-700">
            Ready to chat and connect? Sign up in seconds and let your
            conversations take flight with ParroChat. Welcome to a world of
            vibrant communication!
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className=" w-full h-1/2 sm:h-4/6 bg-grey-200 flex flex-col gap-4 justify-center items-center"
        >
          <input
            type="text"
            id="Name"
            className="w-5/6 h-10 focus:ring-2 transition-all outline-none   rounded-lg font-bold text-md px-3 text-stone-800  bg-white border-slate-600 border  placeholder:font-semibold  placeholder:opacity-80"
            placeholder="UserName"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            id="Email"
            className="w-5/6 h-10 focus:ring-2 rounded-lg transition-all font-bold text-md px-3 text-stone-800  bg-white border-slate-600 border  placeholder:font-semibold  placeholder:opacity-80"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            id="password"
            className="w-5/6 h-10 focus:ring-2 rounded-lg transition-all font-bold text-md px-3 text-stone-800  bg-white border-slate-600 border  placeholder:font-semibold  placeholder:opacity-80"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {!Lauding && <button className="btn btn-wide">Signup</button>}
          {Lauding && (
            <button className="btn btn-wide bg-slate-200">
              {" "}
              <span className="loading loading-spinner">Loading</span>
            </button>
          )}
        </form>
      </div>
      {Error && (
        <div className=" transition-all absolute top-40  sm:top-20 sm:w-1/2 sm:absolute bg-red-300/40 border-2 rounded-md w-3/4 h-10 flex justify-center items-center text-lg font-Parr text-red-400 border-red-500 ">
          {Error.error}
        </div>
      )}
      <p className="text-black font-paragraph flex gap-3 items-center py-2 mb-3">
        already has an account ?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-Parr hover:cursor-pointer"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
