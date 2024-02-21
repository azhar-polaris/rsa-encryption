import { useState } from 'react';
import { 
  fetchPublicKey, pemToBuffer, 
  encryptData, arrayBufferToBase64, 
  sendDataToBackend 
} from "./utils";

const MAIN_STYLE = {
  padding: 20, display: "flex", height: "100vh",
  justifyContent: "center", alignItems: "center",
}

const CONTAINER_STYLE = {
  display: "flex", flexDirection: "column",
  maxWdith: 500, border: '3px solid red',
  padding: 50, gap: 20, borderRadius: 3
}

const App = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [currentPublicKey, setCurrentPublicKey] = useState(null);

  const handleSubmit = async () => {
    let currentKey = currentPublicKey
    if (!currentPublicKey){
      const { success, key } = await fetchPublicKey();
      if (!success) return;
      setCurrentPublicKey(key);
      currentKey = key;
    }

    const publicKeyArrayBuffer = pemToBuffer(currentKey);
    const stringifiedData = JSON.stringify(formData);
    const { success, data} = await encryptData(publicKeyArrayBuffer, stringifiedData);
    if(!success) return;
    const stringData = arrayBufferToBase64(data);
    sendDataToBackend(stringData);
  }

  const handleChangeForm = (label, val) => {
    setFormData(prevData => ({ ...prevData, [label]: val }))
  }
  
  return (
    <div style={MAIN_STYLE}>
      <div style={CONTAINER_STYLE}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleChangeForm('email', e.target.value)}
        placeholder="Email"
      />
      <input
        type="text"
        value={formData.password}
        onChange={(e) => handleChangeForm('password', e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSubmit}>Encrypt and Send</button>
    </div>
    </div>
  );
};

export default App;
