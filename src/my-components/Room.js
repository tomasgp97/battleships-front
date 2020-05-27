import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import GameBoard from "./GameBoard";
import Battlefield from "./battleship/components/common/Battlefield";
import Ship from "./battleship/lib/ship";
import Cell from "./battleship/lib/cell";
import SetupPage from "./battleship/components/settings_page";

const ENDPOINT = "http://127.0.0.1:5000";

export default class Room extends Component {
    constructor(props) {
        super();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const opponent = JSON.parse(sessionStorage.getItem('opponent'));
        const room = JSON.parse(sessionStorage.getItem('room'));
        this.socket = socketIOClient(ENDPOINT);
        this.socket.emit("join_room", {room_uuid: room, user_id: userData.googleId})
        this.state = {
            room: room,
            opponent: opponent,
            userData: userData
        }
    }

    render() {
        this.socket.on("room_update", data => {
            this.setState({lastMessage: data["message"]})
        })

        const state = {
            currentShip: null,
            ships: Ship.generate(),
            cells: Cell.generate()
        };

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
                <SetupPage/>
            </div>
        )
    }
}