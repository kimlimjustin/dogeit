const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../Models/user.model');
const Subdogeit = require('../Models/subdogeit.model');
const Post = require('../Models/post.model');
const fs = require('fs');

const parseJwt = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

const parseHeader = cookie => {
    return { key: cookie.split('=')[0], value: cookie.split('=')[1] }
}

const generateToken = (n) => {
    const randomToken = require('random-token').create(process.env.SECURITY_KEY);
    return randomToken(n);
}

router.post('/create', jsonParser, (req, res) => {
    if (req.headers.cookie) {
        let user = parseJwt(parseHeader(req.headers.cookie).value).user
        User.findOne({ email: user.email, name: user.name, secret_token: user.secret_token }, async (err, user) => {
            if (err || !user) res.status(400).json({ "message": "Unauthenticated" })
            else {
                Subdogeit.findOne({ _id: req.body.subdogeit }, (err, subdogeit) => {
                    if (err || !subdogeit) res.status(404).json({ "message": "Subdogeit not found." })
                    else {
                        if (req.body.type === "post") {
                            const post = new Post({ title: req.body.title, url: req.body.title.replace(/\s/, '-').toLowerCase() + '-' + generateToken(5), subdogeit: subdogeit._id, type: "post", body: req.body.body })
                            post.save()
                                .then(() => res.json({ "message": "Success" }))
                        } else if (req.body.type === "link") {
                            const post = new Post({ title: req.body.title, url: req.body.title.replace(/\s/, '-').toLowerCase() + '-' + generateToken(5), subdogeit: subdogeit._id, type: "link", link: req.body.link })
                            post.save()
                                .then(() => res.json({ "message": "Success" }))
                        } else if (req.body.type === "image") {
                            const post = new Post({ title: req.body.title, url: req.body.title.replace(/\s/, '-').toLowerCase() + '-' + generateToken(5), subdogeit: subdogeit._id, type: "image", link: req.body.link , image: []})
                            req.body.image.forEach(img => {
                                let newAvatarName = `POST_IMAGE_${generateToken(10)}.png`;
                                let base64Data = img.replace(/^data:image\/png;base64,/, "");
                                fs.writeFile(`${__dirname}/../Public/${newAvatarName}`, base64Data, {encoding: 'base64'}, err => {if(err)console.log(err)})
                                post.image.push({filename: newAvatarName})
                            })
                            post.save()
                                .then(() => res.json({ "message": "Success" }))
                        }
                    }
                })
            }
        })
    } else res.status(400).json({ "message": "Unauthorized" })
})

module.exports = router;