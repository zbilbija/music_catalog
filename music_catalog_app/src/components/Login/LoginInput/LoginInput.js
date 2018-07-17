import React, { Component } from 'react';

export default class LoginInput extends Component{
    
    constructor(props){
        super(props);
        this.onFormChange = this.onFormChange.bind(this)
    }

    onFormChange (e) {
        console.log(this.props.name)
        this.props.onFormChange(this.props.name, e.target.value);
    }

    render(){
        return (
            <div >
                <label>{this.props.name}</label>
                <form className="loginInput">
                {
                    this.props.isPassword ? <input type="password" onChange={this.onFormChange}/> : <input type="text" onChange={this.onFormChange}/>
                }
                </form>
            </div>
        );
    }
}