import React from 'react'
import GoogleLogin from 'react-google-login';
import {useHistory} from "react-router-dom";
import axios from 'axios'
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

export default function LoginByGoogle() {

    const history = useHistory()

    function signup(res) {
        const googleresponse = {
            googleId: res.profileObj.googleId,
            email: res.profileObj.email,
            name: res.profileObj.name,
        };
        axios.post('http://localhost:5000/register', googleresponse)
            .then((result) => {
                console.log(result)
                sessionStorage.setItem("userData", JSON.stringify(googleresponse));
                history.push('/lobby')
            });
    }

    function responseGoogle(response) {
        console.log(response);
        var res = response.profileObj;
        console.log(res);
        signup(response);
    }

    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(10),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: "space-around",
        },
        avatar: {
            margin: theme.spacing(3),
        },
    }));

    const styles = useStyles()


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={styles.paper}>
                <Avatar className={styles.avatar}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <GoogleLogin
                    clientId="277387142817-veuud45dkct39ivh7qmjq2v8muf3ju85.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    cookiePolicy={'single_host_origin'}
                    onSuccess={(e) => responseGoogle(e)}
                    onAutoLoadFinished={() => console.log("Auto load Finished")}
                    onFailure={(e) => console.log(e)}/>
            </div>
        </Container>
    )
}





