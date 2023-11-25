export default function Navbar() {
  return (
    <div className="Logo flex w-full h-16 justify-start px-3 mt-8 ">
      <div className="flex gap-2 justify-center items-center">
        <h1 className=" text-2xl sm:text-3xl hover:cursor-pointer text-black font-Chat ">
          ParroChat
        </h1>
        <img
          src="Untitled-3.svg"
          alt="logo"
          className=" w-16 h-16 cursor-pointer sm:w-20 sm:h-20"
        />{" "}
      </div>
    </div>
  );
}
