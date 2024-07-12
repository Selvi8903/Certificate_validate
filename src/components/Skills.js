import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Skill.css';

const Skills = () => {
  const [certificateName, setCertificateName] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [showHash, setShowHash] = useState(false);

  const handleViewCertificate = async (e) => {
    e.preventDefault();

    if (!certificateName || !certificateDate) {
      alert('Please enter both certificate name and date');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert('You need to be logged in to view certificates');
        return;
      }

      const q = query(
        collection(db, 'certificates'),
        where('name', '==', certificateName),
        where('date', '==', certificateDate),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const fetchedData = querySnapshot.docs.map(doc => doc.data())[0];
        setCertificateData(fetchedData);
        setShowHash(false); // Reset the showHash state when fetching new certificate data
      } else {
        alert('No certificate found with the provided details');
        setCertificateData(null);
      }
    } catch (error) {
      console.error('Error fetching certificate:', error);
      alert('Error fetching certificate. Please try again later.');
    }
  };

  return (
    <div className="upload-container1">
      <div className="up-con1">
        <div className="upload-main1">
          <h2>View Certificate</h2>
          <form onSubmit={handleViewCertificate}>
            <div className="form-group1">
              <label htmlFor="certificateName">Certificate Name:</label>
              <input
                type="text"
                id="certificateName"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
              />
            </div>
            <div className="form-group1">
              <label htmlFor="certificateDate">Certificate Date Uploaded:</label>
              <input
                type="date"
                id="certificateDate"
                value={certificateDate}
                onChange={(e) => setCertificateDate(e.target.value)}
              />
            </div>
            <button type="submit">View Certificate</button>
          </form>
        </div>
        <div className="info">
          {certificateData && (
            <div className="certificate-details1">
              <h3>Certificate Details</h3>
              <p>Certificate Name: {certificateData.name}</p>
              <p>Certificate Issuer: {certificateData.issuer}</p>
              <p>Issue Date: {certificateData.date}</p>
              <p>Certificate Type: {certificateData.type}</p>
              <p className="url1">Image: <a href={certificateData.imageUrl} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
              <div className='view'>
              <button onClick={() => setShowHash(!showHash)}>
                {showHash ? 'Hide Hash Value' : 'View Hash Value'}
              </button>
              {showHash && (
                <p>IpfsHash value: {certificateData.ipfsHash}</p>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
