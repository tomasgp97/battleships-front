import React, {useEffect, useState} from "react";
import NavBar from "./NavBar";
import Button from "@material-ui/core/Button";
import socketIOClient from "socket.io-client";
import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

const ENDPOINT = "http://127.0.0.1:5000";
const socket = socketIOClient(ENDPOINT);

export default function Lobby() {

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const name = userData["name"]
    const googleId = userData["googleId"]
    const [gameReady, setGameReady] = useState(false)

    const history = useHistory()

    useEffect(() => {
        socket.on("set_opponent", data => {
            if (data["opponent"].id !== googleId) {
                console.log(data["opponent"])
                sessionStorage.setItem("opponent", JSON.stringify(data["opponent"]));
                sessionStorage.setItem("room", JSON.stringify(data["room"]))
                history.push('/setup')
            }
        });
    })


    function gameIsReady() {
        setGameReady(true)
        socket.emit("game_ready", {
            id: googleId
        })
    }


    function cancel() {
        setGameReady(false)
        socket.emit("cancel_game_ready", {
            id: googleId
        })
    }

    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(20),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: "center",
        },
        avatar: {
            margin: theme.spacing(3),
        },
        buttons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            margin: theme.spacing(3),
        }
    }));

    const styles = useStyles()

    return (
        <div>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box className={styles.paper}>
                    <Typography component="h1" variant="h5">
                        Welcome {name}
                    </Typography>
                    <Grid container className={styles.buttons}>
                        <Grid item >
                            <Button variant="outlined" color={"inherit"} disabled={gameReady}
                                    onClick={() => gameIsReady()}>
                                Find opponent
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color={"inherit"} disabled={!gameReady} onClick={() => cancel()}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                    {gameReady && <CircularProgress color={"inherit"}/>}
                </Box>
            </Container>
        </div>
    )
}
