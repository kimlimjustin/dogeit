import CryptoAES from "crypto-js/aes";

const SECURITY_KEY: string = process.env.REACT_APP_SECURITY_KEY!;

const encryptFetchingData = (data:object) => {
    const encrypted = CryptoAES.encrypt(JSON.stringify(data), SECURITY_KEY);
    return encrypted.toString();
}

export default encryptFetchingData