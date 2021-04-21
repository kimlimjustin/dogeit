import axios from "axios"
import React, { useEffect, useState } from "react"
import encryptFetchingData from "../Lib/encryptFetchingData"

const Banner = ({subdogeit, userInfo}: any) => {
    const [info, setInfo] = useState<any>()
    const [user, setUser] = useState<any>()
    const Leave = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/subdogeit/leave`, {data: encryptFetchingData({subdogeit: info._id, name: info.name})}, {withCredentials: true})
        .then(res => setInfo(res.data))
    }
    const Join = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/subdogeit/join`, {data: encryptFetchingData({subdogeit: info._id, name: info.name})}, {withCredentials: true})
        .then(res => setInfo(res.data))
    }

    useEffect(() => {
        setInfo(subdogeit)
        setUser(userInfo)
    }, [subdogeit, userInfo])

    return(
        <div className="banner-container">
            <div className="banner">
                {subdogeit?
                <>
                    <h1 className="banner-title">{info?.description} <>{info?.dogeitors.indexOf(user._id) !== -1? <button className="joined-btn" onClick = {() =>Leave()}></button>:<button className="join-btn" onClick = {() => Join()}></button>}</></h1>
                    <h3 className="banner-subdogeit">/r/{info?.name}</h3>
                </>
                :
                String(window.location.pathname.split("/").slice(0,3).join("/")) === "/r/popular"?
                <>
                    <h1 className="banner-title">Popular</h1>
                    <h3 className="banner-subdogeit">/r/popular</h3>
                </>
                :
                <>
                </>
                }
            </div>
        </div>
    )
}

export default Banner;