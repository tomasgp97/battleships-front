import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginByGoogle from './my-components/LoginByGoogle'
import Lobby from "./my-components/Lobby";
import Room from "./my-components/Room";

function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <div className="container">
                        <Switch>
                            <Route exact path='/' component={LoginByGoogle}/>
                            <Route path='/lobby' component={Lobby}/>
                            <Route path='/room' component={Room}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;
