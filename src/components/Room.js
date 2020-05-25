import React, {Component} from "react";
import socketIOClient from "socket.io-client";

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
        return (
            <div>
                <h1>
                    This is the Room {this.state.room}
                </h1>
                <h2>
                    This is your opponent => NAME: {this.state.opponent.name} ID: {this.state.opponent.id}
                </h2>
                <h2>
                    Last Message: {this.state.lastMessage}
                </h2>
            </div>
        )
    }
}