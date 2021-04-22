import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import About from "./Subdogeit/about";
import Posts from "./Subdogeit/posts";

const Home = (prop: {userInfo: any}) => {
    const [posts, setPosts] = useState<Array<any>>([]);
    const [popularPosts, setPopularPosts] = useState<Array<any>>([]);
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/post/all`)
        .then(res => {
            const countScore = (src:any) => src.cries + src.mads + src.cries
            setPosts(res.data)
            setPopularPosts(res.data.sort((a:any, b:any) => countScore(a) > countScore(b) ? -1 : 1).slice(0, 10))
        })
    }, [])
    return(
        <>
            <div className="container">
                <div className="popular-posts">
                {popularPosts.map((post:any) => {
                    return <Link key = {post._id} to = {`/r/${post.subdogeit}/posts/${post.url}`} className="link-to-post">
                        <div className="popular-post-box">
                            <h3>{post.title}</h3>
                            {post?.type === "image"?
                            <img src = {`${process.env.REACT_APP_SERVER_URL}/${post.image[0].filename}`} alt = {post?.title} key={post.image[0].filename} />
                            :post?.type === "post"?
                            <p className="markdown-texts limit-height">{post?.body}</p>
                            :post?.type === "link"?
                            <a href = {post?.link} target = "_blank" className="post-link" rel="noreferrer">{post?.link}</a>
                            :<></>
                            }
                        </div>
                    </Link>
                })}
                </div>
                <Posts posts={posts} />
                <About />
            </div>
        </>
    )
}

export default Home;