import React, { Component } from 'react';
import { Grid, Col, Row, Image} from 'react-bootstrap';

export default class RecentTracks extends Component {
    constructor(props){
        super(props);
        this.state = {
            tracks: null,
        };
        this.fetchRecent = this.fetchRecent.bind(this)
        this.renderTracks = this.renderTracks.bind(this)
    }

    componentWillMount(){
        this.fetchRecent();
    }

    fetchRecent(){
        fetch('http://localhost:8000/library/recently-played', { 
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Headers':'application/json'
                    },
                    body: JSON.stringify({
                        username: JSON.parse(localStorage.getItem('username'))
                    })
                }).then(function(response) {
                    return response.json()
                }).then(json => {
                    console.log(json)
                    this.setState({
                        tracks: json,
                    });
                }).catch(function(error) {
                    console.log(error);
                });
    }

    renderTracks(){
        let renderedTracks = [];
        if(this.state.tracks){
            renderedTracks = this.state.tracks.map((track) => {return <Col xs={6} md={4} style={{padding: '15px'}}>
                <div style={{display: 'inline-block', whiteSpace: 'normal'}}><Image src={track.image} rounded/>{track.name}</div>
            </Col>});
        }
        return renderedTracks;
    }

    render(){
        return(
            <div>
                <h1>Recently Played</h1>
                <Grid style={{marginBottom: '200px'}}>
                    <Row>
                        {this.renderTracks()}
                    </Row>
                </Grid>
            </div>
        );
    }
}