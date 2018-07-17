import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog';
import { Link } from 'react-router-dom';

class SongDetailsButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(cell, row, rowIndex) {
        this.dialog.show({
            body: `Confirm... "${cell}"?`,
            actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                // do whatever you want
                })
            ]
        })
   }

   render() {
        const { cell, row, rowIndex } = this.props;
        return (
            <React.Fragment>
                <Button
                    bsStyle="link"
                    bsSize="large"
                    onClick={() => this.handleClick(cell, row, rowIndex)}
                    style={{whiteSpace: 'normal'}}
                >{cell}</Button>
                <Dialog ref={(el) => { this.dialog = el }} />
            </React.Fragment>
        )
    }
}

class ArtistDetailsButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, cell, row, rowIndex) {
        event.preventDefault();
        switch(this.props.type){
            case "album":
                console.log(JSON.parse(localStorage.getItem('username')))
                fetch('http://localhost:8000/albums/album', { //album url
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Headers':'application/json'
                    },
                    body: JSON.stringify({
                        username: JSON.parse(localStorage.getItem('username')),
                        albumId: cell.id
                    })
                }).then(function(response) {
                    return response.json()
                }).then(json => {
                    console.log('parsed json', json)
                }).catch(function(error) {
                    console.log(error);
                });
                break;
            case "artist":
                fetch('http://localhost:8000/artists/get-albums', { //artist url
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Headers':'application/json'
                    },
                    body: JSON.stringify({
                        username: JSON.parse(localStorage.getItem('username')),
                        artistId: cell.id
                    })
                }).then(function(response) {
                    return response.json()
                }).then(json => {
                    
                }).catch(function(error) {
                    console.log(error);
                });
                break;
        }
   }

   render() {
        const { cell, row, rowIndex } = this.props;
        return (
            <Link className="btn btn-link btn-lg" style={{whiteSpace: 'normal'}} to={"/" + this.props.type + "s/" + cell.id}> {cell.name}</Link>
        )
    }
}

export {SongDetailsButton, ArtistDetailsButton}