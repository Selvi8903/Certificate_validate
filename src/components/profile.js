import React, { useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom"; // Import Navigate from react-router-dom
 // Reusing the CSS file for simplicity
import './profile.css';
function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [redirectToNavigation, setRedirectToNavigation] = useState(false); // State to control redirection

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User data does not exist");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  const handleGetStarted = () => {
    setRedirectToNavigation(true); // Set state to true when "Get Started" button is clicked
  };

  if (redirectToNavigation) {
    return <Navigate to="/Navigation" />; // Redirect to navigation page if redirectToNavigation is true
  }

  return (
    <div className="profcontainer">
    <div className="profile-container">
      {userDetails ? (
        <>
          
          <div><i class='bx bx-user-pin'></i></div>
          
          <h3>Welcome {userDetails.firstName}🫰🏻🫰🏻</h3>
          <div>
            <p>Email: {userDetails.email}</p>
            <p>First Name: {userDetails.firstName}</p>
            {/* <p>Last Name: {userDetails.lastName}</p> */}
          </div>
          
          <button  className="btn btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
        </>
      ) : (

        <p>Loading...</p>
      )}
    </div>
    </div>
  );
}

export default Profile;