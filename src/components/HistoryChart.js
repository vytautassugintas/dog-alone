import React, { Component } from 'react';
import { Chart } from 'chart.js';
import moment from 'moment';

const createChartData = ({history = []}) => ({
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
})

export class HistoryChart extends Component {
  constructor(props) {
    super(props);

    this.onTimeFrameSelect = this.onTimeFrameSelect.bind(this);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    const data = createChartData(props)
    this.createChart(data);
  }

  onTimeFrameSelect(event){
    const { value } = event.target;
    const data = createChartData(this.props)
    const now = moment().hour();

    const min = () => {
      if(value === '24'){
        return 0;
      }
      return now;
    };

    const max = () => {
      if(now + Number.parseInt(value) > 24){
        let maxTime = now + Number.parseInt(value);
        while(maxTime !== 24) {
          maxTime = maxTime - 1;
        }
        return maxTime;
      }
      return now + Number.parseInt(value);
    }

    const timeFrame = {
      min: min(),
      max: max()
    }

    this.createChart(data, timeFrame);
    this.setState({value});
  }

  createChart(data, timeFrame = {min: 0, max: 24}) {
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
                min: moment({hour: timeFrame.min}),
                max: moment({hour: timeFrame.max}),
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
    const { value } = this.state;

    return (
      <div className="box">
        <h3>HistoryChart</h3>
        <span>Time frame </span>
        <select onChange={this.onTimeFrameSelect} value={value}>
          <option value="1">1 h</option>
          <option value="3">3 h</option>
          <option value="6">6 h</option>
          <option value="24">24 h</option>
        </select>
        <canvas ref="historyCanvas" id="myChart" />
      </div>
    );
  }
}
