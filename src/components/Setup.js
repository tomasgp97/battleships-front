import React, {Component} from "react";
import Ship from "./lib/ship";
import Cell from "./lib/cell";
import Battlefield from "./components/common/Battlefield";
import ShipList from "./components/settings_page/ShipList";
import DragAndDropCursor from "./components/common/DragAndDropCursor";
import Typography from "@material-ui/core/Typography";
import NavBar from "./NavBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";


const ENDPOINT = "http://127.0.0.1:5000";

export default class Setup extends Component {
    constructor(props) {
        super();
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const opponent = JSON.parse(sessionStorage.getItem('opponent'));
        const room = JSON.parse(sessionStorage.getItem('room'));
        this.name = userData["name"]
        this.googleId = userData["googleId"]
        this.socket = props.socket
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
            inSetup: true,
            myTurn: false
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
            sessionStorage.setItem("my_turn", JSON.stringify(this.state.myTurn));
            this.props.history.push('/game')
        })
        this.socket.on("assign_turn", () => {
            console.log("ITS MY TURN")
            this.setState({myTurn: true})
        });
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
        console.log(this.state.cells)
        console.log(JSON.stringify(this.state.cells))
        this.setState({boardReady: true})
        this.socket.emit("board_ready", {
            id: this.googleId,
            room_id: this.state.room,
            ships: this.state.ships.map((item) => item.simplify()),
            cells: Object.fromEntries(this.state.cells)
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
                <CssBaseline/>
                <NavBar/>
                <div>
                    <Grid container direction="row" justify="space-around">
                        <Grid item>
                            <Typography component="h1" variant="h5">
                                This is the room: {this.state.room}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="h3" variant="h5">
                                This is your opponent
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="h3" variant="h5">
                                NAME: {this.state.opponent.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography component="h3" variant="h5">
                                PLAYER ID: {this.state.opponent.id}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
                <Container className={"Setup"} style={{margin: "50px"}}>
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
                </Container>
                <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                    <Grid item>
                        <Grid container direction={"row"} spacing={3}>
                            <Grid item xs>
                                <Button variant="outlined" color={"inherit"}
                                        disabled={this.state.boardReady || !this.isReadyToPlay}
                                        onClick={this.boardReady.bind(this)}>
                                    Ready
                                </Button>
                            </Grid>
                            <Grid item xs>
                                <Button variant="outlined" color={"inherit"} disabled={!this.state.boardReady}
                                        onClick={this.cancelBoardReady.bind(this)}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography component="h3" variant="h5" style={{margin:"10px"}}>
                            Opponent ready: {this.state.opponentReady ? "Yes" : "No"}
                        </Typography>
                    </Grid>
                </Grid>
                {this.state.opponentReady && this.state.boardReady ?
                    <Typography component="h3" variant="h5">Everyone is ready!</Typography> : ""}
            </div>
        )
    }
}