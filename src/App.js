// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Verification from './components/Verification';
import Profile from './components/profile';
import SignUp from "./components/Register";
import { auth, db } from "./components/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AlertProvider, AlertContext } from './components/AlertContext';
function App() {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsConnected(!!user);
      if (user) {
        fetchUserData(user);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async (user) => {
    const docRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserDetails(docSnap.data());
    }
  };

  const handleLogin = () => {
    setIsConnected(true);
  };

  const handleGetStarted = () => {
    setIsConnected(true);
  };

  return (
    <AlertProvider>
    <Router>
      
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/profile" element={<Profile onGetStarted={handleGetStarted} />} />
        <Route path="/navigation/*" element={<Navigation userDetails={userDetails} isConnected={isConnected} onConnect={handleLogin} />} />
        <Route path="/" element={<AppRouter user={user} />} />
      </Routes>
    </Router>
  </AlertProvider>
  );
}

function AppRouter({ user }) {
  if (user) {
    return (
      <>
        <Profile onGetStarted={() => {}} />
        <Navigate to="/navigation/Home" />
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

function LoginPage({ onLogin }) {
  const handleLogin = () => {
    // Add your login logic here
    // After successful login, call the onLogin function
    onLogin();
  };

  return (
    <Login onLogin={handleLogin} />
  );
}

export default App;
