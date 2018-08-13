import React from 'react'
import Link from 'gatsby-link'
import {AudioRecorder} from '../components/AudioRecorder';

const IndexPage = () => (
  <div>
    <canvas id="oscilloscope" width="640" height="480"></canvas>
    <AudioRecorder/>
    <Link to="/stats/">Statistics</Link>
  </div>
)

export default IndexPage
