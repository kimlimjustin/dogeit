import React, { useState } from "react";

const CreateSubdogeit = () => {
    const [inputCommunityName, setInputCommunityName] = useState('');
    const [inputCommunityDescription, setInputCommunityDescription] = useState('');
    const [inputCommunityType, setinputCommunityType] = useState('Public')
    const submitSubdogeit = () => {
        
    }
    return(
        <form className="container mt-2" onSubmit = {submitSubdogeit}>
            <h1 className="box-title">Create Community</h1>
            <div className="form-group form-animate">
                <h3 className="form-label">Community Name:</h3>
                <input type="text" className="input-animate" value = {inputCommunityName} onChange = {({target: {value}}) => setInputCommunityName(value)} required />
                <span className="input-onFocus"></span>
            </div>
            <div className="form-group form-animate">
                <h3 className="form-label">Community Description:</h3>
                <textarea className="input-animate" required onChange = {({target: {defaultValue}}) => setInputCommunityDescription(defaultValue)}>{inputCommunityDescription}</textarea>
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