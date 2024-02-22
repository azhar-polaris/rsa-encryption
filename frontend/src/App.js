import {
  fetchPublicKey,
  pemToBuffer,
  encryptData,
  arrayBufferToBase64,
  sendDataToBackendViaGet,
  sendDataToBackendViaPost
} from './utils';

import { useState, useEffect } from 'react';

const MAIN_STYLE = {
  padding: 20,
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center'
};

const CONTAINER_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  maxWdith: 500,
  border: '3px solid red',
  padding: 50,
  gap: 20,
  borderRadius: 3
};

const App = () => {
  const formData = {
    email: 'abhishekaglave@polarisgrids.com',
    password: 'abhishek'
  };

  const [key, setKey] = useState('');

  useEffect(() => {
    fetchPublicKey().then((res) => {
      console.log(res.key);
      setKey(res.key);
    });
  }, []);

  const handleSubmit = async () => {
    const publicKeyArrayBuffer = pemToBuffer(key);
    const stringifiedData = JSON.stringify(formData);
    const { success, data } = await encryptData(
      publicKeyArrayBuffer,
      stringifiedData
    );
    if (!success) return;
    const encryptedData = arrayBufferToBase64(data);
    await sendDataToBackendViaGet({ page: 1, rows: 10, encryptedData });
    await sendDataToBackendViaPost({ page: 1, rows: 10, encryptedData });
  };

  return (
    <div style={MAIN_STYLE}>
      <div style={CONTAINER_STYLE}>
        <button onClick={handleSubmit}>Encrypt and Send</button>
      </div>
    </div>
  );
};

export default App;
