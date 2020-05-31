import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginByGoogle from './my-components/LoginByGoogle'
import Lobby from "./my-components/Lobby";
import Setup from "./my-components/Setup";
import Game from "./my-components/Game";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000";
const socket = socketIOClient(ENDPOINT);

function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <div className="container">
                        <Switch>
                            <Route exact path='/' render={(props) => <LoginByGoogle {...props} socket={socket} />}/>
                            <Route path='/lobby' render={(props) => <Lobby {...props} socket={socket} />}/>
                            <Route path='/setup' render={(props) => <Setup {...props} socket={socket} />}/>
                            <Route path='/game' render={(props) => <Game  {...props}socket={socket} />}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;
