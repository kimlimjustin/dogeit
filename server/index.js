const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const CryptoAES = require('crypto-js/aes');
const CryptoENC = require('crypto-js/enc-utf8');

require('dotenv').config();
require('./Router/auth')

const app = express();
const server = http.createServer(app);

app.use(express.json())
app.use(cors({origin: process.env.CLIENT_URL, optionsSuccessStatus: 200, credentials: true}));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL)
	res.setHeader("Access-Control-Allow-Methods", 'GET, POST, DELETE')
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type', "Authorization")
    res.setHeader("Access-Control-Allow-Credentials", true)
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next();
})

const decryptFetchingData = (message) => {
    let msg = CryptoAES.decrypt(message, process.env.SECURITY_KEY);
    return msg.toString(CryptoENC)
}

app.use((req, res, next) => {
    if(req.body.data){
        req.body = JSON.parse(decryptFetchingData(req.body.data))
    }
    next()
})

const USER_ROUTER = require('./Router/user.router');

app.use('/auth', USER_ROUTER);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))

const URI = process.env.ATLAS_URI;
mongoose.connect(URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})