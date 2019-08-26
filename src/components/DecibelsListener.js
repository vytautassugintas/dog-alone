import React, { Component } from "react";
import {
  subscribeToDecibelRecords,
  subscribeToDecibelHistory,
  initSocket
} from "../utils/sockets";
import { HistoryChart } from "./HistoryChart";

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
      <div key={index} className="record">
        <span>
          dB: <strong> {dbLevel.toFixed(2)}</strong>
        </span>
        <div className="date">{displayDate}</div>
      </div>
    ));

    return (
      <div className="row">
        <div className="column">
          <div className="box">
            <h3>History</h3>
            {records}
          </div>
        </div>
        <div className="column-6">
          <HistoryChart history={history} />
        </div>
      </div>
    );
  }
}
