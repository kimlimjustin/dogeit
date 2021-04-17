import axios from "axios";
import { useEffect, useState } from "react";
import FourZeroFour from "../Error/404";
import About from "./about"

const CreatePost = (prop: { match: { params: { subdogeit: string } }, userInfo: string }) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`)
                .then(res => {
                    setSubdogeit(res.data)
                    setNotFound(false)
                })
                .catch(err => {
                    if (String(err.response.status) === "404") {
                        setNotFound(true)
                    }
                })
        }
    }, [prop])

    const switchTab = (tab: string) => {
        document.querySelectorAll<HTMLElement>(".tab-content").forEach(content => {
            content.style.display = "none"
        })
        document.querySelector<HTMLElement>(`#${tab}`)!.style.display = "block"
    }
    return (
        <>
            {!notFound ?
                <div className="container">
                    <h1 className="box-title mt-2">Create a post</h1>
                    <div className="posts">
                        <div className="create-post-box">
                            <div className="tab">
                                <button className="tab-btn btn" onClick={() => switchTab("post")}>Post</button>
                                <button className="tab-btn btn" onClick={() => switchTab("image")}>Images</button>
                                <button className="tab-btn btn" onClick={() => switchTab("link")}>Link</button>
                            </div>
                            <div className="tab-content" id="post">
                                <input type="text" placeholder="Title" className="form-control create-post-input" />
                                <textarea name="" id="" rows={5} className="form-control create-post-input mt-1" placeholder="Text (markdown)"></textarea>
                            </div>
                            <div className="tab-content" id="image">
                                <input type="text" placeholder="Title" className="form-control create-post-input" />
                                <label className="input-file-box" htmlFor="input-file">
                                    Drag and drop images or <span className="upload-btn">Upload</span>
                                </label>
                                <input type="file" id="input-file" accept="image/png,image/gif,image/jpeg,video/mp4,video/quicktime" />
                            </div>
                            <div className="tab-content" id="link">
                                <input type="text" placeholder="Title" className="form-control create-post-input" />
                                <textarea name="" id="" rows={2} className="form-control create-post-input mt-1" placeholder="URL"></textarea>
                            </div>
                        </div>
                    </div>
                    <About subdogeit={subdogeitData} />
                </div>
                : <FourZeroFour />
            }
        </>
    )
}

export default CreatePost