import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Register.css"; // Import the CSS file

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data to Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: fname,
        lastName: lname,
        photo: "",
      });

      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="upload-container5">
      <div className="up-con5"></div>
      <div className="upload-main5">
        <form onSubmit={handleRegister}>
          <h3>Sign Up</h3>
          <div className="form-group5">
            <label>First name</label>
            <input
              type="text"
              className="form-control5"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>
          <div className="form-group5">
            <label>Last name</label>
            <input
              type="text"
              className="form-control5"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
          <div className="form-group5">
            <label>Email address</label>
            <input
              type="email"
              className="form-control5"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group5">
            <label>Password</label>
            <input
              type="password"
              className="form-control5"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered? <Link to="/login" style={{ color: 'white', textAlign: 'center', textDecoration: 'none' }}>Login</Link>

          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
