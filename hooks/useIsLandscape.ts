import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export const useIsLandscape = () => {
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    ScreenOrientation.getOrientationAsync().then((v) => {
      setLandscape(
        v === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          v === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? true
          : false
      );
    });
    ScreenOrientation.addOrientationChangeListener((ev) => {
      if (
        ev.orientationInfo.orientation ===
          ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        ev.orientationInfo.orientation ===
          ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setLandscape(true);
      } else {
        setLandscape(false);
      }
    });
  }, []);
  return landscape;
};
