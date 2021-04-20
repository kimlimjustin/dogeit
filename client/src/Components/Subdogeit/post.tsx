import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import FourZeroFour from "../Error/404";
import encryptFetchingData from "../Lib/encryptFetchingData";
import About from "./about"
import Banner from "./banner"

const Post = (prop: { match: { params: { subdogeit: string, post: string } }, userInfo: any }) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [postData, setPostData] = useState<any>();
    const [creatorData, setCreatorData] = useState<any>();
    const [notFound, setNotFound] = useState(false);
    const [cried, setCried] = useState<boolean>();
    const [laughed, setLaughed] = useState<boolean>();
    const [madded, setMadded] = useState<boolean>();

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
                .then(res => {
                    setSubdogeit(res.data.subdogeit)
                    setNotFound(false)
                    if(prop.match.params.post){
                        axios.get(`${process.env.REACT_APP_SERVER_URL}/post/get/${prop.match.params.post}`)
                        .then(res => {
                            setPostData(res.data.post)
                            setCreatorData(res.data.creator)
                            setNotFound(false)
                            if(res.data.post.cries.indexOf(prop.userInfo._id) === -1) setCried(false)
                            else setCried(true)
                            if(res.data.post.laughs.indexOf(prop.userInfo._id) === -1) setLaughed(false)
                            else setLaughed(true)
                            if(res.data.post.mads.indexOf(prop.userInfo._id) === -1) setMadded(false)
                            else setMadded(true)
                        })
                        .catch(err => {
                            console.log(err)
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

    const laughExpression = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/post/laugh`, {data: encryptFetchingData({url: prop.match.params.post})}, {withCredentials: true})
        .then(res => setLaughed(!laughed))
    }

    const cryExpression = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/post/cry`, {data: encryptFetchingData({url: prop.match.params.post})}, {withCredentials: true})
        .then(res => setCried(!cried))
    }

    const madExpression = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/post/mad`, {data: encryptFetchingData({url: prop.match.params.post})}, {withCredentials: true})
        .then(res => setMadded(!madded))
    }

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
                                <div className="markdown-texts"><ReactMarkdown>{postData?.body}</ReactMarkdown></div>
                                :postData?.type === "link"?
                                <a href = {postData?.link} target = "_blank" className="post-link" rel="noreferrer">{postData?.link}</a>
                                :<></>
                                }
                            </div>
                        </div>
                        <About />
                    </div>
                    <div className="post-expressions">
                        {!cried?
                        <img src={`${process.env.PUBLIC_URL}/Icon/cry.jpg`} alt="Cry" className="post-expression" title="Cry" onClick = {() => cryExpression()} />:<img src={`${process.env.PUBLIC_URL}/Icon/cry.jpg`} alt="Uncry" className="post-expression expressed" title="Uncry" onClick = {() => cryExpression()} />
                        }
                        {!laughed?
                        <img src={`${process.env.PUBLIC_URL}/Icon/laugh.jpg`} alt="Laugh" className="post-expression" title="Laugh" onClick = {() => laughExpression()} />
                        :<img src={`${process.env.PUBLIC_URL}/Icon/laugh.jpg`} alt="Unlaugh" className="post-expression expressed" title="Unlaugh" onClick = {() => laughExpression()} />
                        }
                        {!madded?
                        <img src={`${process.env.PUBLIC_URL}/Icon/mad.jpg`} alt="Mad" className="post-expression" title="Mad" onClick = {() => madExpression()} />
                        :<img src={`${process.env.PUBLIC_URL}/Icon/mad.jpg`} alt="Unmad" className="post-expression expressed" title="Unmad" onClick = {() => madExpression()} />
                        }
                    </div>
                </>
            }
        </>
    )
}

export default Post