import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Verification.css';

const Verification = () => {
  const [hashValue, setHashValue] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    try {
      setLoading(true);

      // Query Firestore for the hash value
      const q = query(
        collection(db, 'certificates'),
        where('ipfsHash', '==', hashValue)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setVerificationResult('Certificate is valid ✅');
      } else {
        setVerificationResult('Certificate is fake ❌');
      }
    } catch (error) {
      console.error('Error verifying hash value:', error);
      setVerificationResult('Error verifying certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container5">
      <div className="upload-main5">
        <h3>Verification</h3>
        <div className="form-group5">
          <label>Enter Hash Value</label>
          <input
            type="text"
            className="form-control"
            placeholder="Paste hash value here"
            value={hashValue}
            onChange={(e) => setHashValue(e.target.value)}
          />
        </div>
        <div className="d-grid mb-3">
          <button type="button" className="btn btn-primary" onClick={handleVerification} disabled={loading}>
            Verify
          </button>
        </div>
        {loading && <p>Verifying...</p>}
        {verificationResult && (
          <p className={`verification-result ${verificationResult.includes('valid') ? 'valid' : 'fake'}`}>
            {verificationResult}
          </p>
        )}
        <p className="forgot-password text-right">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Verification;
