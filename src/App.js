import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginByGoogle from './my-components/LoginByGoogle'
import Lobby from "./my-components/Lobby";
import Setup from "./my-components/Setup";
import Game from "./my-components/Game";


function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <div className="container">
                        <Switch>
                            <Route exact path='/' component={LoginByGoogle}/>
                            <Route path='/lobby' component={Lobby}/>
                            <Route path='/setup' component={Setup}/>
                            <Route path='/game' component={Game}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;
