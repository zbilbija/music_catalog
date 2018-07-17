import React, { Component } from 'react';
import { ListGroupItem} from 'react-bootstrap';

export default class TopSong extends Component{
    constructor(props){
        super(props);
        this.state = {
            song: this.props.song
        }
    }

    render(){
        return(
            <ListGroupItem href={this.state.song.id}> {this.state.song.name} </ListGroupItem>
        );
    }
}