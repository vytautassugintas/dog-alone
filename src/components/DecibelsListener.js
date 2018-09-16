import React, { Component } from 'react';
import {
  subscribeDecibelIncreased,
  subscribeToHistory
} from '../utils/sockets';

export class DecibelsListener extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      history: []
    };
  }

  componentDidMount() {
    subscribeDecibelIncreased(data => {
      this.setState(prevState => ({
        data: [data, ...prevState.data]
      }));
    });
    subscribeToHistory(({ history }) => {
      this.setState(() => ({
        history
      }));
    });
  }

  render() {
    const { data, history } = this.state;
    const messages = data.map(({ message }, index) => (
      <p key={index}>{message}</p>
    ));

    const logs = history.map(({ displayDate, dbLevel }, index) => (
      <p key={index}>
        {displayDate}
        <strong>{dbLevel}</strong>
      </p>
    ));

    return (
      <div>
        {messages}
        <div>{logs}</div>
      </div>
    );
  }
}
