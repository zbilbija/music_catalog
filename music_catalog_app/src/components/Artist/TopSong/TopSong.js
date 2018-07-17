import React, { Component } from 'react';
import { ListGroupItem, Row, Col} from 'react-bootstrap';
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
            <ListGroupItem style={{ border: '0'}}> {this.state.song.name} <div className= "col-sm" style={{display: 'inline', float: "right", marginRight: "400px"}}> <FormattedTime numSeconds={this.state.song.duration/1000}/> </div> </ListGroupItem>
        );
    }
}