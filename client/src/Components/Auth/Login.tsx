import React, { useEffect, useState } from "react";
import axios from "axios";
import encryptFetchingData from "../Lib/encryptFetchingData";
import { Link } from "react-router-dom";

interface Prop{
    main: string,
    [key:string]: string
}

const Login = (prop: Prop) => {
    const [inputLoginEmail, setInputLoginEmail] = useState('');
    const [inputLoginPassword, setInputLoginPassword] = useState('');
    const [inputLoginError, setInputLoginError] = useState('');

    useEffect(() => {
        if(prop.userInfo){
            window.location.href = "/"
        }
    }, [prop])

    const LoginForm = (event:  React.SyntheticEvent) => {
        event.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {data: encryptFetchingData({email: inputLoginEmail, password: inputLoginPassword})}, {withCredentials: true})
        .then(response =>{
            window.location.href = "/"
        })
        .catch(err => {
            setInputLoginError("Email and/or password does not match.")
        })
    }

    return(
        <div className="auth-main-page">
        <a className="github-login-corner" href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`} title="Login with GitHub">
            <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true"><text x="15%" y="10%" dominantBaseline="middle" textAnchor="middle" fontSize="40px" transform="translate(100,100) rotate(45)">GitHub OAuth</text><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" className="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path></svg>
        </a>
        <div className="container">
            <div className="box auth-box">
                <h1 className="box-title">Login User</h1>
                <h3 className="form-error">{inputLoginError}</h3>
                <form onSubmit={LoginForm} method="POST">
                    <div className="form-group form-animate">
                        <label htmlFor="login-username" className="form-label">Email</label>
                        <input type="text" className="input-animate" required autoComplete="email" value={inputLoginEmail} onChange = {({target: {value}}) => setInputLoginEmail(value)} />
                        <span className="input-onFocus"></span>
                    </div>
                    <div className="form-group form-animate">
                        <label htmlFor="login-password" className="form-label">Password</label>
                        <input type="password" className="input-animate" required autoComplete="current-password" value = {inputLoginPassword} onChange = {({target: {value}}) => setInputLoginPassword(value)} />
                        <span className="input-onFocus"></span>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-6">
                                <p className="form-label">Don't have account yet? <Link className="link" to="/register">Register</Link></p>
                            </div>
                            <div className="col-6">
                                <p className="form-label">Forgot password? <Link className="link" to="/recovery">Reset Password</Link></p>
                            </div>
                        </div>
                        <button className="btn form-control">Login</button>
                        <Link className="github-oauth-button btn form-control" to={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`} title="Login with GitHub">Login with GitHub</Link>
                    </div>
                </form>
            </div>
        </div>
        </div>
    )
}

export default Login;