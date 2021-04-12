import axios from "axios";
import React, { useEffect, useState } from "react";
import { delay } from "../Lib/delay";
import encryptFetchingData from "../Lib/encryptFetchingData";
import parseQueryVariable from "../Lib/parseQueryVariable";

interface Prop{
    main: string,
    [key:string]: string
}

const Recovery = (props: Prop) => {
    const [inputEmail, setInputEmail] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState("Enter your email address and we will send you a password reset link.")
    const [token, setToken] = useState('');
    const [tokenErr, setTokenErr] = useState('');
    const [validToken, setValidToken] = useState(false);
    const [inputPassword, setPassword] = useState('');
    const [inputConfirmation, setConfirmation] = useState('');
    const [resetPassErr, setResetPassErr] = useState('');
    const [done, setDone] = useState(false);

    const RecoverAccount = (e: React.SyntheticEvent) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/password_recovery`, {data: encryptFetchingData({email: inputEmail})}, {withCredentials: true})
        .then(res => {
            setError("")
            setStatus("A password reset link has been sent into your email address.")
        })
        .catch(err => {
            if(err.response.data.status === "002"){
                setError("You have recently requested a password recovery, please try it again in one hour.")
            }else if(err.response.data.status === "003"){
                setError("User not found")
            }else if(err.response.data.status === "005"){
                setError("Your email address is not verified. We can't recover it for you :(")
            }
        })
    }

    useEffect(() => {
        if(props?.location?.search){
            setToken(parseQueryVariable('token', props.location.search.toString())!)
        }
    }, [props])

    useEffect(() => {
        if(token){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/validate_recovery_token`, {data: encryptFetchingData({token})}, {withCredentials: true})
            .then(res => {
                if(res.data.valid){
                    setValidToken(true)
                }
            })
            .catch(() => {
                setTokenErr("Invalid token...")
            })
        }
    }, [token])

    useEffect(() => {
        if(inputPassword !== inputConfirmation) setResetPassErr("Password and confirmation must match.")
        else setResetPassErr("")
    }, [inputPassword, inputConfirmation])

    const ResetPass = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if(inputPassword === inputConfirmation){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/recover_password`, {data: encryptFetchingData({token, pass:inputPassword})}, {withCredentials: true})
            .then(res => setDone(true))
            .catch(err => {
                if(err.response.data.status === "004"){
                    setResetPassErr("Invalid ip address")
                }
            })
        }
    }


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
            {!token?
            <div className="box auth-box">
                <h1 className="box-title">Dogeit Account Recovery</h1>
                <h3 className="form-error">{error}</h3>
                <form onSubmit = {RecoverAccount}>
                    <div className="form-group form-animate">
                        <p className="form-label">{status}</p>
                        <input type = "email" className="input-animate" value = {inputEmail} onChange = {({target: {value}}) => setInputEmail(value)} required />
                        <span className="input-onFocus" />
                    </div>
                    <button className="btn form-control">Recover my account!</button>
                </form>
            </div>
            :
            <div className="box auth-box">
                {validToken?
                <>
                <h1 className="box-title">Reset Password</h1>
                {!done?<>
                <h3 className="form-error">{resetPassErr}</h3>
                <form onSubmit = {ResetPass}>
                    <div className="form-group form-animate">
                        <p className="form-label">New Password:</p>
                        <input type = "password" className="input-animate" value = {inputPassword} onChange = {({target: {value}}) => setPassword(value)} required />
                        <span className="input-onFocus" />
                    </div>
                    <div className="form-group form-animate">
                        <p className="form-label">Password Confirmation:</p>
                        <input type = "password" className="input-animate" value = {inputConfirmation} onChange = {({target: {value}}) => setConfirmation(value)} required />
                        <span className="input-onFocus" />
                    </div>
                    <button className="btn form-control">Change Password</button>
                </form></>
                :
                <p>Your password had been reseted. Redirecting you to login page in three seconds...</p>
                }
                </>
                :<>{!tokenErr?
                <h1 className="box-title">Validating token...</h1>
                :<h3 className="form-error">Invalid or expired token</h3>}</>
                }
            </div>
            }
        </div>
    )
}

export default Recovery