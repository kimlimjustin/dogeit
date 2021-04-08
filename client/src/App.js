import React, {useEffect, useState} from "react";
import axios from "axios";
import Crypto from "crypto-js";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./Components/home";
import OAuth from "./Components/Auth/oauth";
import Logout from "./Components/Auth/logout";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Recovery from "./Components/Auth/recovery";
import Verify from "./Components/Auth/verify";

import Navbar from "./Components/navbar";

const decryptFetchingData = (message) => {
    let msg = Crypto.AES.decrypt(message, process.env.REACT_APP_SECURITY_KEY);
    return msg.toString(Crypto.enc.Utf8)
}

const App = () => {
    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/profile`,{withCredentials: true})
        .then(response => {
            if(!response.data.unauthorized){
                if(response.data.encrypted){
                    setUserInfo(JSON.parse(decryptFetchingData(response.data.user)).data)
                }
            }
            else setUserInfo(false)
        })
    }, [])
    return(
        <Router>
            <Route path = "*" component = {Navbar} />
            <Switch>
                <Route exact path = "/" component = {(props) => <Home {...props} userInfo = {userInfo} />} />
                <Route path = "/login" component = {(props) => <Login {...props} userInfo = {userInfo} />} />
                <Route path = "/register" component = {(props) => <Register {...props} userInfo = {userInfo} />} />
                <Route path = "/verify" component = {Verify} />
                <Route path = "/oauth" component = {OAuth} />
                <Route path = "/logout" component = {Logout} />
                <Route path = "/recovery" component = {Recovery} />
            </Switch>
        </Router>
    )
}

export default App;