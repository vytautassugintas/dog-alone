import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { initSocket } from "./utils/sockets";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faWeightHanging,
  faDrum,
  faClock,
  faPlay,
  faStop
} from "@fortawesome/free-solid-svg-icons";

library.add(faWeightHanging, faDrum, faClock, faPlay, faStop);

ReactDOM.render(<App />, document.getElementById("root"));

initSocket();
registerServiceWorker();
