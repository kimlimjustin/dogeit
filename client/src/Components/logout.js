import axios from "axios";
import React, { useEffect } from "react";

const Logout = () => {
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {}, {withCredentials: true})
        .then(() => window.location = "/")
    }, [])
    return(
        <h1 className="ml-3">Logging out...</h1>
    )
}

export default Logout;