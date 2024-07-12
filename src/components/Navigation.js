import React, { useState,useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

import Home from './Home';
import Upload from './upload';
import About from './About';
import Skills from './Skills';
import './connect';
import './Navigation.css';

const Navigation = ({ userDetails, isConnected: initialIsConnected, onConnect }) => {
  const [connected, setConnected] = useState(initialIsConnected);
  const navigate = useNavigate();
  useEffect(() => {
    // Create a link element
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/boxicons@latest/css/boxicons.min.css';
    link.rel = 'stylesheet';

    // Append the link element to the head of the document
    document.head.appendChild(link);

    // Cleanup function to remove the dynamically added stylesheet when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  

  const handleLogout = () => {
    if (connected) {
      // Implement your logout logic here
      // For example, clear user details, tokens, etc.
      setConnected(false);  // Update the connected state to false
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <div className="container">
      <nav>
        {userDetails && (
          <div className="user-profile">
            <div><i class='bx bx-user-pin'></i></div>
            <div>
              <p>{userDetails.firstName}</p>
              <p>{userDetails.email}</p>
            </div>
          </div>
        )}
        
        <ul class="menu">
          <li>
          

            <Link to="/navigation/Home"><i class='bx bx-home-alt-2'>  Home</i></Link>
          </li>
          <li>
          

            <Link to="/navigation/Upload"><i class='bx bx-cloud-upload'> Upload Cert</i></Link>
          </li>
          <li>
            <Link to="/navigation/About"><i class='bx bx-ghost'> About</i></Link>
          </li>
          <li>
            <Link to="/navigation/Skills"><i class='bx bxl-trip-advisor'> View Cert</i></Link>
          </li>
        </ul>
        
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="main">
        <Routes>
          <Route path="Home" element={<Home />} />
          <Route path="Upload" element={<Upload />} />
          <Route path="About" element={<About />} />
          <Route path="Skills" element={<Skills />} />
        </Routes>
      </div>
    </div>
  );
};

export default Navigation;
