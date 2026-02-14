import React, { useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import axios from "axios";
import { serverUrl } from "../App";
import { setProfileData } from "../redux/UserSlice";
import { ClipLoader } from "react-spinners";
function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(
    userData.profileImage || dp,
  );
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userData?.name);
  const [userName, setUserName] = useState(userData?.userName);
  const [profession, setProfession] = useState(userData?.profession);
  const [bio, setBio] = useState(userData?.bio);
  const [gender, setGender] = useState(userData?.gender);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // function for save data in server
  const handleEditPofile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("userName", userName);
      formdata.append("bio", bio);
      formdata.append("profession", profession);
      formdata.append("gender", gender);
      if (backendImage) {
        formdata.append("profileImage", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/editprofile`,
        formdata,
        { withCredentials: true },
      );
      dispatch(setProfileData(result.data));
      navigate(`/profile/${userData.userName}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex items-center flex-col gap-5  p-5">
      <div className="w-full h-20  flex  items-center gap-5 p-5 ">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 cursor-pointer"
          onClick={() => {
            navigate(`/profile/${userData.userName}`);
          }}
        />
        <h1 className="text-[20px] text-white font-semibold">Edit Profile</h1>
      </div>

      <div
        className="w-20 h-20 md:w-23 md:h-23 border-2 border-black rounded-full cursor-pointer overflow-hidden"
        onClick={() => {
          imageInput.current.click();
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={(e) => {
            handleImage(e);
          }}
        />
        <img src={frontendImage} alt="" className="w-full object-cover" />
      </div>
      <div
        className="text-blue-500 text-[18px] text-center font-semibold cursor-pointer"
        onClick={() => {
          imageInput.current.click();
        }}
      >
        Change Your Profile Picture
      </div>

      <input
        type="text"
        className="w-[90%] max-w-150 h-14 bg-[#0a1010] border-2 border-gray-700 rounded-2xl outline-none placeholder:text-gray-400 px-2.5 text-white "
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        className="w-[90%] max-w-150 h-14 bg-[#0a1010] border-2 border-gray-700 rounded-2xl outline-none placeholder:text-gray-400 px-2.5 text-white "
        placeholder="Enter Your Username"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <input
        type="text"
        className="w-[90%] max-w-150 h-14 bg-[#0a1010] border-2 border-gray-700 rounded-2xl outline-none placeholder:text-gray-400 px-2.5 text-white "
        placeholder="Profession"
        value={profession}
        onChange={(e) => {
          setProfession(e.target.value);
        }}
      />
      <input
        type="text"
        className="w-[90%] max-w-150 h-14 bg-[#0a1010] border-2 border-gray-700 rounded-2xl outline-none placeholder:text-gray-400 px-2.5 text-white "
        placeholder="Bio"
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
        }}
      />
      <input
        type="text"
        className="w-[90%] max-w-150 h-14 bg-[#0a1010] border-2 border-gray-700 rounded-2xl outline-none placeholder:text-gray-400 px-2.5 text-white "
        placeholder="Gender"
        value={gender}
        onChange={(e) => {
          setGender(e.target.value);
        }}
      />

      <button
        className="px-2.5 w-[66%] max-w-100 py-1.25 h-12.5 bg-white cursor-pointer rounded-2xl font-medium text-[18px]"
        onClick={handleEditPofile}
        disabled={loading}
      >
        {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
