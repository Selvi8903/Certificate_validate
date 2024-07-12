import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in Successfully');
      window.location.href = '/profile';
      toast.success('User logged in Successfully', {
        position: 'top-center',
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: 'bottom-center',
      });
    }
  };

  return (
    <div className='upload-container6'>
      <div className="upload-main6">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-group6">
            <label>Email address:</label>
            <input
              type="email"
              className="form-control6"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group6">
            <label>Password:</label>
            <input
              type="password"
              className="form-control6"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid6">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password6">
            New user <Link to="/register" className="register-link">Register Here</Link>
          </p>
        </form>
        <div className="verification-container6">
          <Link to="/verification">
            <button type="button" className="btn btn-secondary">
              Verification
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
