import React, {Component} from 'react'

import GoogleLogin from 'react-google-login';

import {Redirect} from 'react-router-dom';

import axios from 'axios'

export class LoginByGoogle extends Component {

    constructor(props) {

        super(props);

        this.state = {};

        // this.signup = this

        //   .signup

        //   .bind(this);

    }

    signup(res) {

        const googleresponse = {

            Name: res.profileObj.name,

            email: res.profileObj.email,

            token: res.googleId,

            Image: res.profileObj.imageUrl,

            ProviderId: 'Google'


        };


        debugger;

        axios.post('http://localhost:60200/Api/Login/SocialmediaData', googleresponse)

            .then((result) => {

                let responseJson = result;

                sessionStorage.setItem("userData", JSON.stringify(result));

                this.props.history.push('/Dashboard')

            });

    };

    render() {

        const responseGoogle = (response) => {

            console.log(response);

            var res = response.profileObj;

            console.log(res);

            debugger;

            this.signup(response);

        }

        return (

            <div className="App">

                <div className="row">

                    <div className="col-sm-12 btn btn-info">

                        Login With Google Using ReactJS

                    </div>

                </div>

                <div className="row">

                    <div style={{'paddingTop': "20px"}} className="col-sm-12">

                        <div className="col-sm-4"/>

                        <div className="col-sm-4">

                            <GoogleLogin

                                clientId="277387142817-veuud45dkct39ivh7qmjq2v8muf3ju85.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                cookiePolicy={'single_host_origin'}
                                onSuccess={(e) => sendToken(e)}
                                onAutoLoadFinished={() => console.log("Auto load Finished")}
                                onFailure={(e) => console.log(e)}/>

                        </div>

                        <div className="col-sm-4"/>

                    </div>

                </div>

            </div>

        )

    }

}


const sendToken = (e) => {
    axios.post("http://localhost:8000/auth", {token: e.tokenId}).then((data) => {
        console.log("Token sent");
        console.log(data);
    }).catch((err) => {
        console.log("Token not sent");
        console.log(err);
    });
};

export default LoginByGoogle
