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
        const my_ships_json = JSON.parse(sessionStorage.getItem("my_ships"))
        const my_ships = my_ships_json.map(function (x) {
            return new Ship(x)
        })
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const opponent = JSON.parse(sessionStorage.getItem('opponent'));
        const room = JSON.parse(sessionStorage.getItem('room'));
        const my_cells = Cell.generate()
        Cell.updateCells(my_cells, my_ships)
        this.name = userData['name']
        this.googleId = userData["googleId"]
        this.socket = socketIOClient(ENDPOINT);
        this.state = {
            my_ships: my_ships,
            my_cells: my_cells,
            opponent_cells: Cell.generate(),
            opponent: opponent,
            userData: userData,
            room: room
        };
    }


    componentDidMount() {
        console.log(this.state.my_ships)
        console.log(this.state.my_cells)
    }

    render() {
        return (
            <div className="page v-container">
                <Header as="h3" content="Whist all up!"/>
                <div className="h-container">
                    <div className="h-container__col">
                        <Battlefield cells={this.state.my_cells} />
                    </div>

                    <div className="h-container__col">
                        <Battlefield
                            hidden={true}
                            cells={this.state.opponent_cells}
                            onCellClick={this.handleOnClick}
                        />
                    </div>
                </div>
            </div>
        )
    }
}