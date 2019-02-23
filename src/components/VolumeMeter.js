import React, { useEffect } from "react";
import { init as initVolumeMeter } from "../utils/meter";

export default function VolumeMeter() {
  function onExcessVolume(volume) {
    console.log(volume);
  }

  useEffect(() => {
    initVolumeMeter({ onExcessVolume });
  }, []);

  return <div />;
}
