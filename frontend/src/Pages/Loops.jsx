import React from "react";
import LoopCard from "../Components/LoopCard";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Loops() {
  const navigate = useNavigate();
  const { loopData } = useSelector((state) => state.loop);
  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">
      <div className="w-full h-20 fixed l-2.5 top-3 flex  items-center gap-5 p-5 z-50">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 cursor-pointer "
          onClick={() => {
            navigate("/");
          }}
        />
        <h1 className="text-[20px] text-white font-semibold">Loops</h1>
      </div>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide ">
        {loopData.map((loop, index) => (
          <div className="h-screen snap-start" key={index}>
            <LoopCard loop={loop} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loops;
