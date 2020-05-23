import React, {Component, useState, useEffect} from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";


export default class Lobby extends Component {

    constructor(props, context) {
        super(props, context);
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        this.name = userData["name"]
        this.googleId = userData["googleId"]
        this.socket = socketIOClient(ENDPOINT);
        this.state = {value: ''};
    }

    componentDidMount() {
        this.socket.emit('register_connection', {
            newConnection: this.googleId
        })
        this.socket.on("echo", data => {
            console.log(data)
            this.setState({value: data["echo"]});
            this.response = data["echo"]
        });
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-3"> Welcome: {this.name} </div>
                </div>
                <div>
                    Connected users: {this.state.value}
                </div>
            </div>
        )
    }
}
