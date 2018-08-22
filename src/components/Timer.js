import React, { Component } from 'react'

export class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = { seconds: 0 }
    }

    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1,
        }))
    }

    startTimer() {
        this.interval = setInterval(() => this.tick(), 1000)
    }

    stopTimer() {
        clearInterval(this.interval)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return <span>Seconds: {this.state.seconds}</span>
    }
}
