import React, {Component, useState, useEffect} from "react";
import socketIOClient from "socket.io-client";
import Table from 'react-bootstrap/Table';
import {Button, Navbar} from "react-bootstrap";
import {NavBar} from "./NavBar";
import {Redirect} from "react-router-dom";

const ENDPOINT = "http://127.0.0.1:5000";


export default class Lobby extends Component {

    constructor(props, context) {
        super(props, context);
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        this.name = userData["name"]
        this.googleId = userData["googleId"]
        this.socket = props.socket
        this.state = {
            gameReady: false,
            opponents: []
        };
    }

    componentDidMount() {
        this.socket.on("set_opponent", data => {
            if (data["opponent"].id !== this.googleId) {
                console.log(data["opponent"])
                sessionStorage.setItem("opponent", JSON.stringify(data["opponent"]));
                sessionStorage.setItem("room", JSON.stringify(data["room"]))
                this.props.history.push('/setup')
            }
        });
    }

    gameReady() {
        this.setState({gameReady: true})
        this.socket.emit("game_ready", {
            id: this.googleId
        })
    }


    cancel() {
        this.setState({gameReady: false})
        this.socket.emit("cancel_game_ready", {
            id: this.googleId
        })
    }


    render() {
        return (
            <div className="container">
                <NavBar/>
                <div className="row">
                    <div className="col-sm-3"> Welcome {this.name} </div>
                </div>
                <Button variant="primary" disabled={this.state.gameReady} onClick={this.gameReady.bind(this)}>
                    Find opponent
                </Button>
                <Button variant="secondary" disabled={!this.state.gameReady} onClick={this.cancel.bind(this)}>
                    Cancel
                </Button>
            </div>
        )
    }
}
