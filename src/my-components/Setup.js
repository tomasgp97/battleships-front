import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import Ship from "./battleship/lib/ship";
import Cell from "./battleship/lib/cell";
import {Button} from "react-bootstrap";
import {IShip} from "./battleship/types";
import Header from "../components/common/Header";
import Battlefield from "../components/common/Battlefield";
import ShipList from "../components/settings_page/ShipList";
import DragAndDropCursor from "../components/common/DragAndDropCursor";

const ENDPOINT = "http://127.0.0.1:5000";

export default class Setup extends Component {
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
            inSetup: true
        }
    }

    componentDidMount() {
        this.updateCells();
        this.socket.on("user_state_update", data => {
            if (this.state.opponent.id === data["user_id"]) {
                console.log(data["ready"])
                this.setState({opponentReady: JSON.parse(data["ready"])}, console.log(this.state))
            }
        })
        this.socket.on("to_game_screen", () => {
            sessionStorage.setItem("my_ships", JSON.stringify(this.state.ships));
            this.props.history.push('/game')
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentShip !== null && this.state.currentShip === null) {
            this.updateCells();
        } else if (prevState.currentShip !== this.state.currentShip) {
            this.updateCells();
        }
    }

    updateCells() {
        const {cells, ships} = this.state;

        Cell.resetCells(cells);
        Cell.updateCells(cells, ships);

        this.setState({cells});
    }

    handleMouseDown = (shipId) => {
        const setCurrentShip = () => {
            const {ships} = this.state;

            for (let i = 0; i < ships.length; ++i) {
                if (ships[i].id === +shipId) {
                    ships[i].move(0, 0);
                    this.setState({ships, currentShip: ships[i]});

                    break;
                }
            }
        };

        setCurrentShip();
    };

    handleMouseUp = (shipId, cellX, cellY) => {
        const {ships, cells} = this.state;

        for (let i = 0; i < ships.length; ++i) {
            if (ships[i].id === shipId) {
                ships[i].move(cellX, cellY);

                if (Ship.isPositionValid(ships[i], cells)) {
                    this.setState({ships, currentShip: null});
                } else {
                    ships[i].reset();
                }

                break;
            }
        }
    };

    handleRotateShip = (ship) => {
        ship.rotate();
        this.setState({currentShip: ship});
    };

    get isReadyToPlay() {
        return this.state.ships.filter((i) => i.isOnBoard()).length === 10;
    }


    boardReady() {
        this.setState({boardReady: true})
        this.socket.emit("board_ready", {
            id: this.googleId,
            room_id: this.state.room,
            ships: this.state.ships.map((item) => item.simplify())
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
        const ships = this.state.ships
        const cells = this.state.cells
        const currentShip = this.state.currentShip

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
                <div className={"Setup"}>
                    <Header as="h3" content="Hi, admiral! Set up your flotilla!"/>
                    <div className="h-container">
                        <div className="h-container__col">
                            <Battlefield cells={cells}/>
                        </div>

                        <div className="h-container__col">
                            <ShipList ships={ships}/>

                            <ul className="brief">
                                <li>
                                    <b>move</b> - drag and drop
                                </li>
                                <li>
                                    <b>rotate</b> - select and press space
                                </li>
                            </ul>
                        </div>
                    </div>
                    <DragAndDropCursor
                        currentShip={currentShip}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onRotateShip={this.handleRotateShip}
                    />
                    <Button variant="primary" disabled={this.state.boardReady || !this.isReadyToPlay}
                            onClick={this.boardReady.bind(this)}>
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
            </div>
        )
    }
}