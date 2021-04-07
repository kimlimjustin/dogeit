const EmailVerification = token => {
    return `
    <!doctype html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Dogeit account recovery</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>
<body style="margin: 0px; background-color: #f2f3f8;">
<center style="margin: 20px">
<img width="100" src="https://drive.google.com/uc?export=view&id=1PYagp2N6VZMS5l1OnuIUL73Oy4gClNKj" title="logo" alt="logo" style="margin: 40px;">
<div style="max-width:670px;background:#202124; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);padding:40px;">
    <h1 style="color:#e4d919; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Please verify your email address</h1>
    <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
    <p style="color:#a1a48e; font-size:15px;line-height:24px; margin:0;">
    You are receiving this because you (or someone else) registered Dogeit account.
    </p>
    <a href="${process.env.CLIENT_URL}/verify?token=${token}" style="background:#e29f20;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email Address</a>
</div>
</center>
</body>
</html>
    `
}

module.exports = EmailVerification