import Crypto from "crypto-js";
const decryptFetchingData = (message: string) => {
    let msg = Crypto.AES.decrypt(message, process.env.REACT_APP_SECURITY_KEY!);
    return msg.toString(Crypto.enc.Utf8)
}

export default decryptFetchingData;