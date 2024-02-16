import { useState } from 'react';
import { 
  fetchPublicKey, pemToBuffer, 
  encryptData, arrayBufferToBase64, 
  sendDataToBackend 
} from "./utils";



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
    const { success, data} = await encryptData(publicKeyArrayBuffer, formData);
    if(!success) return;
    const stringData = arrayBufferToBase64(data);
    sendDataToBackend(stringData);
  }

  const handleChangeForm = (label, val) => {

  }

  
  return (
    <div>
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
  );
};

export default App;
