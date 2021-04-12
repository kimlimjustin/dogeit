import axios from "axios";
import React, { useEffect, useState } from "react";
import { delay } from "../Lib/delay";
import encryptFetchingData from "../Lib/encryptFetchingData";
import parseQueryVariable from "../Lib/parseQueryVariable";

interface Prop{
    main: string,
    [key:string]: string
}

const Verify = (props: Prop) => {
    const [token, setToken] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    

    useEffect(() => {
        if(props?.location?.search){
            setToken(parseQueryVariable('token',props.location.search.toString())!)
        }
    }, [props])

    useEffect(() => {
        if(token){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/verify_user`, {data: encryptFetchingData({token})}, {withCredentials: true})
            .then(() => setDone(true))
            .catch(err => setError('Invalid or Expired Token...'))
        }
    }, [token])

    useEffect(() => console.log(error), [error])


    useEffect(() => {
        const Redirect = async () => {
            if(done){
                await delay(3000)
                .then(() => window.location.href = "/")
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