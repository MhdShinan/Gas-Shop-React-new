import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Whychoose from './components/Why-choose-us';
import ProductCard from './components/ProductCard';
import OrderForm from './components/Order-form';
import ProductGrid from './components/Product';
import Hero from './components/Hero';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdvancedAdmin from './components/AdvancedAdmin';
import Sighnin from './components/Sighnin';
import FloatingButtons from './components/FloatingButtons';
import AdvancedOrderForm from './components/AdvancedOrderForm'; // Corrected import
import Allproducts from "./components/AllProducts";
// import SettingsPage from './components/SettingsPage';
import AdvancedOTPOverlay from "./components/AdvancedOTPOverlay"; // Corrected import

const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <h1>404 - Page Not Found</h1>
    </div>
  );
};

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Get the current location (path)

  // Function to handle login success (you can replace this with real login logic)
  const handleSignIn = () => {
    setIsAuthenticated(true); // Set authenticated to true when the user logs in
  };

  return (
    <div className="app">
      <div className="page-content">
        <Routes>
          {/* Redirect to Sign-In page if not authenticated */}
          {!isAuthenticated && (
            <>
              <Route
                path="*"
                element={<Navigate to="/sign-in" replace />}
              />
              <Route
                path="/sign-in"
                element={<Sighnin onSignIn={handleSignIn} />}
              />
            </>
          )}

          {/* Authenticated Routes */}
          {isAuthenticated && (
            <>
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <br />
                    <Hero />
                    <br />
                    <Whychoose />
                    <br />
                    <ProductCard />
                    <ProductGrid />
                    <Allproducts />
                    <Contact />
                    <Footer />
                  </>
                }
              />
              <Route path="/Order-form" element={<OrderForm />} />
              <Route path="/admin" element={<AdvancedAdmin />} />
              <Route path="/sign-in" element={<Navigate to="/" replace />} />
              {/* <Route path='/settings' element={<SettingsPage />}/> */}
              <Route path='/form' element={<AdvancedOrderForm />}/>
              <Route path='/newotp' element={<AdvancedOTPOverlay />}/> {/* Corrected component usage */}
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Conditionally render FloatingButtons only when not on the sign-in page */}
      {location.pathname !== '/sign-in' && <FloatingButtons />}
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
