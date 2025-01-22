import React, { useState } from "react";
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
} from "@mui/material";

import {
  ArrowBack,
  Close,
  People,
  Person,
  DirectionsCar,
  DirectionsWalk,
  Search
} from "@mui/icons-material";



const AdvancedOrderForm = ({ closeOverlay }) => {
  const [formState, setFormState] = useState({
    step: "initial",
    buyType: "",
    name: "",
    address: "",
    email: "",
    number: "",
    landmarks: "",
    deliveryType: "",
    travelMode: "",
    otp: "",
    size: "",
    price: "",
  });

  const prices = {
    Small: "$10",
    Medium: "$20",
    Large: "$30",
  };

  const updateForm = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
      price: key === "size" ? prices[value] : prev.price,
    }));
  };

  const resetForm = () => {
    setFormState({
      step: "initial",
      buyType: "",
      name: "",
      address: "",
      email: "",
      number: "",
      landmarks: "",
      deliveryType: "",
      travelMode: "",
      otp: "",
      size: "",
      price: "",
    });
  };

  const renderInitialStep = () => (
    <div className="space-y-4">
      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<People />}
        onClick={() => {
          updateForm("step", "buyToFriend");
          updateForm("buyType", "Buy for a Friend");
        }}
      >
        Buy for a Friend
      </Button>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<Person />}
        onClick={() => {
          updateForm("step", "buyForMe");
          updateForm("buyType", "Buy for Me");
        }}
      >
        Buy for Me
      </Button>
    </div>
  );

  const renderFormField = (label, key, type = "text", placeholder = "") => (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      type={type}
      placeholder={placeholder}
      value={formState[key]}
      onChange={(e) => updateForm(key, e.target.value)}
    />
  );

  const renderSizeAndPriceDropdown = () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <FormControl fullWidth>
        <Typography>Size</Typography>
        <Select
          value={formState.size}
          onChange={(e) => updateForm("size", e.target.value)}
        >
          <MenuItem value="Small">Small</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Large">Large</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Typography>Price</Typography>
        <TextField
          variant="outlined"
          value={formState.price}
          disabled
        />
      </FormControl>
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
    <FormControl>
      <Typography>Travel Mode</Typography>
      <RadioGroup
        value={formState.travelMode}
        onChange={(e) => updateForm("travelMode", e.target.value)}
      >
        <FormControlLabel
          value="vehicle"
          control={<Radio />}
          label={
            <>
              By Vehicle <DirectionsCar fontSize="small" />
            </>
          }
        />
        <FormControlLabel
          value="person"
          control={<Radio />}
          label={
            <>
              By Person <DirectionsWalk fontSize="small" />
            </>
          }
        />
      </RadioGroup>
    </FormControl>
  );

  const renderBuyToFriendForm = () => (
    <div className="space-y-4">
      {renderFormField("Name", "name", "text", "Friend's Name")}
      {renderFormField("Address", "address", "text", "Friend's Address")}
      {renderFormField("Email", "email", "email", "Friend's Email")}
      {renderFormField("Number", "number", "tel", "Friend's Phone Number")}
      {renderFormField("Landmarks", "landmarks", "text", "Nearby Landmarks")}
      {renderSizeAndPriceDropdown()}
      {renderDeliveryOptions()}
      {formState.deliveryType === "delivery" && renderTravelMode()}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => updateForm("step", "otp")}
      >
        Request Order
      </Button>
    </div>
  );

  const renderBuyForMeForm = () => (
    <div className="space-y-4">
      {renderFormField("Email", "email", "email", "Your Email")}
      <Button
        fullWidth
        variant="contained"
        color="primary"
      >
        Search
      </Button>
      {renderFormField("Name", "name", "text", "Your Name")}
      {renderFormField("Number", "number", "tel", "Your Phone Number")}
      {renderFormField("Address", "address", "text", "Your Address")}
      {renderFormField("Landmarks", "landmarks", "text", "Nearby Landmarks")}
      {renderSizeAndPriceDropdown()}
      {renderDeliveryOptions()}
      {formState.deliveryType === "delivery" && renderTravelMode()}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => updateForm("step", "otp")}
      >
        Request Order
      </Button>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-4">
      {renderFormField("Enter 6-digit OTP", "otp", "text", "000000")}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => alert("Order placed successfully!")}
      >
        Order Now
      </Button>
    </div>
  );

  const renderBackButton = () => (
    <div style={{ marginBottom: "16px" }}>
    <Button
      startIcon={<ArrowBack />}
      onClick={() => updateForm("step", "initial")}
      variant="outlined"
    >
      Back
    </Button>
    </div>
  );
<br/>
const renderCloseButton = () => (
  <IconButton
    onClick={() => {
      console.log("Close button clicked");
      closeOverlay(); // This closes the overlay
    }}
    style={{ position: "absolute", top: "10px", right: "10px" }}
  >
    <Close />
  </IconButton>
);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
      }}
    >
      <Card
        style={{
          position: "relative",
          padding: 16,
          maxWidth: 400,
          width: "90%",
          margin: "auto",
        }}
      >
        <CardHeader
          title={<Typography variant="h6">{formState.buyType || "Order Form"}</Typography>}
        />
        <CardContent>
        {renderCloseButton()} {/* Ensure the close button is rendered */}
        {formState.step !== "initial" && renderBackButton()}
        {formState.step === "initial" && renderInitialStep()}
        {formState.step === "buyToFriend" && renderBuyToFriendForm()}
        {formState.step === "buyForMe" && renderBuyForMeForm()}
        {formState.step === "otp" && renderOtpStep()}
      </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedOrderForm;
