# MERN Authentication Template

## How to use:
- Click "Use this template" button on [GitHub](https://github.com/kimlimjustin/mern-auth-template)
- Clone your repository
- Installing Depedencies
    - Client side: on the `client` directory, type `npm install`
    - Server side: on the `server` directory, type `npm install`
- Setting Environment Variable
    - Client side
        Inside `client` folder, create a new file called `.env` which stores your informations about client side such as `REACT_APP_SERVER_URL`, `REACT_APP_GITHUB_CLIENT_ID` and `REACT_APP_SECURITY_KEY` informations.
        - Store your security key inside `REACT_APP_SECURITY_KEY` variable, note that this value must same as the `SECURITY_KEY` inside the `server/.env` file.
        - Store your server URL inside `REACT_APP_SERVER_URL` variable.
        - Store your GitHub Client ID inside `REACT_APP_GITHUB_CLIENT_ID` variable. You can get your GitHub Client ID by registering your GitHub OAuth, you can read the documentation [here](https://docs.github.com/en/developers/apps/creating-an-oauth-app).
    - Server Side
        Inside `server` folder, create a new file called `.env` which stores your informations about server side such as `ATLAS_URI`, `CLIENT_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `SECURITY_KEY` informations.
        - Store your MongoDB Atlas URI inside `ATLAS_URI` variable.
        - Store your client URL inside `CLIENT_URL` variable.
        - Store your GitHub Client ID inside `GITHUB_CLIENT_ID` variable.
        - Store your GitHub Client Secret inside `GITHUB_CLIENT_SERVER` variable.
        - Store your security inside `SECURITY_KEY` variable. Note that this value must same as the `REACT_APP_SECURITY_APP` inside the `client/.env` file.
- Running this program
    - Client side: on the `client` directory, type `npm start`
    - Server side: on the `server` directory, type `npm start`

## License
[MIT](https://github.com/kimlimjustin/mern-auth-template/blob/master/LICENSE)