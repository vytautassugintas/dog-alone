import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faWeightHanging,
  faDrum,
  faClock
} from '@fortawesome/free-solid-svg-icons';

library.add(faWeightHanging, faDrum, faClock);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();