import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoAES from "crypto-js/aes";

const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY;

const encryptFetchingData = data => {
    const encrypted = CryptoAES.encrypt(JSON.stringify(data), SECURITY_KEY);
    return encrypted.toString();
}

const Register = ({userInfo}) => {
    const [inputRegisterEmail, setInputRegisterEmail] = useState('');
    const [inputRegisterUsername, setInputRegisterUsername] = useState('');
    const [inputRegisterPassword, setInputRegisterPassword] = useState('');
    const [inputRegisterPasswordConfirmation, setInputRegisterPasswordConfirmation] = useState('');
    const [inputRegisterError, setInputRegisterError] = useState('');

    useEffect(() => {
        if(userInfo){
            window.location = "/"
        }
    }, [userInfo])

    useEffect(() => {
        if(inputRegisterPassword !== inputRegisterPasswordConfirmation){
            setInputRegisterError("Password and confirmation must match.")
        }else{
            setInputRegisterError("")
        }
    }, [inputRegisterPassword, inputRegisterPasswordConfirmation])

    const RegisterUser = e => {
        e.preventDefault()
        if(inputRegisterPassword === inputRegisterPasswordConfirmation){
            axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {data: encryptFetchingData({username: inputRegisterUsername, email: inputRegisterEmail, password: inputRegisterPassword})}, {withCredentials: true})
            .then(response => {
                window.location = "/"
            })
            .catch(() => {
                setInputRegisterError("Email has been taken. Please try another.")
            })
        }
    }

    return(
        <div className="auth-main-page">
        <a className="github-login-corner" href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`} title="Login with GitHub">
            <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true"><text x="15%" y="10%" dominant-baseline="middle" text-anchor="middle" fontSize="40px" transform="translate(100,100) rotate(45)">GitHub OAuth</text><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg>
        </a>
        <div className="container">
            <div className="box auth-box">
                <h1 className="box-title">Register User</h1>
                <h3 className="form-error">{inputRegisterError}</h3>
                <form onSubmit={RegisterUser} method="POST">
                    <div className="form-group form-animate">
                        <label htmlFor="reg-username" className="form-label">Username</label>
                        <input type="text" className="input-animate" required autoComplete="username" value = {inputRegisterUsername} onChange = {({target: {value}}) => setInputRegisterUsername(value)}/>
                        <span className="input-onFocus"></span>
                    </div>
                    <div className="form-group form-animate">
                        <label htmlFor="reg-username" className="form-label">Email</label>
                        <input type="text" className="input-animate" required autoComplete="username" value = {inputRegisterEmail} onChange = {({target: {value}}) => setInputRegisterEmail(value)}/>
                        <span className="input-onFocus"></span>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group form-animate">
                                <label htmlFor="reg-password" className="form-label">Password</label>
                                <input type="password" className="input-animate" required autoComplete="new-password" value = {inputRegisterPassword} onChange = {({target: {value}}) => setInputRegisterPassword(value)} />
                                <span className="input-onFocus"></span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group form-animate">
                                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                                <input type="password" className="input-animate" required autoComplete="new-password" value = {inputRegisterPasswordConfirmation} onChange = {({target: {value}}) => setInputRegisterPasswordConfirmation(value)} />
                                <span className="input-onFocus"></span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-6">
                                <p className="form-label">Already have account? <a className="link" href="/login">Login</a></p>
                            </div>
                            <div className="col-6">
                                <p className="form-label">Forgot password? <a className="link" href="/recovery">Reset Password</a></p>
                            </div>
                        </div>
                        <button className="btn form-control">Register</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    )
}

export default Register;