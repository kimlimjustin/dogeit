import axios from "axios";
import React, { useEffect } from "react";


const Subdogeit = (prop: {match: {params: {subdogeit: string}}, userInfo: string}) => {
    useEffect(() => {
        if(prop.match.params.subdogeit){
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
            .then(res => console.log(res))
        }
    }, [prop])
    return(
        <div></div>
    )
}

export default Subdogeit