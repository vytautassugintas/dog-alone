import React from 'react'
import Link from 'gatsby-link'
import {AudioRecorder} from '../components/AudioRecorder';

const IndexPage = () => (
  <div>
    <AudioRecorder/>
    <Link to="/stats/">Statistics</Link>
  </div>
)

export default IndexPage
