import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const AdvancedOTPOverlay = ({ isOpen, onClose, onVerify, onResend }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const inputRefs = useRef([])

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus()
      startCountdown()
    }
  }, [isOpen])

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerify()
    }
  }, [otp])

  const startCountdown = () => {
    setTimeLeft(30)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }

  const handleChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join("")
    try {
      const result = await onVerify(otpString)
      if (result.success) {
        setSuccess(true)
        setError("")
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    setSuccess(false)
    try {
      await onResend()
      startCountdown()
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl"
        >
          <h2 className="text-2xl font-bold text-blue-500 mb-6">Enter OTP</h2>
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-2xl border-2 border-blue-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                aria-label={`Digit ${index + 1} of OTP`}
              />
            ))}
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mb-4">
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 mb-4">
              OTP verified successfully!
            </motion.p>
          )}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`px-4 py-2 rounded-md ${
                timeLeft > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              } transition-colors duration-300`}
            >
              {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-300"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-gray-500">Didn't receive the OTP? Check your spam folder or try resending.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdvancedOTPOverlay

