/*eslint-disable no-undef*/
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Table from "./board/Table";
import MapHome from "./map/MapHome";
import Navbar from "./Navbar";
import MainHome from "./MainHome";
import { Container } from "react-bootstrap";

class App extends React.Component {
    render() {
        return (
            <Container>
                <BrowserRouter>
                    <Navbar></Navbar>
                    <Route path="/" exact={true} component={MainHome} />
                    <Route path="/MapHome" component={MapHome} />
                    <Route exact Path="/TableMain" component={Table} />
                </BrowserRouter>
            </Container>
        );
    }
}

export default App;
