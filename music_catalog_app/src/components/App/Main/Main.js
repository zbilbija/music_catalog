import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SongList from '../../Songlist/SongList';
import Album from '../../Album/Album'
import Artist from '../../Artist/Artist'

export default class Main extends Component{
    render(){
        return(
            <Switch>
                <Route exact path='/'/>
                <Route path='/songs/:username' component={SongList}/>
                <Route path='/albums/:ID' component={Album}/>
                <Route path='/artists/:ID' component={Artist}/>
            </Switch>
        );
    }
}