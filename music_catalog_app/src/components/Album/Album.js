import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {FormattedTime} from 'react-player-controls';
import { Media} from 'react-bootstrap';

export default class Album extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentAlbum : null,
            allTracks : null
        }
        this.fetchAlbum = this.fetchAlbum.bind(this);
    }

    componentWillMount(){
        this.fetchAlbum()
    }

    fetchAlbum(){
        fetch('http://localhost:8000/albums/album', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Headers':'application/json'
            },
            body: JSON.stringify({
              username: JSON.parse(localStorage.getItem('username')),
              albumId: ( (this.props.match && this.props.match.params.ID) || this.props.albumId ),
            })
          }).then(function(response) {
            return response.json()
          }).then(json => {
            console.log('parsed json', json)
            let list = json.tracks.map(function(track){
                return {id: track.id, name: track.name, duration: track.duration, number: track.number}
            });
            this.setState({
                currentAlbum: json,
                allTracks: list
            });
          })
    }

    durationFormat(cell, row, enumObject, rowIndex){
        return (
            <FormattedTime numSeconds={cell/1000}/>
        );
    }

    render(){
        return(
            <div>
                <Media>
                    <Media.Left align="middle">
                            <img width={this.state.currentAlbum && this.state.currentAlbum.image.width} height={this.state.currentAlbum && this.state.currentAlbum.image.height} src={this.state.currentAlbum && this.state.currentAlbum.image.url} alt="album_thumbnail" />
                    </Media.Left>
                    <Media.Body>
                        <Media.Heading componentClass="h2">{this.state.currentAlbum && this.state.currentAlbum.artistName}</Media.Heading>
                            <p>
                                <h1>{this.state.currentAlbum && this.state.currentAlbum.name}</h1>
                            </p>
                    </Media.Body>
                </Media>
                <br/>
                    <BootstrapTable data={this.state.allTracks} striped hover>
                    <TableHeaderColumn width='10%' dataField='number' key={0}>#</TableHeaderColumn>
                    <TableHeaderColumn hidden ={true} isKey dataField='id' key={1}>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name' key={2} tdStyle={{ whiteSpace: 'normal' }}>Name</TableHeaderColumn>
                    <TableHeaderColumn width='10%'  dataField='duration' key={3} dataFormat={this.durationFormat.bind(this)} tdStyle={{ whiteSpace: 'normal' }} >Duration</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}