import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"

const SettingsPage = () => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [name, setName] = useState("John Doe")
  const [email] = useState("john.doe@example.com")

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  }

  const sectionStyle = {
    marginBottom: "20px",
  }

  const inputStyle = {
    marginBottom: "10px",
  }

  const nameContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  }

  const handleNameEdit = () => {
    setIsEditingName(!isEditingName)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  return React.createElement(
    "div",
    { style: containerStyle },
    React.createElement(
      Card,
      null,
      React.createElement(CardHeader, null, React.createElement(CardTitle, null, "User Settings")),
      React.createElement(
        CardContent,
        null,
        // Profile Photo and Name
        React.createElement(
          "div",
          { style: sectionStyle },
          React.createElement("img", {
            src: "/placeholder.svg?height=100&width=100",
            alt: "Profile Photo",
            style: { width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px" },
          }),
          React.createElement(
            "div",
            { style: nameContainerStyle },
            React.createElement(Label, { htmlFor: "name" }, "Name"),
            isEditingName
              ? React.createElement(Input, {
                  id: "name",
                  value: name,
                  onChange: handleNameChange,
                  style: { ...inputStyle, marginLeft: "10px", marginRight: "10px" },
                })
              : React.createElement("span", { style: { marginLeft: "10px", marginRight: "10px" } }, name),
            React.createElement(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: handleNameEdit,
              },
              React.createElement(Pencil, { className: "h-4 w-4" }),
            ),
          ),
        ),

        // Configuration
        React.createElement(
          "div",
          { style: sectionStyle },
          React.createElement("h3", null, "Configuration"),
          React.createElement(Label, { htmlFor: "email" }, "Email"),
          React.createElement(Input, {
            id: "email",
            type: "email",
            value: email,
            readOnly: true,
            style: { ...inputStyle, backgroundColor: "#f0f0f0" },
          }),
        ),

        // Password Change
        React.createElement(
          "div",
          { style: sectionStyle },
          React.createElement("h3", null, "Change Password"),
          React.createElement(Label, { htmlFor: "current-password" }, "Current Password"),
          React.createElement(Input, {
            id: "current-password",
            type: "password",
            placeholder: "Current Password",
            style: inputStyle,
          }),
          React.createElement(Label, { htmlFor: "new-password" }, "New Password"),
          React.createElement(Input, {
            id: "new-password",
            type: "password",
            placeholder: "New Password",
            style: inputStyle,
          }),
          React.createElement(Label, { htmlFor: "confirm-password" }, "Confirm New Password"),
          React.createElement(Input, {
            id: "confirm-password",
            type: "password",
            placeholder: "Confirm New Password",
            style: inputStyle,
          }),
        ),

        // Address Change
        React.createElement(
          "div",
          { style: sectionStyle },
          React.createElement("h3", null, "Change Address"),
          React.createElement(Label, { htmlFor: "address" }, "Address"),
          React.createElement(Input, {
            id: "address",
            placeholder: "Your Address",
            style: inputStyle,
          }),
        ),

        // Save Button
        React.createElement(Button, { onClick: () => alert("Settings saved!") }, "Save Changes"),
      ),
    ),
  )
}

export default SettingsPage

