import React, { Component } from 'react';
import Album from '../Album/Album'
import TopSong from './TopSong/TopSong'
import { Media, ListGroup} from 'react-bootstrap';

export default class Artists extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentArtist: null
        }
        this.fetchArtistAlbums = this.fetchArtistAlbums.bind(this);
        this.renderAlbums = this.renderAlbums.bind(this);
        this.renderTopTracks = this.renderTopTracks.bind(this)
    }

    componentWillMount(){
        this.fetchArtistAlbums()
    }

    fetchArtistAlbums(){
        fetch('http://localhost:8000/artists/get-albums', { 
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Headers':'application/json'
                    },
                    body: JSON.stringify({
                        username: JSON.parse(localStorage.getItem('username')),
                        artistId: this.props.match.params.ID
                    })
                }).then(function(response) {
                    return response.json()
                }).then(json => {
                    console.log(json)
                    this.setState({
                        currentArtist: json
                    })
                    
                }).catch(function(error) {
                    console.log(error);
                });
    }

    renderAlbums(){
        let albums= [];
        if(this.state.currentArtist){
            albums = this.state.currentArtist.albums.map(function(album){
                return <div><Album albumId={album.id} /> <br/></div>
            });
        }
        return albums;
    }

    renderTopTracks(){
        let topTracks = []
        if(this.state.currentArtist){
            topTracks = this.state.currentArtist.topTracks.map((track) => {return <TopSong song={track} />})
        }
        return topTracks;
    }


    render(){
        return(
            <div>
                <Media>
                    <Media.Left align="top">
                            <img width={this.state.currentArtist && this.state.currentArtist.image.width} height={this.state.currentArtist && this.state.currentArtist.image.height}
                            src={this.state.currentArtist && this.state.currentArtist.image.url} alt="album_thumbnail" />
                    </Media.Left>
                    <Media.Body>
                        <Media.Heading componentClass="h1">{this.state.currentArtist && this.state.currentArtist.name}</Media.Heading>
                        <h3>Top tracks</h3>
                        <ListGroup>
                            {this.renderTopTracks()}
                        </ListGroup>
                    </Media.Body>
                </Media>
                <br/><br/>
                {this.renderAlbums()}
            </div>
        );
    }
}