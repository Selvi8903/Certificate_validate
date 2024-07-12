import React, { useState } from 'react';
import Web3 from 'web3';
import CertificateStorageABI from './CertificateStorageABI.json';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import * as pdfjsLib from 'pdfjs-dist';
import axios from 'axios';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import './upload.css';

const pdfworker = import('pdfjs-dist/build/pdf.worker');

// Pinata API keys
const PINATA_API_KEY = 'e8f83cfae3cd59f5760d';
const PINATA_SECRET_API_KEY = '6ec547881b0fc8b748a2ac2cd26a6d172f60da1e43476a1b3bd28882155b1d0c';

const contractAddress = '0x62f6ae90A62169dC8a4c56E63CA5c61484dd051b'; // Update with your contract address
const web3 = new Web3(window.ethereum);

const certificateStorageContract = new web3.eth.Contract(CertificateStorageABI, contractAddress);

const Upload = () => {
  const [certificateName, setCertificateName] = useState('');
  const [certificateIssuer, setCertificateIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const storage = getStorage();

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const extractTextFromPDF = async (pdfFile) => {
    try {
      const data = new Uint8Array(await pdfFile.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach(item => {
          text += item.str + ' ';
        });
      }
      return text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw error;
    }
  };

  const verifyNPTELCertificate = (pdfText) => {
    const nptelPattern = /NPTEL|Certificate of completion/i;
    const startindex = pdfText.search(nptelPattern);
    if (startindex === -1) {
      throw new Error("Certificate is not valid");
    }

    const verificationResult = { isValid: true };

    const nameMatch = pdfText.match(/Participant Name: (.*)/);
    const courseMatch = pdfText.match(/Course Name: (.*)/);
    const idMatch = pdfText.match(/Certificate ID: (.*)/);

    if (!nameMatch || !courseMatch || !idMatch) {
      verificationResult.isValid = true;
      verificationResult.error = "Required information missing.";
      return verificationResult;
    }

    verificationResult.name = nameMatch[1].trim();
    verificationResult.course = courseMatch[1].trim();
    verificationResult.id = idMatch[1].trim();

    return verificationResult;
  };

  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });
  
    return res.data.IpfsHash;
  };
  
  const storeHashInBlockchain = async (hash) => {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0]; 
  
    await certificateStorageContract.methods.storeCertificateHash(hash).send({ from: sender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You need to be logged in to upload a certificate');
        setLoading(false);
        return;
      }

      // Upload to Firebase
      const storageRef = ref(storage, `certificates/${user.uid}/${certificateFile.name}`);

      await uploadBytes(storageRef, certificateFile);
      const certificateUrl = await getDownloadURL(storageRef);

      // Extract text from PDF and verify
      let validationMessage = '';
      let ipfsHash = '';
      if (certificateName && certificateIssuer && certificateFile) {
        const certificateText = await extractTextFromPDF(certificateFile);
        const verificationResult = verifyNPTELCertificate(certificateText);

        if (!verificationResult.isValid) {
          validationMessage = `Certificate verification failed: ${verificationResult.error}`;
        } else {
          // Upload to Pinata
          ipfsHash = await uploadToPinata(certificateFile);
          // Store hash in blockchain
          await storeHashInBlockchain(ipfsHash);
        }
      }

      // Store details in Firestore
      await addDoc(collection(db, 'certificates'), {
        name: certificateName,
        issuer: certificateIssuer,
        date: issueDate,
        imageUrl: certificateUrl,
        ipfsHash: ipfsHash,
        userId: user.uid,
        uploadedAt: serverTimestamp(),
      });

      alert(validationMessage || `Certificate uploaded successfully! IPFS Hash: ${ipfsHash}`);

      // Reset the state variables
      setCertificateName('');
      setCertificateIssuer('');
      setIssueDate('');
      setCertificateFile(null);
    } catch (error) {
      console.error('Error uploading certificate:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="up-con"></div>
      <div className="upload-main">
        <h2>Upload Certificate</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="certificateName">Certificate Name:</label>
            <input type="text" id="certificateName" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="certificateIssuer">Certificate Issuer:</label>
            <input type="text" id="certificateIssuer" value={certificateIssuer} onChange={(e) => setCertificateIssuer(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="issueDate">Issue Date:</label>
            <input type="date" id="issueDate" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="certificateFile">Choose File:</label>
            <input type="file" id="certificateFile" onChange={handleFileUpload} accept=".pdf" />
          </div>
          <button type="submit" disabled={loading}>Upload</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Upload;
