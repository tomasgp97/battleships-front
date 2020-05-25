import React from 'react';
import {Button} from "react-bootstrap";

export default class GameBoard extends React.Component {

    constructor() {
        super();
        const board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 4, 4, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.state = {
            board: board
        }
    }


    renderSquare(row, col) {


        switch (this.state.board[row][col]) {
            case 0:
                return (
                    <div className="empty"/>
                );
            case 4:
                return (<div className="ship"/>)
            case 2:
                return (
                    <div className="empty"/>
                );
            case 3:
                return <div className="hit"/>;
            case 1:
                return <div className="miss"/>;
        }
    }

    render() {
        let rows = [];
        for (let row = 0; row < this.state.board.length; row++) {
            let thisRow = [];
            for (let col = 0; col < this.state.board[row].length; col++) {
                let square = this.renderSquare(row, col);
                thisRow.push(square);
            }
            rows.push(<div className="game-row">{thisRow}</div>);
        }

        return (
            <div>
                <div className={''}>
                    {rows}
                </div>
            </div>
        );
    }
}