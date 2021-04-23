# Dogeit
🐶 Doge version of reddit.

![Dogeit demo](https://drive.google.com/uc?export=view&id=1E9MtGSK6GanZC4KzIMgJksa3Mpysv8DP)

## Local Setup
- Clone this repository or fork it
- Navigate to `client` directory
    - Run `yarn` or `npm i`.
    - Create a new file called `.env` which stores environment variables such as:
        - `REACT_APP_SERVER_URL`, your server endpoint
        - `REACT_APP_GITHUB_CLIENT_ID`, your GitHub OAuth Client ID
        - `REACT_APP_SECURITY_KEY`, a random token used to secure your application
    - Start application by running `npm start` or `yarn start`
- Navigate to `server` directory
    - Run `yarn` or `npm i`
    - Create a new file called `.env` which stores environment variables such as:
        - `GITHUB_CLIENT_ID`, your GitHUb OAuth Client ID
        - `GITHUB_CLIENT_SECRET`, your GitHUB OAuth Client Secret
        - `CLIENT_URL`, your client endpoint
        - `ATLAS_URI`, your MongoDB Atlas URI
        - `SECURITY_KEY`, a random token used to secure your application, note that this token value must be the same as `REACT_APP_SECURITY_KEY` value in `client/.env` file
        - `EMAIL_ADDRESS`, Your Email Address
        - `EMAIL_PROVIDER`, Your Email Provider
        - `EMAIL_PASS`, Your Email Password
    - Start application by running `npm start` or `yarn start`
## License
MIT