import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Swal from 'sweetalert2';
import 'tailwindcss/tailwind.css';
import { backEndURL } from "../Backendurl";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [showMap, setShowMap] = useState(false); // Map visibility state
  const [isMobile, setIsMobile] = useState(false); // Device type check

  useEffect(() => {
    // Check if the device is mobile (screen width < 768px)
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${backEndURL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire('Success!', 'Form submitted successfully!', 'success');
        setFormData({ firstName: '', phone: '', email: '', message: '' });
      } else {
        Swal.fire('Error', 'Failed to send message. Try again.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An error occurred. Try again later.', 'error');
    }
  };

  const handleAddressClick = () => {
    setShowMap((prevShowMap) => !prevShowMap);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div
        className="w-full max-w-6xl mx-4 bg-white shadow-lg rounded-2xl overflow-hidden"
        style={{
          backgroundImage: 'url(/path/to/your-background-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Header Section */}
        <div className="text-center py-6 bg-blue-500 text-white">
          <h1 className="text-4xl font-bold">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {/* Contact Info */}
          <div className="col-span-1 space-y-6 pl-8">
            {/* Address */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all"
              title="Click to toggle map"
              onClick={handleAddressClick} // Use onClick for both mobile and desktop
            >
              <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full">
                <i className="fas fa-map-marker-alt text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="font-semibold">Address</p>
                <p>148/b wathegama Road Madawala</p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all"
              title="Click Here"
              onClick={() => window.location.href = 'tel:+94123456789'}
            >
              <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full">
                <i className="fas fa-phone-alt text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="font-semibold">Phone</p>
                <p>+94 76 618 7001</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="col-span-2 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Contact Number</label>
                  <PhoneInput
                    international
                    defaultCountry="LK"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-blue-500 hover:border-2 hover:border-blue-500 transition-all"
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Map */}
        {showMap && (
          <div className="px-8 pb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.3953180220852!2d80.6280255694476!3d7.288389229814359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3695e645b83af%3A0xa5d2d32338faae42!2sR-Tech%20Solutions!5e0!3m2!1sen!2slk!4v1732601237194!5m2!1sen!2slk"
              width="100%"
              height="400"
              style={{ border: '0' }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactUs;
