import axios from "axios";
import { useEffect, useState } from "react";
import About from "./about";
import Banner from "./banner";
import Posts from "./posts";

const Popular = (prop: { userInfo: string }) => {
    const [posts, setPosts] = useState<Array<any>>([]);
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/post/all`)
        .then(res => {
            const countScore = (src:any) => src.cries + src.mads + src.cries
            setPosts(res.data.sort((a:any, b:any) => countScore(a) > countScore(b) ? -1 : 1))
        })
    }, [prop])
    return(
        <>
            <Banner userInfo = {prop.userInfo} />
            <div className="container">
                <Posts posts={posts} subdogeit = {{name: "popular"}} />
                <About isAdmin = {false} />
            </div>
        </>
    )
}

export default Popular;