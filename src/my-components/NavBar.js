import React, {Component} from "react";
import Navbar from "react-bootstrap/Navbar";

export class NavBar extends Component {
    render() {
        return (
            <div className="container">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Battleships</Navbar.Brand>
                </Navbar>
            </div>
        )
    }
}