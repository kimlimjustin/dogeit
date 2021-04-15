import axios from "axios";
import React, { useEffect, useState } from "react";
import Banner from "./banner";
import FourZeroFour from "../Error/404";
import Posts from "./posts";
import About from "./about";

const Subdogeit = (prop: {match: {params: {subdogeit: string}}, userInfo: string}) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        if(prop.match.params.subdogeit){
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
            .then(res => {
                setSubdogeit(res.data)
                setNotFound(false)
            })
            .catch(err => {
                if(String(err.response.status) === "404"){
                    setNotFound(true)
                }
            })
        }
    }, [prop])
    
    return(
        <>
        {notFound
            ?<FourZeroFour />
            :<>
                <Banner subdogeit = {subdogeitData} userInfo={prop.userInfo}></Banner>
                <div className="container">
                    <Posts />
                    <About subdogeit={subdogeitData} />
                </div>
            </>
        }
        </>
    )
}

export default Subdogeit