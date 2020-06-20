import React from 'react'
import GoogleLogin from 'react-google-login';
import {useHistory} from "react-router-dom";
import axios from 'axios'
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import NavBar from "./NavBar";

export default function LoginByGoogle() {
    const history = useHistory()

    function signup(res) {
        var id_token = res.getAuthResponse().id_token
        // var xhr = new XMLHttpRequest();
        // xhr.open('POST', 'http://localhost:5000/register');
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.onload = function(e) {
        //     debugger
        //     sessionStorage.setItem("userData", JSON.stringify(e));
        //     history.push('/lobby')
        // };
        // xhr.send(JSON.stringify({id_token: id_token}));
        axios.post('http://localhost:5000/register', JSON.stringify({id_token: id_token}), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((newres) => {
                debugger
                sessionStorage.setItem("userData", JSON.stringify(newres.data));
                history.push('/lobby')
            });
    }

    function responseGoogle(response) {
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
        <div>
            <NavBar auth={false} />
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={styles.paper}>
                    <Avatar className={styles.avatar}>
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{margin: "10px"}}>
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
        </div>

    )
}





