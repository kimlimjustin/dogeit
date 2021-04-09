const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../Models/user.model');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const SECURITY_KEY = require('random-token').create(new Date())(10)

const generateToken = (n) => {
    const randomToken = require('random-token').create(SECURITY_KEY);
    return randomToken(n);
}

passport.use(
    new JWTstrategy({ secretOrKey: 'TOP_SECRET', jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')},
    async (token, done) => {
        console.log(token)
        try {
            return done(null, token.user);
        } catch (error) {
            done(error);
        }
    })
);

passport.use('signup', new localStrategy({  usernameField: 'email', passwordField: 'password', passReqToCallback: true }, async (req, email, password, done) => {
    try {
        const emailExist = await UserModel.exists({email: email})
        if(emailExist) return done(null, false)
        else{
            let profilePic = {filename: ["Template/1.png", "Template/2.png", "Template/3.png", "Template/4.png", "Template/5.png"][Math.floor(Math.random() * 5)]}
            const user = await UserModel.create({ name: req.body.username , email: email, password: password, secret_token:generateToken(10), third_party: {is_third_party: false}, verification_code: generateToken(20), profile_picture: profilePic });
            return done(null, user);
        }
    } catch (error) {
        done(error);
    }
}));

passport.use('login', new localStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true}, async (req, email, password, done) => {
    UserModel.findOne({email: email}, async (err, user) => {
        if(err) return done(null, false, {message: "Something went wrong"})
        else if(!user) return done(null, false, {message: "User not found"})
        else{
            user.comparePassword(req.body.password, (err, isMatch) => {
                if(isMatch){
                    return done(null, user, {message: "Logged in Successfully"})
                }else return done(new Error("Something went wrong!"))
            })
        }
    })
}))