import React, { useState } from "react";
import logo from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/UserSlice";
import { toast, Bounce } from "react-toastify";

function Signin() {
  const dispatch = useDispatch();
  const [inputClick, setInputClick] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // sign in handle function

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!userName.trim()) {
      const errorMsg = "Username is required";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      const errorMsg = "Password must be at least 6 characters";
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      const errorMessage =
        "Password must be at least 6 characters with 1 uppercase letter and 1 digit";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          userName,
          password,
        },
        { withCredentials: true },
      );
      setSuccess(true);
      setUserName("");
      setPassword("");
      dispatch(setUserData(result.data));
      toast.success("Sign In Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Sign in failed";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      console.log(`handle signin error ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center transition-all">
      <div className="w-[90%] lg:max-w-[60%] h-150 bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23] transition-all ">
        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-2.5 text-white text-[16px] font-semibold rounded-r-[30px] shadow-2xl shadow-black">
          <h1 className="text-[170%] font-semibold">Welcome To</h1>
          <img src={logo2} alt="" className="w-[50%] " />
          <p>Not Just A Platform , It's A VYBE</p>
        </div>
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-2.5 gap-5 ">
          <div className="flex gap-2.5 items-center text-center text-[20px] font-semibold mt-10">
            <span>Sign In to </span>
            <img src={logo} alt="" className="w-17.5" />
          </div>

          <div
            className="relative  flex items-center justify-start w-[90%] h-12.5 rounded-2xl mt-7.5
           border-2 border-black"
            onClick={() => {
              setInputClick({ ...inputClick, userName: true });
            }}
          >
            <label
              htmlFor="UserName"
              className={`text-gray-700 absolute left-5 p-1.25 bg-white text-[15px] ${inputClick.userName ? "-top-3.75" : ""} `}
            >
              Enter Username
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              required
              className="w-full h-full rounded-2xl px-5 outline-none border-0"
            />
          </div>

          <div
            className="relative  flex items-center justify-start w-[90%] h-12.5 rounded-2xl 
           border-2 border-black"
            onClick={() => {
              setInputClick({ ...inputClick, password: true });
            }}
          >
            <label
              htmlFor="password"
              className={`text-gray-700 absolute left-5 p-1.25 bg-white text-[15px] ${inputClick.password ? "-top-3.75" : ""} `}
            >
              Enter Password
            </label>
            <input
              type={showPassword ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              className="w-full h-full rounded-2xl px-5 outline-none border-0"
            />
            {showPassword ? (
              <IoIosEye
                className="absolute cursor-pointer right-5 w-6.25 h-6.25"
                onClick={() => {
                  setShowPassword(false);
                }}
              />
            ) : (
              <IoIosEyeOff
                className="absolute cursor-pointer right-5 w-6.25 h-6.25"
                onClick={() => {
                  setShowPassword(true);
                }}
              />
            )}
          </div>
          <div
            className="w-full px-[10%] cursor-pointer"
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            Forgot Password
          </div>
          <button
            className={`w-[70%] px-5 py-2.5 bg-black text-white font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign In"}
          </button>
          {error && (
            <p className="text-red-500 text-[14px] font-semibold">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-[14px] font-semibold">
              SignIn successful!
            </p>
          )}
          <p
            className="cursor-pointer text-gray-800 "
            onClick={() => {
              navigate("/signup");
            }}
          >
            Create Your Account ?
            <span className="border-b-2 border-b-black pb-0.75 text-black hover:text-blue-500">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
