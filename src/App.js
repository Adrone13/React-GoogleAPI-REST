import React, { Component } from 'react';
import logo from './logo.svg';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './css/App.css';

import MainContainer from './Main';


class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <br />
                
                {/* <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p> */}

                <MainContainer />

                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default App;
