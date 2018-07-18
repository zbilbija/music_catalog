import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SongList from '../../Songlist/SongList';
import Album from '../../Album/Album'
import Artist from '../../Artist/Artist'
import RecentTracks from '../../RecentlyPlayed/RecentTracks'
import Player from '../../Player/Player'

export default class Main extends Component{
    render(){
        return(
            <div style={{marginLeft: "10em", marginTop: '5em'}}>
            <Switch>
                <Route exact path='/'/>
                <Route path='/songs/:username' component={SongList}/>
                <Route path='/albums/:ID' component={Album}/>
                <Route path='/artists/:ID' component={Artist}/>
                <Route path='/recent/' component={RecentTracks}/>
            </Switch>
            <Player username={this.props.username}/>
            </div>
        );
    }
}