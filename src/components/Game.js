import socketIOClient from "socket.io-client";
import React, {Component} from "react";
import Ship from "./lib/ship";
import Cell from "./lib/cell";
import Header from "./components/common/Header";
import Battlefield from "./components/common/Battlefield";
import NavBar from "./NavBar";
import Button from "@material-ui/core/Button";
import DashBoard from "./DashBoard";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";


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
        this.state = {
            myShips: this.my_ships,
            myCells: this.my_cells,
            opponent_cells: Cell.generate(),
            opponent: opponent,
            userData: userData,
            room: room,
            myTurn: this.myTurn,
            winner: null
        };
    }

    componentDidMount() {

        this.socket.on("shoot_update", (data) => {
            const user_id = data["user_id"]
            const x = data["x"]
            const y = data["y"]
            const result = data["result"]
            const winner = data["winner"]
            if (user_id === this.state.opponent.id) {
                const opponent_cell = this.state.opponent_cells.get(`${x}:${y}`)
                opponent_cell.state = result
                this.setState({opponent_cells: this.state.opponent_cells.set(`${x}:${y}`, opponent_cell)})
            }
            if (user_id === this.state.userData.googleId) {
                const cell = this.state.myCells.get(`${x}:${y}`)
                cell.state = result
                this.setState({myCells: this.state.myCells.set(`${x}:${y}`, cell)})
            }
            if (winner !== -1) {
                this.setState({winner: winner})
            }
        })

        this.socket.on("your_turn", () => {
            this.setState({myTurn: true})
        });

        this.socket.on("receive_update", (data) => {
            const myBoard = Cell.regenerate(JSON.parse(data["myBoard"]))
            const opponentsBoard = Cell.regenerate(JSON.parse(data["opponentsBoard"]))
            const turn = data["myTurn"]
            const winner = data["winner"]
            console.log(myBoard)
            console.log(opponentsBoard)
            this.setState({myCells: myBoard, opponent_cells: opponentsBoard})
            if (turn === this.googleId) {
                this.setState({myTurn: true})
            }
            if (winner !== -1) {
                this.setState({winner: winner})
            }
        })

        this.socket.emit("request_game_status", {room_id: this.state.room, user_id: this.googleId})

    }

    backToLobby() {
        this.props.history.push('/lobby')
    }

    requestUpdate() {
        this.socket.emit("request_game_status", {room_id: this.state.room, user_id: this.googleId})
    }

    passTurn() {
        this.socket.emit("next_turn", {room_id: this.state.room})
        this.setState({myTurn: false})
    }

    handleOnClick = (x, y) => {
        if (this.state.myTurn) {
            this.socket.emit("fire", {x: x, y: y, user_id: this.googleId, room_id: this.state.room})
            this.passTurn()
        }
    };


    render() {
        return (
            <div>
                <NavBar/>
                <div className="h-container" style={{marginTop: "110px"}}>
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
                <DashBoard cells={this.state.myCells} opponent={this.state.opponent_cells}/>
                <Button variant="outlined" color={"inherit"} disabled={!this.state.myTurn}
                        onClick={this.passTurn.bind(this)}>Pass Turn</Button>
                <Button variant="outlined" color={"inherit"}
                        onClick={this.requestUpdate.bind(this)}>Reload Board</Button>
                <Dialog open={this.state.winner !== null}>
                    <DialogTitle id="simple-dialog-title">The battle is over!</DialogTitle>
                    <DialogContent>
                        {this.state.winner === this.googleId && <Typography>You win Admiral</Typography>}
                        {this.state.winner === this.state.opponent.id && <Typography>You lost Admiral</Typography>}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="inherit" onClick={this.backToLobby.bind(this)}>
                            Back to Lobby
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        )
    }
}