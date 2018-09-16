import React, { Component } from 'react';
import {
  subscribeToDecibelRecords,
  subscribeToDecibelHistory
} from '../utils/sockets';

export class DecibelsListener extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
  }

  componentDidMount() {
    subscribeToDecibelHistory(({ history }) => {
      this.setState(
        () => ({
          history
        }),
        () => {
          subscribeToDecibelRecords(data => {
            this.setState(prevState => ({
              history: [data, ...prevState.history]
            }));
          });
        }
      );
    });
  }

  render() {
    const { history } = this.state;

    const records = history.map(({ displayDate, dbLevel }, index) => (
      <p key={index}>
        {displayDate}
        <strong> {dbLevel.toFixed(2)}</strong>
      </p>
    ));

    return <div>{records}</div>;
  }
}
