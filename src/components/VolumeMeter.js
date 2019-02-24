import React, { useEffect } from "react";
import { init as initVolumeMeter } from "../utils/meter";

export default function VolumeMeter() {
  function onExcessVolume(volume) {}

  useEffect(() => {
    initVolumeMeter({ onExcessVolume });
  }, []);

  return <div />;
}
