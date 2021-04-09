const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../Models/user.model');
const Recovery = require('../Models/recovery.models');
const axios = require('axios');
const CryptoAES = require('crypto-js/aes');
const nodemailer = require('nodemailer');
const RecoveryEmail = require("../Email/recovery.email");
const EmailVerification = require("../Email/verification.email");
//const CryptoENC = require('crypto-js/enc-utf8');
global.atob = require('atob');

require('dotenv').config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_SECRET_ID = process.env.GITHUB_CLIENT_SECRET

const SECURITY_KEY = require('random-token').create(new Date())(10)

const generateToken = (n) => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(n);
}

const encryptFetchingData = data => {
    const encrypted = CryptoAES.encrypt(JSON.stringify({data}), process.env.SECURITY_KEY);
    return encrypted.toString();
}

const mailsocket = nodemailer.createTransport({service: process.env.EMAIL_PROVIDER, auth: {user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASS}})

router.post('/register', async (req, res, next) => {
    passport.authenticate('signup', async(err, user) => {
        try{
            if(err) return next(new Error(err))
            if(user){
                req.login(user, {session: false}, async (error) => {
                    if(error) return next(error);
                    const body = {_id: user._id, email: user.email, name: user.name, secret_token: user.secret_token , profile_picture: user.profile_picture};
                    const token = jwt.sign({ user: body }, 'TOP_SECRET');
                    mailsocket.sendMail({from: `Dogeit <${process.env.mail_address}>`, to: user.email, subject: "Dogeit Email Verification", html: EmailVerification(user.verification_code)})
                    .then(() => res.cookie('token', token, {httpOnly: true}).json({token}))
                })
            }else{
                return res.status(406).json({"message": "Email has been taken."})
            }
        }catch(err){
            return next(err);
        }
    })(req, res, next);
})
router.post('/login', async(req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try{
            if(err) return res.status(400).json("Something went wrong!")
            if(!user){
                return res.status(400).json("User not found.")
            }
            req.login(user, {session: false}, async (error) => {
                if(error) return next(error);
                const body = {_id: user._id, email: user.email, name: user.name, secret_token: user.secret_token, profile_picture: user.profile_picture};
                const token = jwt.sign({ user: body }, 'TOP_SECRET');

                return res.cookie('token', token, {httpOnly: true}).json({"message": "Logged in successfully"});
            })
        }catch(err){
            return next(err);
        }
    })(req, res, next);
})

const parseJwt = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

const parseHeader = cookie => {
    return {key: cookie.split('=')[0], value: cookie.split('=')[1]}
}

router.get('/profile', jsonParser, async (req, res) => {
    if(req.headers.cookie){
        let user =parseJwt(parseHeader(req.headers.cookie).value).user
        if(user){
            const isValidUser = await User.exists({name: user.name, email: user.email, secret_token: user.secret_token})
            if(isValidUser) res.json({"message": "Authenticated", user: encryptFetchingData(user), encrypted: true})
            else return res.json({unauthorized: true})
        }else{
            return res.json({unauthorized: true})
        }
    }else return res.json({unauthorized: true})
})

router.post('/oauth', jsonParser, (req, res) => {
    const code = req.body.code;
    axios.post('https://github.com/login/oauth/access_token', {client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_SECRET_ID, code}, {headers: {accept: 'application/json' }})
    .then(result => {
        const access_token = result.data.access_token;
        if(access_token){
            axios.get('https://api.github.com/user', {headers: {Authorization: `token ${access_token}`}})
            .then(userResponse => {
                User.exists({email: userResponse.data.email}, (err, exist) => {
                    if(!exist){
                        const newUser = new User({email: userResponse.data.email, name: userResponse.data.login, password: generateToken(12), secret_token: generateToken(10), third_party: {is_third_party: true, provider: "GitHub", access_token: access_token}, verification_code: generateToken(20)})
                        newUser.save()
                        .then(() => {
                            mailsocket.sendMail({from: `Dogeit <${process.env.mail_address}>`, to: newUser.email, subject: "Dogeit Email Verification", html: EmailVerification(newUser.verification_code)})
                            .then(() => {
                                return res.cookie('token', jwt.sign({ user: {_id: newUser._id, name: newUser.name, email: newUser.email, secret_token: newUser.secret_token} }, 'TOP_SECRET'), {httpOnly: true}).json({"message": "Signed up successfully"});
                            })
                        })
                    }else{
                        User.findOne({email: userResponse.data.email}, (err, user) => {
                            if(user){
                                if(user.third_party.is_third_party){
                                    return res.cookie('token', jwt.sign({ user: {_id: user._id, name: user.name, email: user.email, secret_token: user.secret_token} }, 'TOP_SECRET'), {httpOnly: true}).json({"message": "Signed in successfully"});
                                }else{
                                    return res.status(400).json({"status": "001"})
                                }
                            }
                        })
                    }
                })
            })
        }else return res.status(400).json({"status": "000"})
    })
    .catch(err => console.log(err.response))
})

