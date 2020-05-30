import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import Ship from "./battleship/lib/ship";
import Cell from "./battleship/lib/cell";
import SetupPage from "./battleship/components/settings_page";
import {Button} from "react-bootstrap";

const ENDPOINT = "http://127.0.0.1:5000";

export default class Room extends Component {
    constructor(props) {
        super();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const opponent = JSON.parse(sessionStorage.getItem('opponent'));
        const room = JSON.parse(sessionStorage.getItem('room'));
        this.name = userData["name"]
        this.googleId = userData["googleId"]
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit("join_room", {room_uuid: room, user_id: userData.googleId})
        this.state = {
            room: room,
            opponent: opponent,
            opponentReady: false,
            userData: userData,
            boardReady: false,
            currentShip: null,
            ships: Ship.generate(),
            cells: Cell.generate(),
        }
    }

    componentDidMount() {
        this.socket.on("user_state_update", data => {
            if (this.state.opponent.id === data["user_id"]) {
                console.log(data["ready"])
                this.setState({opponentReady: JSON.parse(data["ready"])}, console.log(this.state))
            }
        })
    }

    boardReady() {
        this.setState({boardReady: true})
        this.socket.emit("board_ready", {
            id: this.googleId,
            room_id: this.state.room
        })
    }

    cancelBoardReady() {
        this.setState({boardReady: false})
        this.socket.emit("cancel_board_ready", {
            id: this.googleId,
            room_id: this.state.room
        })
    }

    render() {
        return (
            <div>
                <h3>
                    This is the room: {this.state.room}
                </h3>
                <h3>
                    This is your opponent
                </h3>
                <h3>
                    NAME: {this.state.opponent.name}
                </h3>
                <h3>
                    PLAYER ID: {this.state.opponent.id}
                </h3>
                <SetupPage/>
                <Button variant="primary" disabled={this.state.boardReady} onClick={this.boardReady.bind(this)}>
                    Ready!
                </Button>
                <Button variant="secondary" disabled={!this.state.boardReady}
                        onClick={this.cancelBoardReady.bind(this)}>
                    Not ready...
                </Button>
                <h3>
                    Opponent ready: {this.state.opponentReady ? "Yes" : "No"}
                </h3>
                {this.state.opponentReady && this.state.boardReady ? <h3>Everyone is ready!</h3> : ""}
            </div>
        )
    }
}