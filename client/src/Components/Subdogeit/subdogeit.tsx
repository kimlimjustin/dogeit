import axios from "axios";
import React, { useEffect, useState } from "react";


const Subdogeit = (prop: {match: {params: {subdogeit: string}}, userInfo: string}) => {
    const [subdogeit, setSubdogeit] = useState({});

    useEffect(() => {
        if(prop.match.params.subdogeit){
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
            .then(res => setSubdogeit(res.data))
            .catch(err => console.log(err.response))
        }
    }, [prop])
    return(
        <div></div>
    )
}

export default Subdogeit