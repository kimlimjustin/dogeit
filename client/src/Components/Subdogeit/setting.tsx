import axios from "axios";
import React, { useEffect, useState } from "react";
import FourZeroFour from "../Error/404";
import FourZeroFive from "../Error/405";
import encryptFetchingData from "../Lib/encryptFetchingData";

const Setting = (prop: { match: { params: { subdogeit: string } }, userInfo: string }) => {
    const [subdogeitData, setSubdogeitData] = useState<any>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [notAllowed, setNotAllowed] = useState<boolean>(false);
    const [inputCommunityDescription, setInputCommunityDescription] = useState('')
    const [inputCommunityType, setInputCommunityType] = useState('');

    useEffect(() => {
        if (prop.match.params.subdogeit) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/subdogeit/get/${prop.match.params.subdogeit}`, { withCredentials: true })
                .then(res => {
                    if (res.data.isAdmin) {
                        setSubdogeitData(res.data.subdogeit)
                        setInputCommunityDescription(res.data.subdogeit.description)
                        setInputCommunityType(res.data.subdogeit.community_type)
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

    const editCommunity = (e: React.SyntheticEvent) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/subdogeit/update`, {data: encryptFetchingData({description: inputCommunityDescription, community_type: inputCommunityType, subdogeit: subdogeitData._id})}, {withCredentials: true})
        .then(res => window.location.href = `/r/${prop.match.params.subdogeit}`)
    }

    return(
        <>
            {notAllowed
                ? <FourZeroFive />
                : notFound 
                    ? <FourZeroFour />
                    : <form className="container" onSubmit = {editCommunity}>
                        <h1 className="box-title mt-2">Community Setting</h1>
                        <div className="form-group form-animate">
                            <h3 className="form-label">Community Description:</h3>
                            <textarea className="input-animate" required onChange = {({target: {value}}) => setInputCommunityDescription(value)} defaultValue = {inputCommunityDescription}></textarea>
                            <span className="input-onFocus"></span>
                        </div>
                        <div className="form-group">
                            <h3 className="form-label">Community Type:</h3>
                            <div className="m-05">
                                <input type="radio" name="communityType" id="Public" defaultValue = "Public" required checked = {"Public" === inputCommunityType} onChange = {({target: {value}}) => setInputCommunityType(value)} />
                                <label htmlFor="Public">Public</label>
                            </div>
                            <div className="m-05">
                                <input type="radio" name="communityType" id="Private" defaultValue ="Private" checked = {"Private" === inputCommunityType} onChange = {({target: {value}}) => setInputCommunityType(value)}/>
                                <label htmlFor="Private">Private</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Update Community" className="btn form-control create-community-btn"/>
                        </div>
                    </form>
            }
        </>
    )
}

export default Setting;