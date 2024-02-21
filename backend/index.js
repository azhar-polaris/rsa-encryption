const express = require('express');
const cors = require('cors');
const forge = require('node-forge');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;

// Generate server's key pair
const rsaKeyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
const privateKeyPem = forge.pki.privateKeyToPem(rsaKeyPair.privateKey);
const publicKeyPem = forge.pki.publicKeyToPem(rsaKeyPair.publicKey);


app.get('/api/public-key', (req, res) => {
    res.json(publicKeyPem);
});

// Endpoint to receive encrypted data
app.post('/api/decrypt', (req, res) => {
    const { encryptedData } = req.body;    
    const binaryData = forge.util.decode64(encryptedData);
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decryptedData = privateKey.decrypt(binaryData, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    const finalData = JSON.parse(decryptedData);
    res.json({ msg: "success", data: finalData });
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
