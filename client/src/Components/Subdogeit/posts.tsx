import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Link } from "react-router-dom"

const Posts = ({ subdogeit, posts }: any) => {
    useEffect(() => console.log(posts), [posts])
    return (
        <div className="posts">
            <div className="create-post-box">
                <input type="text" className="create-post-input form-control" placeholder="Create a post" onFocus={() => window.location.href = `/r/${subdogeit.name}/submit`} />
            </div>
            {posts.map((post:any) => {
                return <Link key = {post._id} to = {`/r/${subdogeit.name}/posts/${post.url}`} className="link-to-post">
                    <div className="post-box">
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
    )
}

export default Posts