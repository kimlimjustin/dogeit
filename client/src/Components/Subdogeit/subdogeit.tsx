import axios from "axios";
import React, { useEffect, useState } from "react";
import Banner from "./banner";

const Subdogeit = (prop: {match: {params: {subdogeit: string}}, userInfo: string}) => {
    const [subdogeitData, setSubdogeit] = useState<any>();

    useEffect(() => {
        if(prop.match.params.subdogeit){
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
            .then(res => {
                setSubdogeit(res.data)
            })
            .catch(err => console.log(err.response))
        }
    }, [prop])
    
    return(
        <Banner subdogeit = {subdogeitData} userInfo={prop.userInfo}></Banner>
    )
}

export default Subdogeit