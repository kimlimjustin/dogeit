import axios from "axios";
import { useEffect, useState } from "react";
import FourZeroFour from "../Error/404";
import About from "./about"
import ReactMarkdown from "react-markdown";
import encryptFetchingData from "../Lib/encryptFetchingData";
import FourZeroFive from "../Error/405";

interface Event<T = EventTarget> {
    target: T;
}

const CreatePost = (prop: { match: { params: { subdogeit: string } }, userInfo: string }) => {
    const [subdogeitData, setSubdogeit] = useState<any>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [inputTitle, setInputTitle] = useState("");
    const [inputText, setInputText] = useState('');
    const [inputLink, setInputLink] = useState('')
    const [preview, setPreview] = useState(false);
    const [inputFileErr, setInputFileErr] = useState('');
    const [previewImage, setPreviewImage] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [notAllowed, setNotAllowed] = useState<boolean>(false);

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`, {withCredentials: true})
                .then(res => {
                    if (!(res.data.subdogeit.community_type === "Private" && !res.data.isAdmin)) {
                        setIsAdmin(res.data.isAdmin)
                        setSubdogeit(res.data.subdogeit)
                        setNotFound(false)
                    } else setNotAllowed(true)
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

    const submitPost = () => {
        if(!inputTitle){
            setError("Title is required.")
        }
        else if (!isLoading) {
            console.log(subdogeitData)
            axios.post(`${process.env.REACT_APP_SERVER_URL}/post/create`, { data: encryptFetchingData({ title: inputTitle, body: inputText, type: "post", subdogeit: subdogeitData._id }) }, { withCredentials: true })
                .then((res: any) => {
                    setIsLoading(false)
                    window.location.href = `/r/${subdogeitData.name}/posts/${res?.data?.url}`
                })
                .catch(() =>{
                    setError("Something went wrong. Please try again")
                    setIsLoading(false)
                })
        }
    }

    const submitLink = () => {
        if(!inputTitle){
            setError("Title is required.")
        }
        else if (!isLoading) {
            setIsLoading(true)
            axios.post(`${process.env.REACT_APP_SERVER_URL}/post/create`, { data: encryptFetchingData({ title: inputTitle, link: inputLink, type: "link", subdogeit: subdogeitData._id }) }, { withCredentials: true })
                .then((res: any) => {
                    setIsLoading(false)
                    window.location.href = `/r/${subdogeitData.name}/posts/${res?.data?.url}`
                })
                .catch(() =>{
                    setError("Something went wrong. Please try again")
                    setIsLoading(false)
                })
        }
    }

    const submitImage = () => {
        if(!inputTitle){
            setError("Title is required.")
        }
        else if (!isLoading) {
            setIsLoading(true)
            axios.post(`${process.env.REACT_APP_SERVER_URL}/post/create`, { data: encryptFetchingData({ title: inputTitle, image: previewImage, type: "image", subdogeit: subdogeitData._id }) }, { withCredentials: true })
                .then((res: any) => {
                    setIsLoading(false)
                    window.location.href = `/r/${subdogeitData.name}/posts/${res?.data?.url}`
                })
                .catch(() =>{
                    setError("Something went wrong. Please try again")
                    setIsLoading(false)
                })
        }
    }

    const uploadImage = (e: Event<HTMLInputElement>) => {
        if (e.target.files![0].size > 1048576) {
            setInputFileErr("File size should be less than 1MB.")
        } else {
            setInputFileErr('')
            const img = new Image();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")
            img.onload = () => {
                canvas.width = 900;
                canvas.height = 900;
                ctx!.drawImage(img, 0, 0, 900, 900)
                setPreviewImage([...previewImage, canvas.toDataURL()])
            }
            img.src = URL.createObjectURL(e.target.files![0])
        }
    }

    const removeImage = (img: string) => {
        setPreviewImage(previewImage.filter(image => image !== img))
    }

    return (
        <>
        {notAllowed
            ? <FourZeroFive />
            : !notFound ?
                <div className="container">
                    <h1 className="box-title mt-2">Create a post</h1>
                    <h4 className="form-error">{inputFileErr}</h4>
                    <h4 className="form-error">{error}</h4>
                    <div className="posts">
                        <div className="create-post-box">
                            <div className="tab">
                                <button className="tab-btn btn" onClick={() => switchTab("post")}>Post</button>
                                <button className="tab-btn btn" onClick={() => switchTab("image")}>Images</button>
                                <button className="tab-btn btn" onClick={() => switchTab("link")}>Link</button>
                            </div>
                            <div className="tab-content" id="post">
                                <input type="text" placeholder="Title" className="form-control create-post-input" value={inputTitle} onChange={({ target: { value } }) => setInputTitle(value)} />
                                {!preview ?
                                    <textarea rows={12} className="form-control create-post-input mt-1" placeholder="Text (markdown)" value={inputText} onChange={({ target: { value } }) => setInputText(value)}></textarea>
                                    : <div className="preview"><ReactMarkdown>{inputText}</ReactMarkdown></div>}
                                <button className="btn preview-btn" onClick={() => setPreview(!preview)}>{!preview ? "Preview" : "Continue Edit"}</button>
                                <button className="btn submit-btn ml-1" onClick={() => submitPost()}>Submit</button>
                            </div>
                            <div className="tab-content" id="image">
                                <input type="text" placeholder="Title" className="form-control create-post-input" value={inputTitle} onChange={({ target: { value } }) => setInputTitle(value)} />
                                {!previewImage.length ?
                                    <>
                                        <label className="input-file-box" htmlFor="input-file">
                                            Drag and drop images or <span className="upload-btn">Upload</span>
                                        </label>
                                        <input type="file" id="input-file" accept="image/png,image/gif,image/jpeg,video/mp4,video/quicktime" onChange={uploadImage} />
                                    </>
                                    :
                                    <>
                                        {previewImage.map(img => {
                                            return <div className='input-file' key={img}>
                                                <img src={img} alt={inputTitle} />
                                                <span className="remove-image" onClick={() => removeImage(img)}>&times;</span>
                                            </div>
                                        })}
                                        <label className="add-file-box btn form-control" htmlFor="input-file">
                                            Add images
                                        </label>
                                        <input type="file" id="input-file" accept="image/png,image/gif,image/jpeg,video/mp4,video/quicktime" onChange={uploadImage} />
                                    </>
                                }
                                <button className="btn form-control submit-btn" onClick={() => submitImage()}>Submit</button>
                            </div>
                            <div className="tab-content" id="link">
                                <input type="text" placeholder="Title" className="form-control create-post-input" value={inputTitle} onChange={({ target: { value } }) => setInputTitle(value)} />
                                <textarea name="" id="" rows={2} className="form-control create-post-input mt-1" placeholder="URL" value={inputLink} onChange={({ target: { value } }) => setInputLink(value)}></textarea>
                                <button className="btn form-control submit-btn" onClick={() => submitLink()}>Submit</button>
                            </div>
                        </div>
                    </div>
                    <About subdogeit={subdogeitData} isAdmin = {isAdmin} />
                </div>
                : <FourZeroFour />
            }
        </>
    )
}

export default CreatePost