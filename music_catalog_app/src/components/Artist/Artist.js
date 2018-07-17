import React, { Component } from 'react';
import Album from '../Album/Album'
import TopSong from './TopSong/TopSong'
import RelatedArtist from './RelatedArtist/RelatedArtist'
import { Media, ListGroup, Grid, Row, Tabs, Tab, Image} from 'react-bootstrap';

export default class Artists extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentArtist: null,
            key: 1
        }
        this.fetchArtistAlbums = this.fetchArtistAlbums.bind(this);
        this.renderAlbums = this.renderAlbums.bind(this);
        this.renderTopTracks = this.renderTopTracks.bind(this)
        this.handleTabChange = this.handleTabChange.bind(this)
        this.renderRelatedArtists = this.renderRelatedArtists.bind(this)
    }

    componentWillMount(){
        this.fetchArtistAlbums(this.props)
    }

    componentWillReceiveProps(newProps){
        console.log(newProps)
        this.fetchArtistAlbums(newProps)
        /*this.renderAlbums()
        this.renderRelatedArtists()
        this.renderTopTracks()*/
    }

    fetchArtistAlbums(props){
        fetch('http://localhost:8000/artists/get-albums', { 
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Headers':'application/json'
                    },
                    body: JSON.stringify({
                        username: JSON.parse(localStorage.getItem('username')),
                        artistId: props.match.params.ID
                    })
                }).then(function(response) {
                    return response.json()
                }).then(json => {
                    console.log(json)
                    this.setState({
                        currentArtist: json,
                        key: 1
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

    renderRelatedArtists(){
        /*<img width={this.state.currentArtist && this.state.currentArtist.image.width} height={this.state.currentArtist && this.state.currentArtist.image.height}
        src={this.state.currentArtist && this.state.currentArtist.image.url} alt="album_thumbnail" />*/
        let relatedArtists= []
        if(this.state.currentArtist){
            relatedArtists = this.state.currentArtist.relatedArtists.map((artist) => {return <RelatedArtist artist={artist} />})
        }
        return relatedArtists;
    }

    handleTabChange(key){
        this.setState({key: key})
    }

    render(){
        return(
            <div>
                <Media style={{marginRight: '50px'}}>
                    <Media.Left align="top">
                    <Image src={this.state.currentArtist && this.state.currentArtist.image.url} rounded={true} />
                            
                    </Media.Left>
                    <Media.Body>
                        <Media.Heading componentClass="h1">{this.state.currentArtist && this.state.currentArtist.name}</Media.Heading>
                        <Tabs activeKey={this.state.key} onSelect={this.handleTabChange}>
                            <Tab title="Top tracks" eventKey={1} style={{ border: '0'}}>
                                <ListGroup>
                                    {this.renderTopTracks()}
                                </ListGroup>
                            </Tab>
                            <Tab title="Related Artists" eventKey={2}>
                                <Grid>
                                    <Row className="show-grid">
                                        {this.renderRelatedArtists()}
                                    </Row>
                                </Grid>
                            </Tab>
                        </Tabs>
                    </Media.Body>
                </Media>
                <br/><br/>
                {this.renderAlbums()}
            </div>
        );
    }
}