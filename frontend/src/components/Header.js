import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingCart,
  FiClock,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import logo from "../assets/images/download (1).png";
import brand from "../assets/images/1.png";
import SweetAlert from "sweetalert2";
import Form from "./AdvancedOrderForm"; // Import the Form component

const Header = () => {
  const navigate = useNavigate(); 
  const [currentTime, setCurrentTime] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState("");
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control modal visibility
  const userName =
    sessionStorage.getItem("name") ||
    sessionStorage.getItem("number") ||
    sessionStorage.getItem("email") ||
    "User";
  const userEmail = sessionStorage.getItem("email");
  const adminEmail = "mohamedshinan069@gmail.com";

  const handleLogout = () => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/sign-in";
      }
    });
  };

  React.useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-blue-500 text-white rounded-b-[25px] pb-4 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-2">
          {/* Logo Section */}
          <div className="w-[100px] h-[100px] bg-white rounded-lg flex items-center justify-center">
            <img
              src={logo}
              alt="Litro Gas Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Brand Section */}
          <div className="flex-1 flex flex-col items-center mt-2 md:mt-0">
            <img
              src={brand}
              alt="Litro Gas Brand"
              className="px-20 w-70 h-20 object-contain"
            />
          </div>

          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            {/* First Row: Welcome, Settings, and Log Out */}
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold mt-2">
                Welcome Back, <br />
                {userName}!
              </div>

              <button
                className="flex items-center justify-center bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
                onClick={() => alert("Settings")}
              >
                <FiSettings className="w-5 h-5" />
              </button>

              <button
                className="flex items-center justify-center bg-red-500 p-2 rounded-full hover:bg-red-600 transition-all"
                onClick={handleLogout}
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Second Row: Admin and Date & Time */}
            <div className="flex items-center justify-between gap-4 mt-2">
              {userEmail === adminEmail && (
                <button
                  className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded hover:bg-white/20 shadow-md transition-all"
                  onClick={() => navigate("/admin")} // Navigate to /admin on click
                >
                  <FiUser className="w-5 h-5" />
                  Admin
                </button>
              )}
              {/* Form Button */}
              <button
                className="flex items-center gap-2 bg-white/10 px-4 py-1 rounded hover:bg-white/20 shadow-md transition-all"
                onClick={() => setIsFormOpen(true)}
              >
                <FiShoppingCart className="w-5 h-5" />
                Form
              </button>

              {/* Date and Time */}
              <div className="text-sm text-right">
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-white" />
                  {currentTime}
                </div>
                <div className="flex items-center gap-2">
                  <BsBell className="w-4 h-4 text-white" />
                  {currentDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         
            <Form closeOverlay={() => setIsFormOpen(false)} />{" "}
            {/* Pass the function */}

        </div>
      )}
    </header>
  );
};

export default Header;
