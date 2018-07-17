import React, { Component } from 'react';
import { ListGroupItem, Image, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class RelatedArtist extends Component{
    constructor(props){
        super(props);
        this.state = {
            artist: this.props.artist
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({artist: newProps.artist})
    }

    render(){
        return(
            <Col xs={6} md={4} style={{padding: '15px'}}><Image src={this.state.artist.image && this.state.artist.image.url} rounded/>
            <Link to={"/artists/" + this.state.artist.id} >{this.state.artist.name} </Link> </Col>
        );
    }
}