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


export default class Game extends Component {

    constructor(props) {
        super()
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const opponent = JSON.parse(sessionStorage.getItem('opponent'));
        const room = JSON.parse(sessionStorage.getItem('room'));
        const my_ships_json = JSON.parse(sessionStorage.getItem("my_ships"))
        this.my_ships = my_ships_json.map(function (x) {
            return new Ship(x)
        })
        this.myTurn = JSON.parse(sessionStorage.getItem('my_turn'));
        this.my_cells = Cell.generate()
        Cell.updateCells(this.my_cells, this.my_ships)
        this.name = userData['name']
        this.googleId = userData["googleId"]
        this.socket = props.socket
        this.socket.emit("join_room", {room_uuid: room, user_id: userData.googleId})
        console.log(this.socket)
        this.state = {
            myShips: this.my_ships,
            myCells: this.my_cells,
            opponent_cells: Cell.generate(),
            opponent: opponent,
            userData: userData,
            room: room,
            myTurn: this.myTurn
        };
    }

    componentDidMount() {
        this.socket.on("your_turn", () => {
            console.log("ITS MY TURN")
            this.setState({myTurn: true})
        });
    }

    passTurn() {
        this.socket.emit("next_turn", {room_id: this.state.room})
        this.setState({myTurn: false})
    }

    // handleOnClick = (x: number, y: number) => {
    //     const { playerTwoCells, currentPlayer, gameState } = this.state;
    //
    //     if (currentPlayer === Players.Two || gameState === GameStates.Over) {
    //         return;
    //     }
    //
    //     let nextPlayer = Players.Two;
    //     const cell = playerTwoCells.get(`${x}:${y}`);
    //
    //     if (cell.isDamaged() || cell.isOpen()) {
    //         return;
    //     }
    //
    //     this.strike(cell, this.playerTwoShips, playerTwoCells);
    //
    //     if (cell.isDamaged()) {
    //         nextPlayer = Players.One;
    //     } else {
    //         this.counterAttack();
    //     }
    //
    //     this.setState({ playerTwoCells, currentPlayer: nextPlayer });
    // };

    render() {
        return (
            <div className="page v-container">
                <Header as="h3" content="Whist all up!"/>
                <div className="h-container">
                    <div className="h-container__col">
                        <Battlefield cells={this.state.myCells}/>
                    </div>

                    <div className="h-container__col">
                        <Battlefield
                            cells={this.state.opponent_cells}
                            onCellClick={this.handleOnClick}
                        />
                    </div>
                </div>
                <Button disabled={!this.state.myTurn} onClick={this.passTurn.bind(this)}>Pass Turn</Button>
            </div>
        )
    }
}