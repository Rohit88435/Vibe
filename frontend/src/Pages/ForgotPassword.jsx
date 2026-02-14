import axios from "axios";
import React, { useState } from "react";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [inputClick, setInputClick] = useState({
    email: false,
    otp: false,
    comfirmNewPassword: false,
    newPassword: false,
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [comfirmNewPassword, setComfirmNewPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /// step 1
  const handleStep1 = async () => {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMessage = "Please enter a valid email address";
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
        `${serverUrl}/api/auth/sendotp`,
        {
          email,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      setError("");
      toast.success(result.data, {
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
      setStep(2);
    } catch (error) {
      console.log("stpe1 " + error);
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
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
    } finally {
      setLoading(false);
    }
  };

  /// step 2
  const handleStep2 = async () => {
    setLoading(true);
    if (!otp.trim()) {
      const errorMessage = "Enter OTP";
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
        `${serverUrl}/api/auth/verifyotp`,
        {
          email,
          otp,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      setError("");
      toast.success("OTP verified successfully", {
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
      setStep(3);
    } catch (error) {
      console.log("stpe2 " + error);
      const errorMessage =
        error.response?.data?.message || "Failed to verify OTP";
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
    } finally {
      setLoading(false);
    }
  };

  /// step 3
  const handleStep3 = async () => {
    setLoading(true);
    if (!newPassword.trim()) {
      const errorMessage = "Enter New Password";
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
    if (!comfirmNewPassword.trim()) {
      const errorMessage = "Enter Confirm New Password";
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
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
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
    if (newPassword !== comfirmNewPassword) {
      const errorMessage = "Password doesn't match";
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
        `${serverUrl}/api/auth/resetpassword`,
        {
          email,
          password: newPassword,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      toast.success("Password reset successfully", {
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
      navigate("/signin");
      setStep(1);
    } catch (error) {
      console.log("stpe3" + error);
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center transition-all">
      {step == 1 && (
        <div className="w-[90%] max-w-[40%] h-125 bg-white rounded-2xl flex justify-center flex-col items-center  border-[#1a1f23] transition-all">
          <h2 className="text-[30px] font-semibold">Forgot Password</h2>
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl 
           border-2 border-black mt-7.5"
            onClick={() => {
              setInputClick({ ...inputClick, email: true });
            }}
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-5 p-1.25 bg-white text-[15px] ${inputClick.email ? "-top-3.75" : ""} `}
            >
              Enter Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="w-full h-full rounded-2xl px-5 outline-none border-0"
            />
          </div>
          <button
            className={`w-[40%] px-5 py-2.5 bg-black text-white font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
            onClick={handleStep1}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
          </button>
          {error && (
            <p className="text-red-500 text-[14px] mt-2.5 font-semibold">
              {error}
            </p>
          )}
        </div>
      )}
      {step == 2 && (
        <div className="w-[90%] max-w-[40%] h-125 bg-white rounded-2xl flex justify-center flex-col items-center  border-[#1a1f23] transition-all">
          <h2 className="text-[30px] font-semibold">Forgot Password</h2>

          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl 
           border-2 border-black mt-7.5"
            onClick={() => {
              setInputClick({ ...inputClick, otp: true });
            }}
          >
            <label
              htmlFor="otp"
              className={`text-gray-700 absolute left-5 p-1.25 bg-white text-[15px] ${inputClick.otp ? "-top-3.75" : ""} `}
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              maxLength={4}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              required
              className="w-full h-full rounded-2xl px-5 outline-none border-0"
            />
          </div>
          <button
            className={`w-[40%] px-5 py-2.5 bg-black text-white font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
            onClick={handleStep2}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Submit"}
          </button>
          {error && (
            <p className="text-red-500 text-[14px] mt-2.5 font-semibold">
              {error}
            </p>
          )}
        </div>
      )}
      {step == 3 && (
        <div className="w-[90%] max-w-[40%] h-125 bg-white rounded-2xl flex justify-center flex-col items-center  border-[#1a1f23] transition-all">
          <h2 className="text-[30px] font-semibold">Reset Password</h2>

          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl 
           border-2 border-black mt-7.5"
            onClick={() => {
              setInputClick({ ...inputClick, newPassword: true });
            }}
          >
            <label
              htmlFor="newPassword"
              className={`text-gray-700 absolute left-5 p-1.25 bg-white text-[15px] ${inputClick.newPassword ? "-top-3.75" : ""} `}
            >
              Enter New Password
            </label>
            <input
              type="text"
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              required
              className="w-full h-full rounded-2xl px-5 outline-none border-0"
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12.5 rounded-2xl 
           border-2 border-black mt-7.5"
            onClick={() => {
              setInputClick({ ...inputClick, comfirmNewPassword: true });
            }}
          >
            <label
              htmlFor="comfirmNewPassword"
              className={`text-gray-700 absolute left-5 p-1.25 bg-white text-[15px] ${inputClick.comfirmNewPassword ? "-top-3.75" : ""} `}
            >
              Enter Comfirm New Password
            </label>
            <input
              type="text"
              id="comfirmNewPassword"
              value={comfirmNewPassword}
              onChange={(e) => {
                setComfirmNewPassword(e.target.value);
              }}
              required
              className="w-full h-full rounded-2xl px-5 outline-none border-0"
            />
          </div>
          {error && (
            <p className="text-red-500 text-[14px] mt-2.5 font-semibold">
              {error}
            </p>
          )}
          <button
            className={`w-[40%] px-5 py-2.5 bg-black text-white font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
            onClick={handleStep3}
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
