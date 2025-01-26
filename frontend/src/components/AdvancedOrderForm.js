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
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdvancedOrderForm = ({ closeOverlay }) => {
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
          });
        });
    }
  }, []);

  // Fetch all products
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

  // Product selection with price
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
                selectedProduct?._id === product._id ? "primary" : "inherit"
              }
              onClick={() => {
                setSelectedProduct(product);
                updateForm("sizePrice", product.price);
              }}
            >
              {product.title} ({product.price}Rs)
            </Button>
          ))}
        </div>
      )}
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

    if (!selectedProduct) {
      newErrors.product = "Please select a product";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Order submission handler
  const handleSubmitOrder = () => {
    const requiredFields = ["friendName", "friendNumber"];
    if (validateFields(requiredFields)) {
      const orderData = {
        ...formState,
        product: selectedProduct?.title,
        price: formState.sizePrice,
      };

      Swal.fire({
        title: "Order Submitted",
        html: `
          <div>
            <p>Product: ${selectedProduct?.title}</p>
            <p>Price: {orderData.price}Rs</p>
          </div>
        `,
        icon: "success",
      });
    }
  };

  // OTP handling
  const handleOtpSubmit = async (otp, email) => {
    // Changed parameter from phoneNumber to email
    try {
      const verifyResponse = await axios.post(
        "http://localhost:3001/api/otp/verify",
        {
          email, // Changed from phoneNumber to email
          otp,
        }
      );

      if (verifyResponse.data.message === "OTP verified successfully") {
        Swal.fire("Success", "OTP verified successfully!", "success");
        return true;
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Invalid OTP. Please try again.",
        "error"
      );
      return false;
    }
  };
  const handleBuyForMeOrder = async () => {
    const requiredFields = ["email", "deliveryType"];
    if (formState.deliveryType === "delivery") {
      requiredFields.push("friendAddress", "landmarks", "travelMode");
    }
  
    if (!validateFields(requiredFields) || !selectedProduct) return;
  
    try {
      const { data: otpData } = await axios.post(
        "http://localhost:3001/api/otp/send",
        { email: formState.email }
      );
  
      if (otpData.message === "OTP sent to email successfully") {
        Swal.fire({
          title: "Enter OTP",
          html: `<input type="text" id="otp-input" class="swal2-input" placeholder="Enter OTP">`,
          showCancelButton: true,
          confirmButtonText: "Verify",
          preConfirm: async () => {
            try {
              const otp = document.getElementById("otp-input").value;
              await handleOtpSubmit(otp, formState.email);
  
              const orderData = {
                ...formState,
                product: selectedProduct.title,
                price: formState.sizePrice,
              };
  
              // Changed endpoint to match backend route
              const { data: orderResponse } = await axios.post(
                "http://localhost:3001/api/orders",
                orderData
              );
  
              Swal.fire({
                title: "Order Pending",
                text: "Your order is waiting for confirmation!",
                icon: "info",
                timer: 5000
              });
  
              const checkStatus = async (orderId) => {
                try {
                  const { data } = await axios.get(
                    `http://localhost:3001/api/orders/${orderId}`
                  );
                  
                  if (data.data.status === 'accepted') {
                    Swal.fire("Success!", "Your order has been accepted!", "success");
                    return true;
                  }
                  if (data.data.status === 'declined') {
                    Swal.fire("Declined", "Your order was declined", "error");
                    return true;
                  }
                  return false;
                } catch (error) {
                  console.error("Status check failed:", error);
                  return false;
                }
              };
  
              // Start polling with 5 second intervals
              const pollInterval = setInterval(async () => {
                const resolved = await checkStatus(orderResponse.data._id);
                if (resolved) clearInterval(pollInterval);
              }, 5000);
  
            } catch (error) {
              Swal.showValidationMessage(`Order failed: ${error.response?.data?.message || error.message}`);
            }
          }
        });
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Order failed", "error");
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
    const handleBuyForFriendOrder = async () => {
      const requiredFields = ["friendName", "friendNumber", "email"];
      if (!validateFields(requiredFields) || !selectedProduct) return;
    
      try {
        // First send OTP
        const sendOtpResponse = await axios.post(
          "http://localhost:3001/api/otp/send",
          {
            email: formState.email,
          }
        );
    
        if (sendOtpResponse.data.message === "OTP sent to email successfully") {
          Swal.fire({
            title: "Enter OTP",
            html: `<input type="text" id="otp-input" class="swal2-input" placeholder="Enter OTP sent to ${formState.email}">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Verify OTP",
            preConfirm: async () => {
              const otp = document.getElementById("otp-input").value;
              const verificationSuccess = await handleOtpSubmit(
                otp,
                formState.email
              );
    
              if (verificationSuccess) {
                // Submit the actual order after successful verification
                const orderData = {
                  ...formState,
                  product: selectedProduct?.title,
                  price: formState.sizePrice,
                };
    
                // Send order to backend
                await axios.post("http://localhost:3001/api/orders", orderData);
    
                Swal.fire({
                  title: "Order Submitted",
                  html: `
                    <div>
                      <p>Product: ${selectedProduct?.title}</p>
                      <p>Price: ${orderData.price}Rs</p>
                      <p>Friend's Name: ${orderData.friendName}</p>
                      <p>Friend's Number: ${orderData.friendNumber}</p>
                    </div>
                  `,
                  icon: "success",
                });
              }
            },
          });
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to send OTP",
          "error"
        );
      }
    };
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
  
      {/* Updated button to use new handler */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleBuyForFriendOrder}
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
            onClick={handleBuyForMeOrder}
          >
            Submit Order
          </Button>
        </div>
      )}
    </div>
  );
  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} />

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
