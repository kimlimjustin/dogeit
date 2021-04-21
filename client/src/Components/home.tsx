import axios from "axios";
import { useEffect, useState } from "react";
import About from "./Subdogeit/about";
import Banner from "./Subdogeit/banner";
import Posts from "./Subdogeit/posts";

const Home = (prop: {userInfo: any}) => {
    const [posts, setPosts] = useState<Array<any>>([]);
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/post/all`)
        .then(res => {
            setPosts(res.data)
        })
    }, [])
    return(
        <>
            <div className="container">
                <Posts posts={posts} subdogeit = {{name: "popular"}} />
                <About />
            </div>
        </>
    )
}

export default Home;