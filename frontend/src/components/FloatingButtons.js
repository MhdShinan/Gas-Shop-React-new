import React, { useState, useEffect } from "react";
import { ArrowUp, X, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingButtons = () => {
  const [showArrow, setShowArrow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const createRipple = (e, color) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");
    circle.style.backgroundColor = color;

    const ripple = circle;
    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  const scrollToTop = (e) => {
    createRipple(e, "rgba(255, 255, 255, 0.5)");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWhatsApp = (e) => {
    createRipple(e, "rgba(255, 255, 255, 0.5)");
    setUnreadMessages(0);
    window.open("https://wa.me/94766187001", "_blank");
  };

  const makePhoneCall = (e) => {
    createRipple(e, "rgba(255, 255, 255, 0.5)");
    window.location.href = "tel:0766187001";
  };

  const toggleButtons = () => {
    setIsExpanded(!isExpanded);
  };

  const buttonStyle = {
    position: "relative",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    color: "white",
    overflow: "hidden",
  };

  const tooltipStyle = {
    position: "absolute",
    left: "60px",
    top: "50%",
    transform: "translateY(-50%) scale(0.95)",
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    whiteSpace: "nowrap",
    opacity: 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    pointerEvents: "none",
  };

  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(
        "style",
        null,
        `
        @keyframes ring {
          0% { transform: scale(1); }
          10% { transform: scale(1.1); }
          20% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background-color: rgba(255, 255, 255, 0.7);
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #ff4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          transform: scale(1);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .button-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .button-container:hover {
          transform: scale(1.1);
        }

        .expanded {
          transform: translateX(0);
          opacity: 1;
        }

        .collapsed {
          transform: translateX(100px);
          opacity: 0;
        }
        `
      ),
      React.createElement(
        "div",
        {
          className: "fixed bottom-5 right-4 flex flex-col gap-2 z-50",
        },
        [
          // Toggle Button
          React.createElement(
            "button",
            {
              onClick: toggleButtons,
              style: {
                ...buttonStyle,
                backgroundColor: "#333",
                transform: `rotate(${isExpanded ? "0deg" : "180deg"})`,
              },
              className: "hover:transform hover:scale-110 transition-all z-50",
            },
            React.createElement(X, {
              size: 24,
              className: "text-white",
            })
          ),
          // Phone Button
          React.createElement(
            "div",
            {
              className: `button-container ${isExpanded ? "expanded" : "collapsed"}`,
              style: { position: "relative" },
            },
            [
              React.createElement(
                "button",
                {
                  onClick: makePhoneCall,
                  style: {
                    ...buttonStyle,
                    backgroundColor: "#0088CC",
                    animation: "float 3s ease-in-out infinite",
                  },
                  className: "group",
                },
                React.createElement(PhoneCall, {
                  size: 24,
                  className: "text-white",
                })
              ),
              React.createElement(
                "span",
                {
                  style: tooltipStyle,
                  className: "group-hover:opacity-100 group-hover:transform group-hover:scale-100",
                },
                "Call Now"
              ),
            ]
          ),
          // WhatsApp Button
          React.createElement(
            "div",
            {
              className: `button-container ${isExpanded ? "expanded" : "collapsed"}`,
              style: { position: "relative" },
            },
            [
              React.createElement(
                "button",
                {
                  onClick: openWhatsApp,
                  style: {
                    ...buttonStyle,
                    backgroundColor: "#25D366",
                    animation: "float 3s ease-in-out infinite 0.2s",
                  },
                  className: "group",
                },
                [
                  React.createElement(FaWhatsapp, {
                    size: 24,
                    className: "text-white",
                  }),
                  unreadMessages > 0 &&
                    React.createElement(
                      "span",
                      {
                        className: "badge",
                      },
                      unreadMessages
                    ),
                ]
              ),
              React.createElement(
                "span",
                {
                  style: tooltipStyle,
                  className: "group-hover:opacity-100 group-hover:transform group-hover:scale-100",
                },
                "Chat on WhatsApp"
              ),
            ]
          ),
          // Scroll-to-Top Button
          showArrow &&
            React.createElement(
              "div",
              {
                className: `button-container ${isExpanded ? "expanded" : "collapsed"}`,
                style: { position: "relative" },
              },
              [
                React.createElement(
                  "button",
                  {
                    onClick: scrollToTop,
                    style: {
                      ...buttonStyle,
                      backgroundColor: "#0088CC",
                      animation: "float 3s ease-in-out infinite 0.4s",
                    },
                    className: "group",
                  },
                  React.createElement(ArrowUp, {
                    size: 24,
                    className: "text-white",
                  })
                ),
                React.createElement(
                  "span",
                  {
                    style: tooltipStyle,
                    className: "group-hover:opacity-100 group-hover:transform group-hover:scale-100",
                  },
                  "Back to Top"
                ),
              ]
            ),
        ]
      ),
    ]
  );
};

export default FloatingButtons;

