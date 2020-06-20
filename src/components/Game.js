import socketIOClient from "socket.io-client";
import React, {Component} from "react";
import Ship from "./lib/ship";
import Cell from "./lib/cell";
import Header from "./components/common/Header";
import Battlefield from "./components/common/Battlefield";
import NavBar from "./NavBar";
import Button from "@material-ui/core/Button";


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
        this.socket.on("shoot_update", (data) => {
            const user_id = data["user_id"]
            const x = data["x"]
            const y = data["y"]
            const result = data["result"]
            console.log(x)
            console.log(y)
            console.log(result)
            if (user_id === this.state.opponent.id) {
                const opponent_cell = this.state.opponent_cells.get(`${x}:${y}`)
                opponent_cell.state = result
                this.setState({opponent_cells: this.state.opponent_cells.set(`${x}:${y}`, opponent_cell)})
                console.log("Something changed for my opponent")
                console.log(this.state.opponent_cells.get(`${x}:${y}`))
            }
            if (user_id === this.state.userData.googleId) {
                const cell = this.state.myCells.get(`${x}:${y}`)
                cell.state = result
                this.setState({myCells: this.state.myCells.set(`${x}:${y}`, cell)})
                console.log("Something changed for me")
                console.log(this.state.myCells.get(`${x}:${y}`))
            }
        })
        this.socket.on("your_turn", () => {
            console.log("ITS MY TURN")
            this.setState({myTurn: true})
        });
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
                    <Button variant="outlined" color={"inherit"} disabled={!this.state.myTurn} onClick={this.passTurn.bind(this)}>Pass Turn</Button>
            </div>

        )
    }
}