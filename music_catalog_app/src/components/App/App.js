import React, { Component } from 'react';
import '../../styles/App.css';
import '../Songlist/SongList.js'
import Songlist from '../Songlist/SongList.js';
import LoginForm from '../Login/LoginForm.js';
import Player from '../Player/Player.js';
import Main from './Main/Main';
import Header from './Header/Header'
import Sidenav from './Sidenav/Sidenav'
import history from '../../history/history'

class App extends Component {

  constructor(props){
    super(props);
    this.state={
      fetchList: false,
      showListBtn: false,
      showLogin: false,
      username: ''
    }
    this.onSongListClick = this.onSongListClick.bind(this)
    this.getUsername = this.getUsername.bind(this)
    this.checkUser = this.checkUser.bind(this)
    this.onLogoutClick = this.onLogoutClick.bind(this)
    this.cancelPlayerCheck = this.cancelPlayerCheck.bind(this)

    this.DefaultState={
      fetchList: false,
      showListBtn: false,
      showLogin: true,
      username: null
    }
  }

  componentWillMount() {
    this.checkUser()
 }

 componentWillUnmount() {
  this.cancelPlayerCheck()
  }

  checkUser(){
    const cachedUser = localStorage.getItem('username');
    if(cachedUser){
      this.setState({
        username: JSON.parse(cachedUser),
        showListBtn: true
      });
    } else {
      this.setState(this.DefaultState);
    }
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

  onSongListClick(){
    this.setState({
      fetchList: true,
      showListBtn: false,
    });
  }

  onLogoutClick(){
    fetch('http://localhost:8000/library/logout', {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Headers':'application/json'
        },
      }).then(function(response) {
        return response.json()
      }).then(json => {
        console.log("logged out")
        localStorage.removeItem('username')
        this.setState(this.DefaultState)
        history.replace('/')
      })
  }

  getUsername(val){
    console.log(val)
    localStorage.setItem('username', JSON.stringify(val));
    this.setState({
      username: val,
      showListBtn: !this.state.showListBtn,
      showLogin: !this.state.showLogin});
  }

  render() {
    if(this.state.username === ''){
      return <div />
    }

    return (
      <div className="App">
        { !this.state.showLogin && <Sidenav/> }
        {// !this.state.showLogin && <Header username={this.state.username} logoutHandler={this.onLogoutClick}/>
        }
        <div className="App-intro">
        <div className="row">
        <div className="col-sm-6" style={{marginLeft: "10em"}}>
        {
          this.state.showLogin && <LoginForm parentCallback={this.getUsername}/>
        }</div>
        </div>
        <div>
        { !this.state.showLogin && <Main username={this.state.username} /> }
        {// !this.state.showLogin && <Player username={this.state.username}/> 
        }
        {
          this.state.fetchList && <Songlist username={this.state.username}/>
        }
        </div>
        </div>
      </div>
    );
  }
}

export default App;
