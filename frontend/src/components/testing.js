import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Close,
  People,
  Person,
  DirectionsCar,
  DirectionsWalk,
} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdvancedOrderForm = ({ closeOverlay }) => {
  const [formState, setFormState] = useState({
    step: "initial",
    buyType: "",
    friendName: "",
    friendNumber: "",
    friendAddress: "",
    landmarks: "",
    deliveryType: "",
    travelMode: "",
    otp: "",
    name: "",
    number: "",
    email: sessionStorage.getItem('userEmail') || "",
    size: "",
    sizePrice: "",
  });

  const [errors, setErrors] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // Price mapping for sizes
  const sizePrices = {
    small: 10,
    medium: 20,
    large: 30,
    exlarge: 40,
  };

  useEffect(() => {
    const emailFromSession = sessionStorage.getItem("email");
    if (emailFromSession) {
      axios
        .get("http://localhost:3001/api/users/fetch-details", {
          params: { email: emailFromSession },
        })
        .then((response) => {
          if (response.data) {
            console.log("Fetched user details:", response.data);
            setFormState((prev) => ({
              ...prev,
              name: response.data.name,
              number: response.data.contactNumber,
              email: response.data.email,
            }));
            toast.success("User details loaded successfully!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.warning("No user details found for this email.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          toast.error(`Failed to load user details: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      toast.info("No email found in session storage.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, []);

  const updateForm = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (key === "size") {
      setFormState((prev) => ({ ...prev, sizePrice: sizePrices[value] || "" }));
    }
  };

  const validateFields = (requiredFields) => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formState[field]) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (validateFields(["friendName", "friendNumber", "size"])) {
      Swal.fire({
        title: "Order Submitted",
        text: "Your order has been successfully placed.",
        icon: "success",
      });
    }
  };

  const handleOtpSubmit = () => {
    if (formState.otp === "123456") {
      Swal.fire("Success", "OTP verified successfully!", "success");
    } else {
      Swal.fire("Error", "Invalid OTP. Please try again.", "error");
    }
  };

  const resendOtp = () => {
    setOtpSent(true);
    Swal.fire("OTP Resent", "A new OTP has been sent to your email.", "info");
  };

  const handleSearch = () => {
    Swal.fire({
      title: "Searching User...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch('http://localhost:3001/api/users/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formState.email }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        Swal.close();
        if (data.message) {
          Swal.fire("Error", data.message, "error");
          setSearchResult(null);
        } else {
          setSearchResult(data);
          setFormState(prev => ({
            ...prev,
            name: data.name,
            number: data.contactNumber,
            email: data.email,
          }));
        }
      })
      .catch(error => {
        Swal.close();
        Swal.fire("Error", "An error occurred while searching.", "error");
        setSearchResult(null);
        console.error('Error:', error);
      });
  };

  const renderFormField = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: "16px" }}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        type={type}
        placeholder={placeholder}
        value={formState[key]}
        onChange={(e) => updateForm(key, e.target.value)}
        error={!!errors[key]}
        helperText={errors[key]}
        disabled={["name", "number", "email", "sizePrice"].includes(key)}
      />
    </div>
  );

  const renderSizeDropdown = () => (
    <div style={{ marginBottom: "16px" }}>
      <InputLabel id="size-label">Size</InputLabel>
      <Select
        fullWidth
        labelId="size-label"
        value={formState.size}
        onChange={(e) => updateForm("size", e.target.value)}
        error={!!errors.size}
      >
        <MenuItem value="small">Small</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="large">Large</MenuItem>
        <MenuItem value="exlarge">Extra Large</MenuItem>
      </Select>
      {errors.size && (
        <Typography color="error" variant="caption">
          {errors.size}
        </Typography>
      )}
    </div>
  );

  const renderDeliveryOptions = () => (
    <FormControl>
      <Typography>Delivery Options</Typography>
      <RadioGroup
        value={formState.deliveryType}
        onChange={(e) => updateForm("deliveryType", e.target.value)}
      >
        <FormControlLabel value="takeaway" control={<Radio />} label="Take Away" />
        <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
      </RadioGroup>
    </FormControl>
  );

  const renderTravelMode = () => (
    formState.deliveryType === "delivery" && (
      <FormControl>
        <Typography>Travel Mode</Typography>
        <RadioGroup
          value={formState.travelMode}
          onChange={(e) => updateForm("travelMode", e.target.value)}
        >
          <FormControlLabel
            value="vehicle"
            control={<Radio />}
            label={(
              <>
                By Vehicle <DirectionsCar fontSize="small" />
              </>
            )}
          />
          <FormControlLabel
            value="person"
            control={<Radio />}
            label={(
              <>
                By Person <DirectionsWalk fontSize="small" />
              </>
            )}
          />
        </RadioGroup>
      </FormControl>
    )
  );

  const renderBuyForFriendForm = () => (
    <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
      <div style={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Your Name"
          value={formState.name}
          disabled
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Your Number"
          value={formState.number}
          disabled
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Your Email"
          value={formState.email}
          disabled
        />
      </div>

      {renderFormField("Friend Name", "friendName")}
      {renderFormField("Friend Number", "friendNumber", "tel")}
      {renderSizeDropdown()}
      {renderFormField("Size Price", "sizePrice", "text", "", true)}
      {renderDeliveryOptions()}
      {formState.deliveryType === "delivery" &&
        renderFormField("Friend Address", "friendAddress")}
      {formState.deliveryType === "delivery" &&
        renderFormField("Address Landmark", "landmarks")}
      {formState.deliveryType === "delivery" && renderTravelMode()}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmitOrder}
      >
        Submit Order
      </Button>
    </div>
  );

  const renderBuyForMeForm = () => (
    <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
      <Typography variant="h6">Buy for Me</Typography>

      <div style={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          value={formState.email}
          disabled
        />
      </div>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSearch}
      >
        Search User
      </Button>

      {searchResult && (
        <div style={{ marginTop: "16px" }}>
          <Typography variant="body1">User Found:</Typography>
          <Typography>Name: {searchResult.name}</Typography>
          <Typography>Number: {searchResult.contactNumber}</Typography>
          <Typography>Email: {searchResult.email}</Typography>

          <Typography variant="h6" style={{ marginTop: "16px" }}>
            Delivery Options:
          </Typography>
          {renderDeliveryOptions()}

          {formState.deliveryType === "delivery" && (
            <>
              {renderTravelMode()}
              {renderFormField("Address", "friendAddress")}
              {renderFormField("Address Landmark", "landmarks")}
            </>
          )}

          {renderSizeDropdown()}
          {renderFormField("Size Price", "sizePrice", "text", "", true)}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              if (validateFields(["name", "number", "email", "size"])) {
                Swal.fire({
                  title: "OTP Verification",
                  html: (
                    <div>
                      <TextField
                        fullWidth
                        label="Enter OTP"
                        value={formState.otp}
                        onChange={(e) => updateForm("otp", e.target.value)}
                        style={{ marginBottom: "16px" }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOtpSubmit}
                      >
                        Verify OTP
                      </Button>
                      {otpSent && (
                        <Button
                          variant="text"
                          color="secondary"
                          onClick={resendOtp}
                          style={{ marginLeft: "16px" }}
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  ),
                  showConfirmButton: false,
                  showCloseButton: true,
                });
              }
            }}
          >
            Submit Order
          </Button>
        </div>
      )}
    </div>
  );

  const renderInitialStep = () => (
    <div className="space-y-4">
      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<People />}
        onClick={() => updateForm("step", "buyToFriend")}
      >
        Buy for a Friend
      </Button>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<Person />}
        onClick={() => updateForm("step", "buyForMe")}
      >
        Buy for Me
      </Button>
    </div>
  );

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Card>
        <CardHeader
          action={<IconButton onClick={closeOverlay}><Close /></IconButton>}
          title={<Typography variant="h6">Advanced Order Form</Typography>}
        />
        <CardContent>
          {formState.step === "initial" && renderInitialStep()}
          {formState.step === "buyToFriend" && renderBuyForFriendForm()}
          {formState.step === "buyForMe" && renderBuyForMeForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedOrderForm;