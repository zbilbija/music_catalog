import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {SongDetailsButton,ArtistDetailsButton} from './TableButtons/TableButtons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Songlist extends Component{
    constructor(props){
        super(props);
        this.fetchSongs = this.fetchSongs.bind(this)
        this.state = {
            username: JSON.parse(localStorage.getItem('username')),
            songs: null,//fetch songs,
            currentSongTimer: null,
            currentSong: null
        };
        this.timer = 0;
        this.fetchSongs = this.fetchSongs.bind(this)
        this.countDown = this.countDown.bind(this)
        this.onDonwloadSongListClick = this.onDonwloadSongListClick.bind(this)
    };
    componentWillMount() {
       this.fetchSongs()
    }
    fetchSongs(){
        fetch('http://localhost:8000/library/fetch-songs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Headers':'application/json'
            },
            body: JSON.stringify({
              username: this.state.username
              //password: 'ravensgate',
            })
          }).then(function(response) {
            return response.json()
          }).then(json => {
            console.log('parsed json', json)
            let list = json.map(function(track, index){
                return {id: track.id, name: track.name, artist: { id: track.artist.id, name: track.artist.name},
                 album: {id: track.album.id, name: track.album.name}, number: index+1 }
            });
            this.setState({
                songs: list
            });
          })
    }

    onDonwloadSongListClick(){
        fetch('http://localhost:8000/library/download', {
          method: 'POST',
          headers: {
            //'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers':'application/json'
          },
          body: JSON.stringify({
            username: this.state.username
          })
        }).then(function(response) {
          return response.json()
        }).then(json => {
          if(json.hasOwnProperty('success')){
            toast.success("Library saved to file", { autoClose: 6000 });
          }
        }).catch(function(error) {
          console.log(error);
        });
      }

    countDown(){
        let seconds = this.state.currentSongTimer.total - 1;
        this.setState({
            currentSongTimer: this.secondsToTime(seconds)
        })
        if(seconds <= 0){
          clearInterval(this.timer);
          this.onCurrentSongClick()
        }
    }

      secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60 ;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "hours": hours,
          "minutes": minutes,
          "seconds": seconds,
          "total": secs
        };
        return obj;
      }


    cellButton(cell, row, enumObject, rowIndex){
        return (
            <SongDetailsButton cell={cell} row={row} rowIndex={rowIndex}/>
        )
    }
    artistCellButton(cell, row, enumObject, rowIndex){
        return (
            <ArtistDetailsButton cell={cell} row={row} rowIndex={rowIndex} type="artist" />
        )
    }
    albumCellButton(cell, row, enumObject, rowIndex){
        return (
            <ArtistDetailsButton cell={cell} row={row} rowIndex={rowIndex} type="album" />
        )
    }

    onChangeFile(event){
        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        console.log(file);
        //add to render
        //<input id="myInput" type="file" ref={(ref) => this.upload = ref} style={{display: 'none'}} onChange={this.onChangeFile.bind(this)}/>
        //<Button label="Open File"  onClick={()=>{this.upload.click()}}/>
        /*<button onClick={this.onCurrentSongClick} className="btn btn-info">Current song</button>
                {
                this.state.currentSongTimer ? [<div><React.Fragment><Button bsStyle="primary">{this.state.currentSong.name}</Button>
                </React.Fragment></div>, <Button bsStyle="link">{this.state.currentSongTimer.minutes}:{this.state.currentSongTimer.seconds}</Button>] : null
                }*/
    }

    render(){
        if(!this.state.songs){
            return <div />
        }
        return (
            <div >
                <button onClick={this.onDonwloadSongListClick} className="btn btn-primary btn-lg">Download songs</button>
                <br/>
                <ToastContainer autoClose={8000}/>
                <br/>
                <BootstrapTable data={this.state.songs} striped hover>
                    <TableHeaderColumn isKey dataField='id' hidden={true} key={0}>Track ID</TableHeaderColumn>
                    <TableHeaderColumn width='10%' dataField='number' key={1}>#</TableHeaderColumn>
                    <TableHeaderColumn dataField='name' dataFormat={this.cellButton.bind(this)} key={2}>Track Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='artist' dataFormat={this.artistCellButton.bind(this)} key={3}>Track Artist</TableHeaderColumn>
                    <TableHeaderColumn dataField='album' dataFormat={this.albumCellButton.bind(this)} key={4} tdStyle={{ whiteSpace: 'normal' }}>Album</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default Songlist;