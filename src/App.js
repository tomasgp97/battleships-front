import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginByGoogle from './components/LoginByGoogle'
import Lobby from "./components/Lobby";

function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <div className="container">
                        <Switch>
                            <Route exact path='/' component={LoginByGoogle}/>
                            <Route path='/lobby' component={Lobby}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;
