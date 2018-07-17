import React, { Component } from 'react';
import {FormattedTime, ProgressBar, PlaybackControls } from 'react-player-controls';
import { Media, Panel, Button, Navbar } from 'react-bootstrap';
import '../../styles/_controls.css'

class Player extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.username,
            currentSongTimer: null,
            currentSong: null,
            currentSongTotal: 0,
            isPlayable: true, 
            isPlaying: false,
            showPrevious: true,
            hasPrevious: true,
            showNext: true,
            hasNext: true
        }
        this.timer = 0;
        this.countDown = this.countDown.bind(this)
        this.checkCurrentSong = this.checkCurrentSong.bind(this)
        this.playbackToggle = this.playbackToggle.bind(this)
    }

    componentWillMount() {
        this.checkCurrentSong()
    }

    componentWillUnmount() {
        this.cancelPlayerCheck()
    }

    cancelPlayerCheck(){
        fetch('http://localhost:8000/library/cancel-player-check', {
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Headers':'application/json'
            },
          }).then(function(response) {
            return response.json()
          }).then(json => {
            console.log("stopped player")
          })
      }


    checkCurrentSong(){
        clearInterval(this.timer);
        fetch('http://localhost:8000/library/current-track', {
          method: 'POST',
          headers: {
            //'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers':'application/json'
          },
          body: JSON.stringify({
            username: this.state.username,
            isPlaying: this.state.isPlaying
          })
        }).then(function(response) {
          return response.json()
        }).then(json => {
          console.log('parsed json', json)
          if(json.isPlaying){
            let duration = json.duration
            let miliseconds = duration - json.progressIn
            this.setState({
              currentSongTimer : this.secondsToTime(miliseconds/1000),
              currentSong : json,
              currentSongTotal: Math.ceil(duration/1000),
              isPlaying: true
              });
              this.timer = 0;
              if(this.timer === 0){
                  this.timer = setInterval(this.countDown, 1000);
              }
          } else {
              this.timer = -1;
              this.setState({
                isPlaying: false
              })
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
          this.checkCurrentSong()
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
    
    playbackToggle(isPlaying){
        console.log(isPlaying)
        this.setState({ 
            isPlaying: isPlaying })
        console.log(this.state.isPlaying);
        if(!isPlaying){
            clearInterval(this.timer);
            fetch('http://localhost:8000/library/pause-playback', {
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Headers':'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    isPlaying: isPlaying
                })
            }).then(function(response) {
                return response.json()
            }).then(json => {
                console.log('parsed json', json)
            }).catch(function(error) {
                console.log(error);
            });
        }
    }

    render(){
        return(
            <Navbar fixedBottom>
                <Panel style={{marginBottom: '0', width: '100%'}}>
                    <Panel.Body style={{width: '90%'}}>
                        <Media>
                            <Media.Left align="middle">
                            <img width={64} height={64} src={this.state.currentSong && this.state.currentSong.image} alt="track_thumbnail" />
                            </Media.Left>
                            <Media.Body>
                            <Media.Heading>{this.state.currentSong ? (this.state.currentSong.name + " - " + this.state.currentSong.artist.name) : "Nothing Currently"}</Media.Heading>
                            <p>
                                <FormattedTime numSeconds={this.state.isPlaying ? this.state.currentSongTimer.total : 0}/>
                            </p>
                                {
                                    this.state.isPlaying ? <ProgressBar className="ProgressBar" style={{position: 'relative', height: '8px', margin: '10px 0'}} isSeekable={true} totalTime={this.state.currentSongTotal} currentTime={Math.ceil((this.state.currentSongTotal - this.state.currentSongTimer.total))}/> : <ProgressBar isSeekable={true} totalTime={100} currentTime={0}/>
                                }

                                <PlaybackControls isPlayable={this.state.isPlayable} isPlaying={this.state.isPlaying} showPrevious={this.state.showPrevious}  hasPrevious={this.state.hasPrevious}  showNext={this.state.showNext}  hasNext={this.state.hasNext} 
                                onPlaybackChange={isPlaying => this.playbackToggle(isPlaying)} 
                                onPrevious={() => alert('Go to previous')}  onNext={() => alert('Go to next')}/>
                                <Button onClick={this.checkCurrentSong} className="btn btn-success" style={{float:'right'}}>Current song</Button>
                            </Media.Body>
                        </Media>
                    </Panel.Body>
                </Panel>
            </Navbar>
        );
    }
}

export default Player;