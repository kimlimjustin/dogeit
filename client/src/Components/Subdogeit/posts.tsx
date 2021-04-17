const Posts = ({ subdogeit }: any) => {
    return (
        <div className="posts">
            <div className="create-post-box">
                <input type="text" className="create-post-input form-control" placeholder="Create a post" onFocus={() => window.location.href = `/r/${subdogeit.name}/submit`} />
            </div>
        </div>
    )
}

export default Posts