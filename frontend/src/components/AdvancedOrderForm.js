import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Close,
  People,
  Person,
  DirectionsCar,
  DirectionsWalk,
  Add,
  Remove,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AdvancedOTPOverlay from "./AdvancedOTPOverlay";

const AdvancedOrderForm = ({ closeOverlay }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    step: "initial",
    friendName: "",
    friendNumber: "",
    friendAddress: "",
    landmarks: "",
    deliveryType: "",
    travelMode: "",
    otp: "",
    name: "",
    number: "",
    email: sessionStorage.getItem("userEmail") || "",
    sizePrice: "",
  });

  const [errors, setErrors] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Changed to array for multiple products
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [otpForVerification, setOtpForVerification] = useState(null); // State to store OTP for verification
  const [showOtpOverlay, setShowOtpOverlay] = useState(false);

  useEffect(() => {
    const emailFromSession = sessionStorage.getItem("email");
    if (emailFromSession) {
      axios
        .get("http://localhost:3001/api/users/fetch-details", {
          params: { email: emailFromSession },
        })
        .then((response) => {
          if (response.data) {
            setFormState((prev) => ({
              ...prev,
              name: response.data.name,
              number: response.data.contactNumber,
              email: response.data.email,
            }));
            toast.success("User details loaded successfully!", {
              position: "top-left",
              autoClose: 900,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          toast.error(`Failed to load user details: ${error.message}`, {
            position: "top-left",
            autoClose: 1200,
          });
        });
    }
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products`);
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []);

  const updateForm = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  // Product selection with quantity control
  const renderProductSelection = () => (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h6">Select Product:</Typography>
      {loadingProducts ? (
        <CircularProgress size={24} />
      ) : (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {products.map((product) => (
            <Button
              key={product._id}
              variant="contained"
              color={
                selectedProducts.some((p) => p._id === product._id)
                  ? "primary"
                  : "inherit"
              }
              onClick={() => {
                const isSelected = selectedProducts.some(
                  (p) => p._id === product._id
                );
                if (isSelected) {
                  setSelectedProducts((prev) =>
                    prev.filter((p) => p._id !== product._id)
                  );
                } else {
                  setSelectedProducts((prev) => [
                    ...prev,
                    { ...product, quantity: 1 },
                  ]);
                }
              }}
            >
              {product.title} ({product.price} Rs)
            </Button>
          ))}
        </div>
      )}

      {selectedProducts.map((product) => (
        <div
          key={product._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Typography variant="body1" style={{ marginRight: "10px" }}>
            {product.title} Quantity:
          </Typography>
          <IconButton
            onClick={() =>
              setSelectedProducts((prev) =>
                prev.map((p) =>
                  p._id === product._id
                    ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
                    : p
                )
              )
            }
            disabled={product.quantity === 1}
          >
            <Remove />
          </IconButton>
          <TextField
            value={product.quantity}
            variant="outlined"
            size="small"
            style={{
              width: "50px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          />
          <IconButton
            onClick={() =>
              setSelectedProducts((prev) =>
                prev.map((p) =>
                  p._id === product._id
                    ? { ...p, quantity: Math.min(p.quantity + 1, 5) }
                    : p
                )
              )
            }
            disabled={product.quantity === 5}
          >
            <Add />
          </IconButton>
        </div>
      ))}
    </div>
  );

  // Common form field renderer
  const renderFormField = (label, key, type = "text") => (
    <div style={{ marginBottom: "16px" }}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        type={type}
        value={formState[key]}
        onChange={(e) => updateForm(key, e.target.value)}
        error={!!errors[key]}
        helperText={errors[key]}
        disabled={["name", "number", "email", "sizePrice"].includes(key)}
      />
    </div>
  );

  const validateFields = (requiredFields) => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formState[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (selectedProducts.length === 0) {
      newErrors.product = "Please select at least one product";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSubmission = async (isForFriend) => {
    const requiredFields = isForFriend
      ? ["friendName", "friendNumber", "email"]
      : ["email"];
  
    if (!validateFields(requiredFields) || selectedProducts.length === 0) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }
  
    try {
      await axios.post("http://localhost:3001/api/otp/send", {
        email: formState.email
      });
      setShowOtpOverlay(true);
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP", "error");
    }
  };
  const submitOrder = async () => {
    try {
      const orderData = {
        customerEmail: formState.email,
        products: selectedProducts.map(p => ({
          productId: p._id,
          quantity: p.quantity
        })),
        // Add other necessary fields from formState
        deliveryType: formState.deliveryType,
        deliveryAddress: formState.friendAddress,
        // ... other fields
      };
  
      await axios.post("http://localhost:3001/api/orders", orderData);
      toast.success("Order placed successfully!");
      closeOverlay();
    } catch (error) {
      toast.error("Order submission failed");
    }
  };
  const handleSubmitOrder = async () => {
    if (!formState.number) {
      toast.error("Please enter your contact number.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/send-otp", {
        phoneNumber: formState.number,
      });

      if (response.data.success) {
        setOtpForVerification(response.data.otp); // Store OTP for verification
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const handleOtpSubmit = async (otp, email) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/otp/verify",
        {
          otp,
          email,
        }
      );
      if (response.data.success) {
        toast.success("OTP verified successfully!");
        console.log("OTP overlay is open:", false); // Log OTP overlay state
        return true;
      } else {
        toast.error("Invalid OTP");
        return false;
      }
    } catch (error) {
      toast.error("OTP verification failed");
      return false;
    }
  };

  // User search functionality
  const handleSearch = () => {
    Swal.fire({
      title: "Searching User...",
      didOpen: () => Swal.showLoading(),
    });

    axios
      .post("http://localhost:3001/api/users/search", {
        email: formState.email,
      })
      .then((response) => {
        Swal.close();
        if (response.data.message) {
          Swal.fire("Error", response.data.message, "error");
          setSearchResult(null);
        } else {
          setSearchResult(response.data);
          setFormState((prev) => ({
            ...prev,
            name: response.data.name,
            number: response.data.contactNumber,
            email: response.data.email,
          }));
        }
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", "Search failed", "error");
        console.error("Search error:", error);
      });
  };

  // Delivery options component
  const renderDeliveryOptions = () => (
    <FormControl component="fieldset" fullWidth style={{ marginBottom: 16 }}>
      <Typography component="legend">Delivery Options</Typography>
      <RadioGroup
        value={formState.deliveryType}
        onChange={(e) => updateForm("deliveryType", e.target.value)}
      >
        <FormControlLabel
          value="takeaway"
          control={<Radio />}
          label="Take Away"
        />
        <FormControlLabel
          value="delivery"
          control={<Radio />}
          label="Delivery"
        />
      </RadioGroup>
    </FormControl>
  );

  // Travel mode component
  const renderTravelMode = () =>
    formState.deliveryType === "delivery" && (
      <FormControl component="fieldset" fullWidth style={{ marginBottom: 16 }}>
        <Typography component="legend">Travel Mode</Typography>
        <RadioGroup
          value={formState.travelMode}
          onChange={(e) => updateForm("travelMode", e.target.value)}
        >
          <FormControlLabel
            value="vehicle"
            control={<Radio />}
            label={
              <>
                <DirectionsCar fontSize="small" /> By Vehicle
              </>
            }
          />
          <FormControlLabel
            value="person"
            control={<Radio />}
            label={
              <>
                <DirectionsWalk fontSize="small" /> By Person
              </>
            }
          />
        </RadioGroup>
      </FormControl>
    );

  // Buy for Friend form
  const renderBuyForFriendForm = () => (
    <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
      {renderProductSelection()}
      {renderFormField("Your Name", "name")}
      {renderFormField("Your Number", "number")}
      {renderFormField("Your Email", "email")}
      {renderFormField("Friend Name", "friendName")}
      {renderFormField("Friend Number", "friendNumber", "tel")}
      {renderFormField("Price", "sizePrice")}
      {renderDeliveryOptions()}

      {formState.deliveryType === "delivery" && (
        <>
          {renderFormField("Friend Address", "friendAddress")}
          {renderFormField("Address Landmark", "landmarks")}
          {renderTravelMode()}
        </>
      )}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => handleOrderSubmission(true)}
      >
        Submit Order
      </Button>
    </div>
  );

  // Buy for Me form
  const renderBuyForMeForm = () => (
    <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Buy for Me
      </Typography>

      {renderProductSelection()}
      {renderFormField("Email", "email")}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginBottom: 16 }}
      >
        Search User
      </Button>

      {searchResult && (
        <div>
          <Typography variant="subtitle1" gutterBottom>
            User Found: {searchResult.name} <br />
            Email: ({searchResult.email}) <br />
            Number: {searchResult.contactNumber} <br />
          </Typography>
          <br />
          <Typography variant="h6" gutterBottom>
            Delivery Options:
          </Typography>
          {renderDeliveryOptions()}

          {formState.deliveryType === "delivery" && (
            <>
              {renderTravelMode()}
              {renderFormField("Delivery Address", "friendAddress")}
              {renderFormField("Landmark", "landmarks")}
            </>
          )}

          {renderFormField("Price", "sizePrice")}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleOrderSubmission(false)}
          >
            Submit Order
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <ToastContainer position="top-left" autoClose={600} />
      <Card>
        <CardHeader
          action={
            <IconButton onClick={closeOverlay}>
              <Close />
            </IconButton>
          }
          title={<Typography variant="h6">Form</Typography>}
        />
        <CardContent>
          {showOtpOverlay && (
            <AdvancedOTPOverlay
              isOpen={showOtpOverlay}
              onClose={() => setShowOtpOverlay(false)}
              onVerify={async (enteredOtp) => {
                try {
                  const response = await axios.post(
                    "http://localhost:3001/api/otp/verify",
                    {
                      otp: enteredOtp,
                      email: formState.email,
                    }
                  );

                  if (response.data.success) {
                    // Proceed with order submission
                    await submitOrder();
                    return true;
                  }
                  return false;
                } catch (error) {
                  toast.error("OTP verification failed");
                  return false;
                }
              }}
              onResend={() => {
                axios.post("http://localhost:3001/api/otp/send", {
                  email: formState.email,
                });
              }}
            />
          )}
          {formState.step === "initial" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<People />}
                onClick={() =>
                  setFormState((prev) => ({ ...prev, step: "buyToFriend" }))
                }
              >
                Buy for a Friend
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Person />}
                onClick={() =>
                  setFormState((prev) => ({ ...prev, step: "buyForMe" }))
                }
              >
                Buy for Me
              </Button>
            </div>
          )}

          {formState.step === "buyToFriend" && renderBuyForFriendForm()}
          {formState.step === "buyForMe" && renderBuyForMeForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedOrderForm;
