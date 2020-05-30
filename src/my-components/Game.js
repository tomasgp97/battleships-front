import socketIOClient from "socket.io-client";
import React, {Component} from "react";
import Ship from "./battleship/lib/ship";
import Cell from "./battleship/lib/cell";
import {Button} from "react-bootstrap";
import {IShip} from "./battleship/types";
import Header from "../components/common/Header";
import Battlefield from "../components/common/Battlefield";
import ShipList from "../components/settings_page/ShipList";
import DragAndDropCursor from "../components/common/DragAndDropCursor";

const ENDPOINT = "http://127.0.0.1:5000";


export default class Game extends Component {

    constructor(props, context) {
        super(props, context);
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        this.name = userData['name']
        this.googleId = userData["googleId"]
        this.socket = socketIOClient(ENDPOINT);
        this.state = {
            gameReady: false,
            opponents: []
        };
    }

    render() {
        return (
            <div>
                <h1>Game works</h1>
            </div>
        )
    }
}