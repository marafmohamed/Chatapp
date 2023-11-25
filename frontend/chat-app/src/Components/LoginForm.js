import Navbar from "../SmallComponents/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import useLogin from "../hooks/useLogin";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Error, Login, Lauding } = useLogin();
  const handleSubmit = async () => {
    const res = await Login(email, password);
    if (!Error) {
      console.log(res);
    }
  };
  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center bg-[url(C:\Users\DELL\OneDrive\Bureau\jl.jfif)]  bg-no-repeat bg-cover">
      <Navbar />
      <div className="w-10/12  max-w-md  h-1/3 sm:h-2/5 bg-white/30  shadow-lg  bg-blend-soft-light backdrop-blur-4xl	 mb-8 flex flex-col justify-evenly items-center rounded-xl">
        <div className="flex flex-col justify-start px-6 gap-4 ">
          <h1 className="font-Parr text-4xl text-stone-800">Login</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className=" w-full h-3/5 sm:h-4/6 bg-grey-200 flex flex-col gap-4 justify-center items-center"
        >
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            id="Email"
            className="w-5/6 shadow-md h-10  rounded-lg font-bold text-md px-3 text-stone-800  bg-white border-slate-600 border  placeholder:font-semibold  placeholder:opacity-80"
            placeholder="Email"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="password"
            className="w-5/6 shadow-md h-10 rounded-lg font-bold text-md px-3 text-stone-800  bg-white border-slate-600 border  placeholder:font-semibold  placeholder:opacity-80"
            placeholder="Password"
          />
          {!Lauding && <button className="btn btn-wide">Login</button>}
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
        doesn't has an account ?{" "}
        <Link
          to="/sign"
          className="text-blue-600 font-Parr hover:cursor-pointer"
        >
          Signup
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
