import axios from "axios";
import React, { useEffect, useState } from "react";
import encryptFetchingData from "../Lib/encryptFetchingData";
import parseQueryVariable from "../Lib/parseQueryVariable";

interface Prop{
    main: string,
    [key:string]: string
}

const OAuth = (props: Prop) => {
    const [error, setError] = useState('');
    const [fetched, setFetched] = useState(0) // Important for limiting react sending request
    
    useEffect(() => {
        if(props?.location?.search){
            const code = parseQueryVariable('code',props.location.search.toString())
            console.log(code)
            if(code && fetched === 0){
                const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
                axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/oauth`, {data: encryptFetchingData({code})}, {withCredentials: true})
                .then(response => {
                    if(response) window.location.href = "/"
                })
                .catch(async err => {
                    if(err.response.data.status === "001"){
                        setError("The email of your OAuth has been registered but not linked to your OAuth. Please try with another Email or OAuth.")
                    }else if(err.response.data.status === "000"){
                        setError("Access Token Required.")
                    }
                    await delay(3000).then(() => window.location.href = "/login")
                })
                setFetched(1)
            }
        }
    }, [props, fetched])
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