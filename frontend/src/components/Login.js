import React, { useState } from "react"
import { FaGasPump, FaBox, FaHome, FaUser, FaCog, FaChartBar, FaBars, FaTimes } from "react-icons/fa"
import Swal from "sweetalert2"

const AdvancedAdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [gasName, setGasName] = useState("")
  const [gasPrice, setGasPrice] = useState("")
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleAddGas = (e) => {
    e.preventDefault()
    Swal.fire({
      icon: "success",
      title: "Gas Added",
      text: `${gasName} has been added with price $${gasPrice}`,
      background: "#f0f8ff",
      confirmButtonColor: "#4a90e2",
    })
    setGasName("")
    setGasPrice("")
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    Swal.fire({
      icon: "success",
      title: "Product Added",
      text: `${productName} has been added with price $${productPrice}`,
      background: "#f0fff0",
      confirmButtonColor: "#4a90e2",
    })
    setProductName("")
    setProductPrice("")
  }

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Logging Out",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonColor: "#4a90e2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
      background: "#fff0f5",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out.",
          background: "#f0f8ff",
        }).then(() => {
          // Redirect logic here
          console.log("Redirect to home page")
        })
      }
    })
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={styles.dashboardGrid}>
            <div style={styles.dashboardItem}>
              <h3>Total Sales</h3>
              <p style={styles.dashboardValue}>$15,234</p>
            </div>
            <div style={styles.dashboardItem}>
              <h3>Products</h3>
              <p style={styles.dashboardValue}>143</p>
            </div>
            <div style={styles.dashboardItem}>
              <h3>Gas Types</h3>
              <p style={styles.dashboardValue}>5</p>
            </div>
            <div style={styles.dashboardItem}>
              <h3>Customers</h3>
              <p style={styles.dashboardValue}>1,234</p>
            </div>
          </div>
        )
      case "addGas":
        return (
          <section style={styles.section}>
            <h2>
              <FaGasPump /> Add Gas
            </h2>
            <form onSubmit={handleAddGas}>
              <input
                type="text"
                placeholder="Gas Name"
                value={gasName}
                onChange={(e) => setGasName(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Gas Price"
                value={gasPrice}
                onChange={(e) => setGasPrice(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>
                Add Gas
              </button>
            </form>
          </section>
        )
      case "addProducts":
        return (
          <section style={styles.section}>
            <h2>
              <FaBox /> Add Products
            </h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>
                Add Product
              </button>
            </form>
          </section>
        )
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ ...styles.sidebar, width: isSidebarOpen ? "250px" : "0" }}>
        <button style={styles.closeButton} onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <div style={styles.sidebarContent}>
          <h2 style={styles.sidebarTitle}>Admin Dashboard</h2>
          <a
            href="#"
            onClick={() => {
              setActiveTab("dashboard")
              toggleSidebar()
            }}
            style={styles.sidebarLink}
          >
            <FaChartBar /> Dashboard
          </a>
          <a
            href="#"
            onClick={() => {
              setActiveTab("addGas")
              toggleSidebar()
            }}
            style={styles.sidebarLink}
          >
            <FaGasPump /> Add Gas
          </a>
          <a
            href="#"
            onClick={() => {
              setActiveTab("addProducts")
              toggleSidebar()
            }}
            style={styles.sidebarLink}
          >
            <FaBox /> Add Products
          </a>
          <a href="#" onClick={handleLogout} style={styles.sidebarLink}>
            <FaHome /> Logout
          </a>
        </div>
      </div>

      <div style={styles.mainContent}>
        <nav style={styles.navbar}>
          <div style={styles.navbarBrand}>
            <button style={styles.menuButton} onClick={toggleSidebar}>
              <FaBars />
            </button>
            Admin Dashboard
          </div>
          <div style={styles.navbarLinks}>
            <button
              style={{ ...styles.navbarLink, ...(activeTab === "dashboard" ? styles.activeLink : {}) }}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaChartBar /> Dashboard
            </button>
            <button
              style={{ ...styles.navbarLink, ...(activeTab === "addGas" ? styles.activeLink : {}) }}
              onClick={() => setActiveTab("addGas")}
            >
              <FaGasPump /> Add Gas
            </button>
            <button
              style={{ ...styles.navbarLink, ...(activeTab === "addProducts" ? styles.activeLink : {}) }}
              onClick={() => setActiveTab("addProducts")}
            >
              <FaBox /> Add Products
            </button>
            <button style={styles.navbarLink} onClick={handleLogout}>
              <FaHome /> Logout
            </button>
          </div>
          <div style={styles.navbarUser}>
            <FaUser /> Admin
          </div>
        </nav>

        <main style={styles.main}>
          <h1 style={styles.pageTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          {renderContent()}
        </main>

        <footer style={styles.footer}>
          <p>&copy; 2023 Admin Dashboard. All rights reserved.</p>
          <FaCog style={styles.footerIcon} />
        </footer>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f8ff",
  },
  sidebar: {
    height: "100vh",
    position: "fixed",
    zIndex: 1,
    top: 0,
    left: 0,
    backgroundColor: "#2c3e50",
    overflowX: "hidden",
    transition: "0.5s",
    paddingTop: "60px",
  },
  sidebarContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
  },
  sidebarTitle: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
    color: "#ecf0f1",
  },
  sidebarLink: {
    padding: "10px 15px",
    textDecoration: "none",
    fontSize: "18px",
    color: "#ecf0f1",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "0.3s",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: "0",
    transition: "margin-left .5s",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#3498db",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navbarBrand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  menuButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  navbarLinks: {
    display: "flex",
    gap: "1rem",
  },
  navbarLink: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  activeLink: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  navbarUser: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  main: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "8px",
    margin: "1rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  pageTitle: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#2980b9",
  },
  section: {
    marginBottom: "2rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    margin: "0.5rem 0",
    borderRadius: "4px",
    border: "1px solid #bdc3c7",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#2980b9",
    border: "none",
    color: "white",
    padding: "0.75rem 1.5rem",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "1rem",
    margin: "0.5rem 0",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#34495e",
    color: "white",
    marginTop: "auto",
  },
  footerIcon: {
    fontSize: "1.5rem",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  dashboardItem: {
    backgroundColor: "#ecf0f1",
    padding: "1rem",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  dashboardValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2980b9",
  },
}

export default AdvancedAdminPage

