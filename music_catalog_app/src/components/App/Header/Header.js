import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/App.css';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

export default class Header extends Component{

    render(){
        return(
            <Navbar inverse collapseOnSelect style={{right: "auto !important", left: "0px !important"}}>
                <Navbar.Header>
                        <h2 style={{float: 'left'}}><a href="/" > Spotify Music Catalog</a></h2>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem>
                            <Link className="btn btn-primary btn-lg" to={'/songs/' + JSON.parse(localStorage.getItem('username'))}> Songlist</Link>
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem>
                            <button onClick={this.props.logoutHandler} className="btn btn-primary btn-lg"> Logout</button>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}