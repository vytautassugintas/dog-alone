import React, { Component } from 'react';
import { Chart } from 'chart.js';
import moment from 'moment';

export class HistoryChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    const { history = [] } = props;

    const data = {
      datasets: [
        {
          label: 'dB level',
          borderColor: '#f3a683',
          color: '#ffffff',
          // borderWidth: 1,
          data: history.map(d => ({
            t: d.date,
            y: d.dbLevel.toFixed(2)
          }))
        }
      ]
    };

    this.createChart(data);
  }

  createChart(data) {
    const ctx = this.refs.historyCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data,
      options: {
        // elements: { point: { radius: 0 } } ,
        legend: {
          labels: {
            fontColor: '#ffffff'
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontSize: 12,
                fontFamily: "'Roboto', sans-serif",
                fontColor: '#fff',
                fontStyle: '500',
              }
            }
          ],
          xAxes: [
            {
              type: 'time',
              distribution: 'linear',
              time: {
                unit: 'hour',
                min: moment({hour: 0}),
                max: moment({hour: 24}),
              },
              ticks: {
                fontSize: 12,
                fontFamily: "'Roboto', sans-serif",
                fontColor: '#fff',
                fontStyle: '500'
              }
            }
          ]
        }
      }
    });
  }

  render() {
    const { history } = this.props;

    return (
      <div className="box">
        <h3>HistoryChart</h3>
        <canvas ref="historyCanvas" id="myChart" />
      </div>
    );
  }
}
