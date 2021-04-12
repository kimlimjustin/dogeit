import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import encryptFetchingData from "../Lib/encryptFetchingData";

interface Prop{
    main: string,
    [key:string]: string
}

const CreateSubdogeit = (prop: Prop) => {
    const [inputCommunityName, setInputCommunityName] = useState('');
    const [inputCommunityDescription, setInputCommunityDescription] = useState('');
    const [inputCommunityType, setinputCommunityType] = useState('Public');
    const [redirect, setRedirect] = useState('');
    const [err, setErr] = useState('')

    const submitSubdogeit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/subdogeit/create`, {data: encryptFetchingData({name: inputCommunityDescription, description: inputCommunityDescription, community_type: inputCommunityType})}, {withCredentials: true})
        .then(res => console.log(res))
        .catch(err => {
            if(err.response.data.status === "006"){
                setErr(`${inputCommunityName} exists`)
            }else{
                setErr("Something went wrong.")
            }
        })
    }
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        const checkVerified = async () =>{
            delay(1000)
            .then(() => {
                if(prop.userInfo !== "" && !prop.userInfo){
                    setRedirect('/')
                }
            })
        }
        checkVerified()
    }, [prop])

    useEffect(() =>{
        setInputCommunityName(inputCommunityName.replace(/\s/, '-'))
    },[inputCommunityName])
    return(
        <form className="container mt-2" onSubmit = {submitSubdogeit}>
            {redirect?<Redirect to={redirect}></Redirect>:<></>}
            <h1 className="box-title">Create Community</h1>
            <h3 className="form-error">{err}</h3>
            <div className="form-group form-animate">
                <h3 className="form-label">Community Name:</h3>
                <input type="text" className="input-animate" value = {inputCommunityName} onChange = {({target: {value}}) => setInputCommunityName(value)} required />
                <span className="input-onFocus"></span>
            </div>
            <div className="form-group form-animate">
                <h3 className="form-label">Community Description:</h3>
                <textarea className="input-animate" required onChange = {({target: {value}}) => setInputCommunityDescription(value)} defaultValue = {inputCommunityDescription}></textarea>
                <span className="input-onFocus"></span>
            </div>
            <div className="form-group">
                <h3 className="form-label">Community Type:</h3>
                <div className="m-05">
                    <input type="radio" name="communityType" id="Public" defaultValue = "Public" required checked = {"Public" === inputCommunityType} onChange = {({target: {value}}) => setinputCommunityType(value)} />
                    <label htmlFor="Public">Public</label>
                </div>
                <div className="m-05">
                    <input type="radio" name="communityType" id="Restricted" defaultValue = "Restricted" checked = {"Restricted" === inputCommunityType} onChange = {({target: {value}}) => setinputCommunityType(value)}/>
                    <label htmlFor="Restricted">Restricted</label>
                </div>
                <div className="m-05">
                    <input type="radio" name="communityType" id="Private" defaultValue ="Private" checked = {"Private" === inputCommunityType} onChange = {({target: {value}}) => setinputCommunityType(value)}/>
                    <label htmlFor="Private">Private</label>
                </div>
            </div>
            <div className="form-group">
                <input type="submit" value="Create Community" className="btn form-control create-community-btn"/>
            </div>
        </form>
    )
}

export default CreateSubdogeit