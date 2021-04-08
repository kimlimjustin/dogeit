import React, { useEffect } from "react";

const Home = (props) => {
    useEffect(() => {
        console.log(props)
    }, [props])
    return(
        <div></div>
    )
}

export default Home;