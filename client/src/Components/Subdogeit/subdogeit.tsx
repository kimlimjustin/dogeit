import axios from "axios";
import React, { useEffect, useState } from "react";
import Banner from "./banner";
import FourZeroFour from "../Error/404";
import Posts from "./posts";
import About from "./about";
import FourZeroFive from "../Error/405";

const Subdogeit = (prop: { match: { params: { subdogeit: string } }, userInfo: string }) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [posts, setPosts] = useState<Array<any>>([]);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [notAllowed, setNotAllowed] = useState<boolean>(false);

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`, { withCredentials: true })
                .then(res => {
                    if (!(res.data.subdogeit.community_type === "Private" && !res.data.isAdmin)) {
                        setSubdogeit(res.data.subdogeit)
                        const countScore = (src: any) => (src.cries + src.mads + src.cries) - ((Date.now() - new Date(src.createdAt).getTime()) / 100)
                        setPosts(res.data.posts.sort((a: any, b: any) => countScore(a) > countScore(b) ? 1 : -1))
                        setNotFound(false)
                    } else setNotAllowed(true)
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
            {notAllowed
                ? <FourZeroFive />
                : notFound
                    ? <FourZeroFour />
                    : <>
                        <Banner subdogeit={subdogeitData} userInfo={prop.userInfo}></Banner>
                        <div className="container">
                            <Posts subdogeit={subdogeitData} posts={posts} />
                            <About subdogeit={subdogeitData} />
                        </div>
                    </>
            }
        </>
    )
}

export default Subdogeit