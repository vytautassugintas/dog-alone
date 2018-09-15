import React, { Component } from 'react';
import { subscribeDecibelIncreased } from '../utils/sockets';
export class DecibelsListener extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount(){
    subscribeDecibelIncreased(data => {
      this.setState(prevState => ({
        data: [data, ...prevState.data]
      }))
    })
  }

  render(){
    const { data } = this.state;
    const messages = data.map(({message}, index) => (
      <p key={index}>{message}</p>
    ))

    return (
      <div>
        {messages}
      </div>
    )
  }

}