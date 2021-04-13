const Banner = ({subdogeit}: any) => {
    return(
        <div className="banner-container">
            <div className="banner">
                <h1 className="banner-title">{subdogeit?.description}</h1>
                <h3 className="banner-subdogeit">/r/{subdogeit?.name}</h3>
            </div>
        </div>
    )
}

export default Banner;