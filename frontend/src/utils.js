export function pemToBuffer(pem) {
    const base64 = pem
        .replace(/-----BEGIN (.*)-----/, '')
        .replace(/-----END (.*)-----/, '')
        .replace(/\s/g, '');

    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

export const encryptData = async (publicKey, data) => {
    try {
        const cryptoKey = await window.crypto.subtle.importKey(
            'spki',
            publicKey,
            {
                name: 'RSA-OAEP',
                hash: { name: 'SHA-256' },
            },
            true,
            ['encrypt']
        );

        const encryptedArrayBuffer = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            cryptoKey,
            new TextEncoder().encode(data)
        );

        return { success: true, data: encryptedArrayBuffer };
    } catch (error) {
    }
    return { success: false }
};

export const fetchPublicKey = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/public-key');
        const data = await response.json();
        return { success: true, key: data }
    } catch (error) {
        return { success: false }
    }
};

export const sendDataToBackend = async (encryptedData) => {
    try {
        // Send the encrypted data to the server
        const response = await fetch('http://localhost:3001/api/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ encryptedData })
        });

        const data = await response.json();
        console.log(data, "<=====response")
    } catch (error) {
        console.error(error)
    }
}

export const arrayBufferToBase64 = (arrayBuffer) => {
    const binary = [];
    const bytes = new Uint8Array(arrayBuffer);
    bytes.forEach((byte) => {
        binary.push(String.fromCharCode(byte));
    });
    return btoa(binary.join(''));
};