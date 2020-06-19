import React, {useEffect, useState} from "react";
import NavBar from "./NavBar";
import Button from "@material-ui/core/Button";
import socketIOClient from "socket.io-client";
import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

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
            if (data["opponent"].id !== this.googleId) {
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


    return (
        <div>
            <NavBar/>
            <Container component="main" maxWidth="xs">
                <Typography>
                    <div> Welcome {name} </div>
                </Typography>
                <Button variant="primary" disabled={gameReady} onClick={() => gameIsReady()}>
                    Find opponent
                </Button>
                <Button variant="secondary" disabled={gameReady} onClick={() => cancel()}>
                    Cancel
                </Button>
            </Container>
        </div>
    )
}
