import React from "react";

const Navbar = ({userInfo}) => {
    return(
        <div className="topnav topnav-shadow">
            <a className="topnav-brand" href="/">
                <img src = "/logo512.png" className="topnav-logo" alt="Dogeit home page" />
                <span className="topnav-desc">Dogeit</span>
            </a>
            {userInfo?
            <div className="topnav-right">
                <div className="topnav-item user-menu">
                    <img src = "/logo512.png" className="topnav-user-pp" alt={`${userInfo.name}'s profile`} />
                    <span className="topnav-desc">{userInfo.name} (1 Karma)</span>
                </div>
            </div>
            :
            <div className="topnav-right">
                <a className="topnav-item topnav-login-btn" href="/login">Login</a>
                <a className="topnav-item topnav-register-btn" href="/register">Register</a>
            </div>
            }
        </div>
    )
}

export default Navbar;