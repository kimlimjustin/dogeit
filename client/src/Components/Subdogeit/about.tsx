import moment from "moment";
import { Link } from "react-router-dom";
const About = ({subdogeit, isAdmin}: {subdogeit?: any, isAdmin: boolean}) => {
    return(
        <div className="about">
            {window.location.pathname === "/" ?<></>
            :<div className="about-box">
                <h3 className="about-title">About Community</h3>
                {String(window.location.pathname.split("/").slice(0,3).join("/")) === "/r/popular"?
                <p className="about-description">Popular posts over Dogeit</p>:
                <>
                    <p className="about-description">{subdogeit?.description}</p>
                    <hr/>
                    <p>Created {moment(subdogeit?.createdAt).format("Do MMMM YYYY")}</p>
                </>}
                {isAdmin?
                    <Link className="btn setting-btn" to={`/r/${subdogeit?.name}/setting`}>Setting</Link>
                :<></>}
            </div>
            }
            <div className="about-box">
                <h3 className="about-title">About Dogeit</h3>
                <p className="about-description">Dogeit is the Doge version of reddit licensed under the MIT License. Please drop a like at <a href="https://github.com/kimlimjustin/dogeit" className="link">GitHub</a> if you like to :)</p>
            </div>
        </div>
    )
}

export default About;