import React, { Component } from 'react';
import styled from 'styled-components'
import LoginInput from "./LoginInput/LoginInput"

class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.onFieldChange = this.onFieldChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    onFieldChange(fieldName, fieldValue){
        let newState = {};
        newState[fieldName] = fieldValue;
        this.setState(newState)
    }

    handleSubmit(e){
        e.preventDefault();
        fetch('http://localhost:8000/library/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Headers':'application/json'
            },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password
            })
          }).then(function(response) {
            return response.json()
          }).then(json => {
            this.props.parentCallback(this.state.username)  
          })
    }

    render(){
        return (
            <div className="loginContainer">
                <LoginInput name="username" isPassword={false} onFormChange={this.onFieldChange}/>
                <LoginInput name="password" isPassword={true} onFormChange={this.onFieldChange}/>
                <form className="externalForm" onSubmit={this.handleSubmit} onChange={this.onFieldChange.bind(this, 'bar')}>
                    <input className="btn btn-primary" type="submit" value="Login" /> 
                </form>
            </div>
        );
    }

}

export default styled(LoginForm)`
    background: green
`;
//export default LoginInput;