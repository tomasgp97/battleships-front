import React, {Component, useState, useEffect} from "react";
import socketIOClient from "socket.io-client";
import Table from 'react-bootstrap/Table';
import {Button, Navbar} from "react-bootstrap";
import {NavBar} from "./NavBar";

const ENDPOINT = "http://127.0.0.1:5000";


export default class Lobby extends Component {

    constructor(props, context) {
        super(props, context);
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        this.name = userData["name"]
        this.googleId = userData["googleId"]
        this.socket = socketIOClient(ENDPOINT);
        this.state = {
            gameReady: false,
            opponents: []
        };
        setInterval(() => {
            this.socket.emit('inform_state', {
                id: this.googleId,
                gameReady: this.state.gameReady
            })
        }, 1000);
    }

    componentDidMount() {
        this.socket.on("set_opponent", data => {
            this.setState({gameReady: false})
            if (data["opponent"].id !== this.googleId) {
                this.setState({opponents: [data["opponent"]]})
            }
        });
    }

    getOpponent() {
        this.setState({gameReady: true})
        this.socket.emit("get_opponent")
    }


    getListedUsers() {
        const listItems = this.state.opponents.map((user) =>
            <tr>
                <td>{user.name}</td>
            </tr>
        );
        return listItems
    }

    cancel() {
        this.setState({gameReady: false})
    }


    render() {
        return (
            <div className="container">
                <NavBar/>
                <div className="row">
                    <div className="col-sm-3"> Welcome: {this.name} </div>
                </div>
                <Button variant="primary" disabled={this.state.gameReady} onClick={this.getOpponent.bind(this)}>
                    Find opponent
                </Button>
                <Button variant="secondary" disabled={!this.state.gameReady} onClick={this.cancel.bind(this)}>
                    Cancel
                </Button>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>UserName</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.getListedUsers()}
                    </tbody>
                </Table>
            </div>
        )
    }
}
