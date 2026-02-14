import React from "react";
import LeftHome from "../components/LeftHome";
import FeedHome from "../components/FeedHome";
import RightHome from "../components/RightHome";
import GetSuggestedUser from "../hooks/GetSuggestedUser";
import GetCurrentUser from "../hooks/GetCurrentUser";
import GetAllPost from "../hooks/GetAllPost";

function Home() {
  GetCurrentUser();
  GetSuggestedUser();
  return (
    <div className="w-full flex justify-center items-center">
      <LeftHome />
      <FeedHome />
      <RightHome />
    </div>
  );
}

export default Home;
