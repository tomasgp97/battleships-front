import React, {Component} from 'react'

import GoogleLogin from 'react-google-login';

import {Redirect} from 'react-router-dom';

import axios from 'axios'

export class LoginByGoogle extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    signup(res) {
        const googleresponse = {
            googleId: res.profileObj.googleId,
            email: res.profileObj.email,
            name: res.profileObj.name,
        };
        axios.post('http://localhost:5000/register', googleresponse)
            .then((result) => {
                console.log(result)
                sessionStorage.setItem("userData", JSON.stringify(googleresponse));
                this.props.history.push('/lobby')
            });
    };

    render() {
        const responseGoogle = (response) => {
            console.log(response);
            var res = response.profileObj;
            console.log(res);
            this.signup(response);
        }

        return (
            <div className="App">
                <div style={{'paddingTop': "20px"}} className="col-sm-12">
                    <GoogleLogin
                        clientId="277387142817-veuud45dkct39ivh7qmjq2v8muf3ju85.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        cookiePolicy={'single_host_origin'}
                        onSuccess={(e) => responseGoogle(e)}
                        onAutoLoadFinished={() => console.log("Auto load Finished")}
                        onFailure={(e) => console.log(e)}/>
                </div>
            </div>
        )
    }
}


const sendToken = (e) => {
    axios.post("http://localhost:5000/register", {token: e.tokenId}).then((data) => {
        console.log("Token sent");
        console.log(data);
    }).catch((err) => {
        console.log("Token not sent");
        console.log(err);
    });
};

export default LoginByGoogle
