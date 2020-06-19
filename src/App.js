import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginByGoogle from './components/LoginByGoogle'
import Lobby from "./components/Lobby";
import Setup from "./components/Setup";
import Game from "./components/Game";
import socketIOClient from "socket.io-client";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from '@material-ui/styles';

const ENDPOINT = "http://127.0.0.1:5000";
const socket = socketIOClient(ENDPOINT);

function App() {

    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });


    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <div className="App">
                    <Router>
                        <div className="container">
                            <Switch>
                                <Route exact path='/' render={(props) => <LoginByGoogle {...props} socket={socket}/>}/>
                                <Route path='/lobby' render={(props) => <Lobby {...props} socket={socket}/>}/>
                                <Route path='/setup' render={(props) => <Setup {...props} socket={socket}/>}/>
                                <Route path='/game' render={(props) => <Game  {...props} socket={socket}/>}/>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </ThemeProvider>

        </>
    );
}

export default App;
