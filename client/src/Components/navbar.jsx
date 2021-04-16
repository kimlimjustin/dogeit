import axios from "axios";
import React, { useEffect, useState } from "react";
import CryptoAES from "crypto-js/aes";
import Crypto from "crypto-js";
import { Link, useHistory } from "react-router-dom";

const SECURITY_KEY = process.env.REACT_APP_SECURITY_KEY;

const decryptFetchingData = (message) => {
    let msg = Crypto.AES.decrypt(message, SECURITY_KEY);
    return msg.toString(Crypto.enc.Utf8)
}

const Navbar = ({userInfo}) => {
    const history = useHistory()
    const [newUsername, setNewUsername] = useState(userInfo.name);
    const [newEmail, setNewEmail] = useState(userInfo.email);
    const [user, setUser] = useState('');
    const [inputFile, setInputFile] = useState("");
    const [inputFileErr, setInputFileErr] = useState('');
    const [loc, setLoc] = useState('Home')
    const [joinedSubdogeits, setJoinedSubdogeits] = useState([]);

    useEffect(() => {
        setUser(userInfo)
        if(userInfo){
            setInputFile(`${process.env.REACT_APP_SERVER_URL}/${userInfo.profile_picture.filename}`)
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/joined`, {withCredentials: true})
            .then(subdogeits => setJoinedSubdogeits(subdogeits.data))
        }
    }, [userInfo])

    const openSetting = () => {
        const modal = document.querySelector("#user-setting");
        modal.style.display = "block";
        modal.querySelector(".modal-close-btn").addEventListener("click", () => modal.style.display = "none")
        modal.addEventListener("click", e => {
            if(e.target === modal) modal.style.display = "none"
        })
    }
    const encryptFetchingData = data => {
        const encrypted = CryptoAES.encrypt(JSON.stringify(data), SECURITY_KEY);
        return encrypted.toString();
    }

    const editAccount = e => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/update_account`, {data: encryptFetchingData({name: newUsername, email: newEmail, pp: inputFile})}, {withCredentials: true})
        .then(res => {
            setUser(JSON.parse(decryptFetchingData(res.data.user)).data)
        })
    }

    const changeProfilePicture = e => {
        if(e.target.files[0].size > 1048576){
            setInputFileErr("File size should be less than 1MB.")
        }else{
            setInputFileErr('')
            const img = new Image();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")
            img.onload = () => {
                canvas.width = 900;
                canvas.height = 900;
                ctx.drawImage(img, 0, 0, 900, 900)
                setInputFile(canvas.toDataURL())
            }
            img.src = URL.createObjectURL(e.target.files[0])
        }
    }

    useEffect(() => {
        history.listen(loc => {
            if(loc.pathname === "/"){
                setLoc("Home")
            }else if(loc === "/r/popular"){
                setLoc("Popular")
            }else{
                setLoc(loc.pathname)
            }
        })
      
    }, [history])
    const openSubdogeit = () => {
        const modal = document.querySelector("#subdogeit");
        modal.style.display = "block";
        modal.querySelector(".modal-close-btn").addEventListener("click", () => modal.style.display = "none")
        modal.addEventListener("click", e => {
            if(e.target === modal) modal.style.display = "none"
        })
    }

    return(
        <>
            <div className="topnav topnav-shadow">
                <a className="topnav-brand" href="/">
                    <img src = "/logo512.png" className="topnav-logo" alt="Dogeit home page" />
                    <span className="topnav-desc">Dogeit</span>
                </a>
                {user?
                <span className="topnav-subdogeit topnav-item" onClick = {openSubdogeit}>
                    {loc === "Home"? <svg className="topnav-feeds-icon" viewBox="0 0 20 20"><path d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"></path></svg>:""}
                    <span className="topnav-desc">{loc}</span>
                </span>
                :null}
                {user?
                <div className="topnav-right">
                    <svg viewBox="0 0 20 20" className="topnav-item topnav-opt" onClick = {openSetting}>
                        <title>User Setting</title>
                        <path d="M17.498,11.697c-0.453-0.453-0.704-1.055-0.704-1.697c0-0.642,0.251-1.244,0.704-1.697c0.069-0.071,0.15-0.141,0.257-0.22c0.127-0.097,0.181-0.262,0.137-0.417c-0.164-0.558-0.388-1.093-0.662-1.597c-0.075-0.141-0.231-0.22-0.391-0.199c-0.13,0.02-0.238,0.027-0.336,0.027c-1.325,0-2.401-1.076-2.401-2.4c0-0.099,0.008-0.207,0.027-0.336c0.021-0.158-0.059-0.316-0.199-0.391c-0.503-0.274-1.039-0.498-1.597-0.662c-0.154-0.044-0.32,0.01-0.416,0.137c-0.079,0.106-0.148,0.188-0.22,0.257C11.244,2.956,10.643,3.207,10,3.207c-0.642,0-1.244-0.25-1.697-0.704c-0.071-0.069-0.141-0.15-0.22-0.257C7.987,2.119,7.821,2.065,7.667,2.109C7.109,2.275,6.571,2.497,6.07,2.771C5.929,2.846,5.85,3.004,5.871,3.162c0.02,0.129,0.027,0.237,0.027,0.336c0,1.325-1.076,2.4-2.401,2.4c-0.098,0-0.206-0.007-0.335-0.027C3.001,5.851,2.845,5.929,2.77,6.07C2.496,6.572,2.274,7.109,2.108,7.667c-0.044,0.154,0.01,0.32,0.137,0.417c0.106,0.079,0.187,0.148,0.256,0.22c0.938,0.936,0.938,2.458,0,3.394c-0.069,0.072-0.15,0.141-0.256,0.221c-0.127,0.096-0.181,0.262-0.137,0.416c0.166,0.557,0.388,1.096,0.662,1.596c0.075,0.143,0.231,0.221,0.392,0.199c0.129-0.02,0.237-0.027,0.335-0.027c1.325,0,2.401,1.076,2.401,2.402c0,0.098-0.007,0.205-0.027,0.334C5.85,16.996,5.929,17.154,6.07,17.23c0.501,0.273,1.04,0.496,1.597,0.66c0.154,0.047,0.32-0.008,0.417-0.137c0.079-0.105,0.148-0.186,0.22-0.256c0.454-0.453,1.055-0.703,1.697-0.703c0.643,0,1.244,0.25,1.697,0.703c0.071,0.07,0.141,0.15,0.22,0.256c0.073,0.098,0.188,0.152,0.307,0.152c0.036,0,0.073-0.004,0.109-0.016c0.558-0.164,1.096-0.387,1.597-0.66c0.141-0.076,0.22-0.234,0.199-0.393c-0.02-0.129-0.027-0.236-0.027-0.334c0-1.326,1.076-2.402,2.401-2.402c0.098,0,0.206,0.008,0.336,0.027c0.159,0.021,0.315-0.057,0.391-0.199c0.274-0.5,0.496-1.039,0.662-1.596c0.044-0.154-0.01-0.32-0.137-0.416C17.648,11.838,17.567,11.77,17.498,11.697 M16.671,13.334c-0.059-0.002-0.114-0.002-0.168-0.002c-1.749,0-3.173,1.422-3.173,3.172c0,0.053,0.002,0.109,0.004,0.166c-0.312,0.158-0.64,0.295-0.976,0.406c-0.039-0.045-0.077-0.086-0.115-0.123c-0.601-0.6-1.396-0.93-2.243-0.93s-1.643,0.33-2.243,0.93c-0.039,0.037-0.077,0.078-0.116,0.123c-0.336-0.111-0.664-0.248-0.976-0.406c0.002-0.057,0.004-0.113,0.004-0.166c0-1.75-1.423-3.172-3.172-3.172c-0.054,0-0.11,0-0.168,0.002c-0.158-0.312-0.293-0.639-0.405-0.975c0.044-0.039,0.085-0.078,0.124-0.115c1.236-1.236,1.236-3.25,0-4.486C3.009,7.719,2.969,7.68,2.924,7.642c0.112-0.336,0.247-0.664,0.405-0.976C3.387,6.668,3.443,6.67,3.497,6.67c1.75,0,3.172-1.423,3.172-3.172c0-0.054-0.002-0.11-0.004-0.168c0.312-0.158,0.64-0.293,0.976-0.405C7.68,2.969,7.719,3.01,7.757,3.048c0.6,0.6,1.396,0.93,2.243,0.93s1.643-0.33,2.243-0.93c0.038-0.039,0.076-0.079,0.115-0.123c0.336,0.112,0.663,0.247,0.976,0.405c-0.002,0.058-0.004,0.114-0.004,0.168c0,1.749,1.424,3.172,3.173,3.172c0.054,0,0.109-0.002,0.168-0.004c0.158,0.312,0.293,0.64,0.405,0.976c-0.045,0.038-0.086,0.077-0.124,0.116c-0.6,0.6-0.93,1.396-0.93,2.242c0,0.847,0.33,1.645,0.93,2.244c0.038,0.037,0.079,0.076,0.124,0.115C16.964,12.695,16.829,13.021,16.671,13.334 M10,5.417c-2.528,0-4.584,2.056-4.584,4.583c0,2.529,2.056,4.584,4.584,4.584s4.584-2.055,4.584-4.584C14.584,7.472,12.528,5.417,10,5.417 M10,13.812c-2.102,0-3.812-1.709-3.812-3.812c0-2.102,1.71-3.812,3.812-3.812c2.102,0,3.812,1.71,3.812,3.812C13.812,12.104,12.102,13.812,10,13.812"></path>
                    </svg>
                    <div className="topnav-item user-menu">
                        <img src = {`${process.env.REACT_APP_SERVER_URL}/${user.profile_picture.filename}`} className="topnav-user-pp" alt={`${user.name}'s profile`} />
                        <span className="topnav-desc">{user.name} (1 Karma)</span>
                    </div>
                </div>
                :
                <div className="topnav-right">
                    <a className="topnav-item topnav-login-btn" href="/login">Login</a>
                    <a className="topnav-item topnav-register-btn" href="/register">Register</a>
                </div>
                }
            </div>
            {user?
            <>
                <div className="modal" id="user-setting">
                    <div className="modal-content">
                        <span className="modal-close-btn">&times;</span>
                        <h1 className="box-title">User Setting</h1>
                        <form onSubmit = {editAccount}>
                            <div className="form-group">
                                <h2>Account Preference </h2>
                                <h4 className="form-error">{inputFileErr}</h4>
                            </div>
                            <label htmlFor="upload-profile-picture">
                                <div className="upload-pp-box">
                                    <img src={inputFile} alt={`${user.name}'s profile`} id="profile-picture-preview" />
                                </div>
                            </label>
                            <input id="upload-profile-picture" type="file" accept="image/*" onChange = {changeProfilePicture}></input>
                            <div className="form-group form-animate">
                                <h3 className="form-label">Username:</h3>
                                <input className="input-animate" type="text" value = {newUsername} onChange = {({target: {value}}) => setNewUsername(value)} />
                                <span className="input-onFocus"></span>
                            </div>
                            <div className="form-group form-animate">
                                <h3 className="form-label">Email Address</h3>
                                <input className="input-animate" type="text" value = {newEmail} onChange = {({target: {value}}) => setNewEmail(value)} />
                                <span className="input-onFocus"></span>
                            </div>
                            <div className="form-group">
                                <input type="submit" className="btn form-control" value = "Update my account!" />
                            </div>
                        </form>
                        <div className="form-group">
                            <a href="/logout" className="logout-btn btn form-control">Logout from this Account</a>
                        </div>
                    </div>
                </div>
                <div className="modal" id="subdogeit">
                    <div className="modal-content">
                        <span className="modal-close-btn">&times;</span>
                        <h1 className="box-title">Dogeit Feeds</h1>
                        <div className="subdogeits">
                            <Link to = "/">Home</Link>
                            <Link to = "/r/popular">Popular</Link>
                            {joinedSubdogeits.map(subdogeit =>{
                                return <Link to = {`/r/${subdogeit}`} key={subdogeit}>/r/{subdogeit}</Link>
                            })}
                            <Link to = "/subdogeit/create">Create Subdogeit</Link>
                        </div>
                    </div>
                </div>
            </>
            :null}
        </>
    )
}

export default Navbar;