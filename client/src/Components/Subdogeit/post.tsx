import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import FourZeroFour from "../Error/404";
import About from "./about"
import Banner from "./banner"

const Post = (prop: { match: { params: { subdogeit: string, post: string } }, userInfo: string }) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [postData, setPostData] = useState<any>();
    const [creatorData, setCreatorData] = useState<any>();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
                .then(res => {
                    setSubdogeit(res.data)
                    setNotFound(false)
                    if(prop.match.params.post){
                        axios.get(`${process.env.REACT_APP_SERVER_URL}/post/get/${prop.match.params.post}`)
                        .then(res => {
                            setPostData(res.data.post)
                            setCreatorData(res.data.creator)
                            setNotFound(false)
                        })
                        .catch(err => {
                            if(String(err.response.status) === "404"){
                                setNotFound(true)
                            }
                        })
                    }
                })
                .catch(err => {
                    if (String(err.response.status) === "404") {
                        setNotFound(true)
                    }
                })
        }
    }, [prop])

    return (
        <>
            {notFound ?
                <FourZeroFour />
                :
                <>
                    <Banner subdogeit={subdogeitData} userInfo={prop.userInfo}></Banner>
                    <div className="container">
                        <div className="posts">
                            <div className="post-box">
                                <p className="post-info">Posted by /u/{creatorData?.name} {moment(postData?.createdAt).fromNow()}</p>
                                <h2>{postData?.title}</h2>
                                {postData?.type === "image"?
                                postData?.image.map((img:any) => {
                                    return <img src = {`${process.env.REACT_APP_SERVER_URL}/${img.filename}`} alt = {postData?.title} key={img.filename} />
                                })
                                :postData?.type === "post"?
                                <p className="markdown-texts"><ReactMarkdown>{postData?.body}</ReactMarkdown></p>
                                :postData?.type === "link"?
                                <a href = {postData?.link} target = "_blank" className="post-link" rel="noreferrer">{postData?.link}</a>
                                :<></>
                                }
                            </div>
                        </div>
                        <About />
                    </div>
                </>
            }
        </>
    )
}

export default Post