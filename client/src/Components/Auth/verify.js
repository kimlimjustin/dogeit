import axios from "axios";
import React, { useEffect, useState } from "react";
import CryptoAES from "crypto-js/aes";

const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY;

const encryptFetchingData = data => {
    const encrypted = CryptoAES.encrypt(JSON.stringify(data), SECURITY_KEY);
    return encrypted.toString();
}

const parseQueryVariable = (variable, search) => {
    var query = search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null
}

const Verify = ({location}) => {
    const [token, setToken] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    

    useEffect(() => {
        if(location.search){
            setToken(parseQueryVariable('token',location.search))
        }
    }, [location.search])

    useEffect(() => {
        if(token){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/verify_user`, {data: encryptFetchingData({token})}, {withCredentials: true})
            .then(() => setDone(true))
            .catch(err => setError('Invalid or Expired Token...'))
        }
    }, [token])

    useEffect(() => console.log(error), [error])

    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        const Redirect = async () => {
            if(done){
                await delay(3000)
                .then(() => window.location = "/")
            }
        }
        Redirect()
    }, [done])

    return(
        <div className="container">
            <div className="box auth-box">
                {done?
                <>
                <h1 className="box-title">Verified successfully :)</h1>
                <h3 className="box-title"> Redirecting you to home page in three seconds...</h3>
                </>
                :<>
                {error?
                <h3 className="form-error">{error}</h3>
                :<h1 className="box-title">Validating token...</h1>}
                </>
                }
            </div>
        </div>
    )
}

export default Verify;