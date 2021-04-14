const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../Models/user.model');
const Subdogeit = require('../Models/subdogeit.model');

const parseJwt = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

const parseHeader = cookie => {
    return {key: cookie.split('=')[0], value: cookie.split('=')[1]}
}

router.post('/create', jsonParser, (req, res) => {
    if(req.headers.cookie){
        let user =parseJwt(parseHeader(req.headers.cookie).value).user
        User.findOne({email: user.email, name: user.name, secret_token: user.secret_token}, async (err, user) => {
            if(err || !user) res.status(400).json({"message": "Unauthenticated"})
            else{
                const alrExist = await Subdogeit.exists({name: req.body.name.replace(/\s/, '-')})
                if(alrExist) res.status(400).json({"status": "006"})
                else{
                    const newSubdogeit = new Subdogeit({name: req.body.name.replace(/\s/, '-').toLowerCase(), description: req.body.description, community_type: "Public", admin: [user._id], dogeitors: [user._id]})
                    newSubdogeit.save()
                    .then(() => res.json({"message": "Success"}))
                }
            }
        })
    }else return res.status(400).json({"message": "Unauthenticated"})
})

router.get('/get/:subdogeit', (req, res) => {
    Subdogeit.findOne({name: req.params.subdogeit}, (err, subdogeit) => {
        if(err || !subdogeit) res.status(404).json({"status": "404"})
        else{
            res.json(subdogeit)
        }
    })
})

router.get('/joined', (req, res) => {
    if(req.headers.cookie){
        let user =parseJwt(parseHeader(req.headers.cookie).value).user
        User.findOne({email: user.email, name: user.name, secret_token: user.secret_token}, async (err, user) => {
            if(err || !user) res.status(400).json({"message": "Unauthenticated"})
            else{
                Subdogeit.find({dogeitors: {"$in": [user._id]}})
                .then(subdogeits => {
                    res.json(subdogeits.map(subdogeit => subdogeit.name))
                })
            }
        })
    }else return res.status(400).json({"message": "Unauthenticated"})
})

router.post('/join', jsonParser, (req, res) =>{
    if(req.headers.cookie){
        let user =parseJwt(parseHeader(req.headers.cookie).value).user
        User.findOne({email: user.email, name: user.name, secret_token: user.secret_token}, async (err, user) => {
            if(err || !user) res.status(400).json({"message": "Unauthenticated"})
            else{
                Subdogeit.findOne({_id: req.body.subdogeit, name: req.body.name}, (err, subdogeit) => {
                    if(err || !subdogeit) res.status(404).json({"message": "Subdogeit Not Found"})
                    else{
                        subdogeit.dogeitors.push(user._id)
                        subdogeit.save()
                        .then(() => res.json(subdogeit))
                    }
                })
            }
        })
    }
})

router.post('/leave', jsonParser, (req, res) =>{
    if(req.headers.cookie){
        let user =parseJwt(parseHeader(req.headers.cookie).value).user
        User.findOne({email: user.email, name: user.name, secret_token: user.secret_token}, async (err, user) => {
            if(err || !user) res.status(400).json({"message": "Unauthenticated"})
            else{
                Subdogeit.findOne({_id: req.body.subdogeit, name: req.body.name}, (err, subdogeit) => {
                    if(err || !subdogeit) res.status(404).json({"message": "Subdogeit Not Found"})
                    else{
                        subdogeit.dogeitors =  subdogeit.dogeitors.filter(value => String(value) !== String(user._id))
                        subdogeit.save()
                        .then(() => res.json(subdogeit))
                    }
                })
            }
        })
    }
})

module.exports = router