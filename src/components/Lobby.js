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
            users: [],
            gameReady: false,
            opponent: null
        };
    }

    componentDidMount() {
        // this.socket.on("state", () => {
        //     this.socket.emit('inform_state', {
        //         id: this.googleId,
        //         gameReady: this.gameReady
        //     })
        // });
    }

    getOpponent() {
        this.setState({gameReady: true})
        // this.socket.emit("get_opponent", data => {
        //     this.opponent = data["opponent"]
        // })
    }


    getListedUsers() {
        const listItems = this.state.users.map((user) =>
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
                <Button variant="primary" disabled={this.state.gameReady} onClick={this.getOpponent.bind(this)}>Find
                    oppponent</Button>
                <Button variant="secondary" disabled={!this.state.gameReady}
                        onClick={this.cancel.bind(this)}>Cancel</Button>
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