router.post('/logout', jsonParser, (req, res) => {
    return res.cookie('token', '', {maxAge: 0}).json({"message": "Logged out"})
})

router.post('/password_recovery', jsonParser, (req, res) => {
    User.findOne({email: req.body.email}, async (err, user) => {
        if(err || !user) res.status(400).json({"status": "003"})
        else{
            const alreadyRequested = await Recovery.findOne({user: user._id, ip: req.ip})
            if(alreadyRequested) res.status(400).json({"status": "002"})
            else if(!user.is_verified) res.status(400).json({"status": "005"})
            else{
                const recovery = new Recovery({token: generateToken(20), user: user._id, ip: req.ip })
                recovery.save()
                .then(() => {
                    mailsocket.sendMail({from: `Dogeit <${process.env.mail_address}>`, to: user.email, subject: "Dogeit Account Recovery", html: RecoveryEmail(recovery.token)})
                    .then(() => res.json({message: "Success"}))
                })
                .catch(err => console.log(err))
            }
        }
    })
})

router.post('/validate_recovery_token', jsonParser, async (req, res) => {
    const valid = await Recovery.findOne({token:req.body.token, ip: req.ip})
    if(valid) res.json({"valid": true})
    else res.status(400).json({"valid": false})
})

router.post('/recover_password', jsonParser, (req, res) => {
    const {token, pass} = req.body
    Recovery.findOne({token}, (err, recovery) => {
        if(!recovery || err) res.status(400).json({"message": "Something went wrong"})
        else if(recovery.ip !== req.ip) res.status(400).json({'status': "004"})
        else{
            User.findOne({_id: recovery.user}, (err, user) => {
                if(!user || err) res.status(400).json({"message": "Something went wrong"})
                else{
                    user.password = pass
                    user.save()
                    .then(() => {
                        recovery.delete()
                        .then(() => res.json({"message": "Success"}))
                    })
                }
            })
        }
    })
})

router.post('/verify_user', jsonParser, async (req, res) => {
    if(req.body.token !== "Verified"){
        const valid = await User.findOne({verification_code: req.body.token})
        if(valid){
            User.findOne({verification_code: req.body.token}, (err, user) => {
                user.verification_code = "Verified"
                user.is_verified = true
                user.save()
                .then(() => {
                    const body = {_id: user._id, email: user.email, name: user.name, secret_token: user.secret_token, profile_picture: user.profile_picture};
                    const token = jwt.sign({ user: body }, 'TOP_SECRET');
                    res.cookie('token', token, {httpOnly: true}).json({"valid": true})   
                })
            })
        }
        else res.status(400).json({"valid": false})
    }else res.status(400).json({"valid": false})
})

router.post('/update_account', jsonParser, async (req, res) => {
    if(req.headers.cookie){
        let user =parseJwt(parseHeader(req.headers.cookie).value).user
        if(user){
            User.findOne({secret_token: user.secret_token, name: user.name, email: user.email}, (err, user) => {
                if(err || !user) res.status(400).json("User not found.")
                else{
                    user.name = req.body.name
                    user.email = req.body.email
                    user.save()
                    .then(() => {
                        const body = {_id: user._id, email: user.email, name: user.name, secret_token: user.secret_token, profile_picture: user.profile_picture};
                        const token = jwt.sign({ user: body }, 'TOP_SECRET');
                        res.cookie('token', token, {httpOnly: true}).json({user: encryptFetchingData(body)})
                    })
                }
            })
        }else{
            return res.status(403).json("Request invalid.")
        }
    }else return res.status(403).json("Request invalid.")
})

module.exports = router;