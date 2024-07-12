const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

admin.initializeApp({
    credential: admin.credential.cert(require('./path/to/serviceAccountKey.json')),
    storageBucket: 'uploadedcertificate.appspot.com'
});

const bucket = admin.storage().bucket();

app.get('/verify-certificate/:filename', async (req, res) => {
    const { filename } = req.params;
    const tempFilePath = path.join(__dirname, filename);

    try {
        await bucket.file(`certificates/${filename}`).download({ destination: tempFilePath });
        console.log(`Downloaded ${filename} to ${tempFilePath}`);

        // Verify the certificate using OpenSSL
        exec(`openssl x509 -in ${tempFilePath} -noout -text`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.json({ success: false, message: 'Certificate verification failed', error: stderr });
            }

            // Check for certain conditions to determine if the certificate is valid
            const isValid = stdout.includes('Certificate');
            const message = isValid ? 'Certificate is valid' : 'Certificate is invalid';

            res.json({ success: true, message, details: stdout });
        });
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.json({ success: false, message: 'Error retrieving file', error });
    } finally {
        // Clean up the temporary file
        fs.unlink(tempFilePath, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
