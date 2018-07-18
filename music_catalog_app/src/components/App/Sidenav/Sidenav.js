import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

export default class Sidenav extends Component {

    constructor(props){
        super(props);

        this.showSettings = this.showSettings.bind(this)
    }
    
    showSettings(event){
        event.preventDefault();
    }

    render(){

        var styles = {
            bmBurgerButton: {
              position: 'fixed',
              width: '36px',
              height: '30px',
              left: '36px',
              top: '36px'
            },
            bmBurgerBars: {
              background: '#373a47'
            },
            bmCrossButton: {
              height: '24px',
              width: '24px'
            },
            bmCross: {
              background: '#bdc3c7'
            },
            bmMenu: {
              background: '#373a47',
              padding: '2.5em 1.5em 0',
              fontSize: '1.15em'
            },
            bmMorphShape: {
              fill: '#373a47'
            },
            bmItemList: {
              color: '#b8b7ad',
              padding: '0.8em'
            },
            bmItem: {
              display: 'inline-block'
            },
            bmOverlay: {
              background: 'rgba(0, 0, 0, 0.0)'
            }
          }

        return(
            <Menu styles= {styles}>
                <Link className="btn btn-link btn-lg" to={'/recent/'}> Recently Played</Link>
                <br/>
                <Link className="btn btn-link btn-lg" to={'/songs/' + JSON.parse(localStorage.getItem('username'))}> Songlist</Link>
                <br/>
                <Link className="btn btn-link btn-lg" to={'/library-artists/' + JSON.parse(localStorage.getItem('username'))}> Artists</Link>
                <br/>
                <Link className="btn btn-link btn-lg" to={'/library-albums/' + JSON.parse(localStorage.getItem('username'))}> Albums</Link>
                <br/>
                <Link className="btn btn-link btn-lg" to={'/playlists/' + JSON.parse(localStorage.getItem('username'))}> Playlists</Link>
        </Menu>
        );
    }
}