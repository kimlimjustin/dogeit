import axios from "axios";
import React, { useEffect, useState } from "react";
import Banner from "./banner";
import FourZeroFour from "../Error/404";
import Posts from "./posts";
import About from "./about";

const Subdogeit = (prop: { match: { params: { subdogeit: string } }, userInfo: string }) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [posts, setPosts] = useState<Array<any>>([]);
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
                .then(res => {
                    setSubdogeit(res.data.subdogeit)
                    res.data.posts.forEach((post:any) => {
                        console.log(Date.now(), new Date(post.createdAt))
                        console.log(new Date(post.createdAt).getTime())
                    })
                    setPosts(res.data.posts.sort((a:any, b:any) => {
                        const countScore = (src:any) => (src.cries + src.mads + src.cries) - (Date.now() - new Date(src.createdAt).getTime())
                        if(countScore(a) > countScore(b)) return -1
                        else return 1
                    }))
                    setNotFound(false)
                })
                .catch(err => {
                    console.log(err)
                    if (String(err.response.status) === "404") {
                        setNotFound(true)
                    }
                })
        }
    }, [prop])

    return (
        <>
            {notFound
                ? <FourZeroFour />
                : <>
                    <Banner subdogeit={subdogeitData} userInfo={prop.userInfo}></Banner>
                    <div className="container">
                        <Posts subdogeit={subdogeitData} posts = {posts} />
                        <About subdogeit={subdogeitData} />
                    </div>
                </>
            }
        </>
    )
}

export default Subdogeit