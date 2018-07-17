import React, { Component } from 'react';
import { ListGroupItem} from 'react-bootstrap';
import {FormattedTime} from 'react-player-controls';

export default class TopSong extends Component{
    constructor(props){
        super(props);
        this.state = {
            song: this.props.song
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({song: newProps.song})
    }

    render(){
        return(
            <ListGroupItem href={this.state.song.id}> {this.state.song.name} <div style={{float: "right"}}><FormattedTime numSeconds={this.state.song.duration/1000}/> </div></ListGroupItem>
        );
    }
}