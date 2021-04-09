import axios from "axios";
import React, { useEffect, useState } from "react";
import encryptFetchingData from "../Lib/encryptFetchingData";
import parseQueryVariable from "../Lib/parseQueryVariable";

const OAuth = ({location}) => {
    const [error, setError] = useState('');
    
    useEffect(() => {
        if(location.search){
            const code = parseQueryVariable('code',location.search)
            console.log(code)
            if(code){
                const delay = ms => new Promise(res => setTimeout(res, ms));
                axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/oauth`, {data: encryptFetchingData({code})}, {withCredentials: true})
                .then(response => {
                    if(response) window.location = "/"
                })
                .catch(async err => {
                    if(err.response.data.status === "001"){
                        setError("The email of your OAuth has been registered but not linked to your OAuth. Please try with another Email or OAuth.")
                    }else if(err.response.data.status === "000"){
                        setError("Access Token Required.")
                    }
                    await delay(3000).then(() => window.location = "/login")
                })
            }
        }
    }, [location.search])
    return(
        <>
        {!error?
        <h1 className="ml-3 loading-text">Loading...</h1>
        :<><h1 className="ml-3 form-error">{error}</h1><h3 className="ml-3">Redirecting into login page in 3 seconds...</h3></>
        }
        </>
    )
}

export default OAuth;