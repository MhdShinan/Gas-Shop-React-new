import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../assets/images/1.png'
const AdvancedSignInForm = ({ onSignIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    contactNumber: "",
    password: "",
    retypePassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (showOTP && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOTP, timeLeft]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Handle login logic here
      loginUser();
    } else if (showOTP) {
      // Handle OTP verification here
      verifyOTP();
    } else {
      // Handle registration logic here
      registerUser();
    }
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP.join(""));

      if (value && index < 5) {
        document.querySelectorAll('input[type="text"]')[index + 1].focus();
      }
    }
  };

  const registerUser = () => {
    sessionStorage.setItem("name", formData.name);
    sessionStorage.setItem("email", formData.email);
    sessionStorage.setItem("contactNumber", formData.contactNumber);

    fetch("http://localhost:3001/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data.message ===
          "OTP sent successfully. Verify your email to complete registration."
        ) {
          setShowOTP(true);
          setTimeLeft(60);
          toast.info(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => toast.error("Registration failed!"));
  };

  const verifyOTP = () => {
    fetch("http://localhost:3001/api/users/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, user: formData }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Registration successful!") {
          toast.success(data.message);
          resetForm();
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => toast.error("OTP verification failed!"));
  };

  const loginUser = () => {
    sessionStorage.setItem('email', formData.email);

    const { email, password } = formData; // Extract email and password from formData

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Ensure email and password are properly passed
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful!") {
          toast.success(data.message);
          onSignIn(); // On successful login, trigger the redirect in parent
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error("Login failed!");
        console.error("Error:", error);
      });
  };

  const resendOTP = () => {
    setTimeLeft(60);
    toast.info("OTP resent successfully.");
    // Make an API call to resend OTP if needed
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      email: "",
      contactNumber: "",
      password: "",
      retypePassword: "",
    });
    setShowOTP(false);
    setIsLogin(true);
    setOTP("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <img
          className="mx-auto h-28 w-auto bg-blue-500 rounded-[25px]"
          src={logo}
          alt="Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && !showOTP && (
            <>
              {createInput("name", "Name", "text")}
              {createInput("address", "Address", "text")}
              {createInput("contactNumber", "Contact Number", "tel")}
            </>
          )}
          {createInput("email", "Email address", "email")}
          {!isLogin && !showOTP && (
            <>
              {createPasswordInput("password", "Password")}
              {createPasswordInput("retypePassword", "Retype Password")}
            </>
          )}
          {isLogin && createPasswordInput("password", "Password")}
          {showOTP && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter 6-digit OTP
              </label>
              <div className="flex space-x-2 mt-2">
                {Array(6)
                  .fill()
                  .map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => handleOTPChange(e, i)}
                      className="w-12 h-12 text-center border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ))}
              </div>
              {timeLeft > 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  Resend OTP in {timeLeft} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? "Sign in" : showOTP ? "Verify OTP" : "Register"}
            </button>
          </div>
          <div className="text-sm text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
                setShowOTP(false);
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin
                ? "Create an account"
                : "Already have an account? Sign in"}
            </a>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );

  function createInput(name, label, type) {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name]}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    );
  }

  function createPasswordInput(name, label) {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            id={name}
            value={formData[name]}
            onChange={handleInputChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  showPassword
                    ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7M6.125 5.175a10.05 10.05 0 011.875-.175C9.219 5 10 5.571 10 6.25c0 .679-.781 1.25-1.875 1.25"
                }
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
};

export default AdvancedSignInForm;
