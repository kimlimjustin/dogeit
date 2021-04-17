import React, {useEffect, useState} from "react";
import axios from "axios";
import decryptFetchingData from "./Components/Lib/decryptFetchingData"

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./Components/home";
import OAuth from "./Components/Auth/oauth";
import Logout from "./Components/Auth/logout";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Recovery from "./Components/Auth/recovery";
import Verify from "./Components/Auth/verify";

import Navbar from "./Components/navbar";
import CreateSubdogeit from "./Components/Subdogeit/create";
import Subdogeit from "./Components/Subdogeit/subdogeit";
import CreatePost from "./Components/Subdogeit/submit";


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
            <Route path = "*" component = {(props) => <Navbar {...props} userInfo = {userInfo} />} />
            <Switch>
                <Route exact path = "/" component = {(props) => <Home {...props} userInfo = {userInfo} />} />
                <Route path = "/login" component = {(props) => <Login {...props} userInfo = {userInfo} />} />
                <Route path = "/register" component = {(props) => <Register {...props} userInfo = {userInfo} />} />
                <Route path = "/subdogeit/create" component = {(props) => <CreateSubdogeit {...props} userInfo = {userInfo} />} />
                <Route path = "/verify" component = {Verify} />
                <Route path = "/oauth" component = {OAuth} />
                <Route path = "/logout" component = {Logout} />
                <Route path = "/recovery" component = {Recovery} />
                <Route path = "/r/:subdogeit/submit" component = {(props) => <CreatePost {...props} userInfo = {userInfo} />} />
                <Route path = "/r/:subdogeit" component = {(props) => <Subdogeit {...props} userInfo = {userInfo} />} />
            </Switch>
        </Router>
    )
}

export default App;