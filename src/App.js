import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import LoginByGoogle from './components/LoginByGoogle'
import Dashboard from './components/Dashboard'

function App() {
    return (
        <>
            <div className="App">
                <Router>
                    <div className="container">
                        <Switch>
                            <Route exact path='/' component={LoginByGoogle}></Route>
                            <Route path='/Dashboard' component={Dashboard} ></Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        </>
    );
}

export default App;
