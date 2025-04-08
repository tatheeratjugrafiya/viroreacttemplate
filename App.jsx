// import {
//   ViroARScene,
//   ViroARSceneNavigator,
//   ViroText,
//   ViroTrackingReason,
//   ViroTrackingStateConstants,
// } from "@reactvision/react-viro";
// import React, { useState } from "react";
// import { StyleSheet } from "react-native";

// const HelloWorldSceneAR = () => {
//   const [text, setText] = useState("Initializing AR...");

//   function onInitialized(state, reason) {
//     console.log("onInitialized", state, reason);
//     if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
//       setText("Hello World!");
//     } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
//       // Handle loss of tracking
//     }
//   }

//   return (
//     <ViroARScene onTrackingUpdated={onInitialized}>
//       <ViroText
//         text={text}
//         scale={[0.5, 0.5, 0.5]}
//         position={[0, 0, -1]}
//         style={styles.helloWorldTextStyle}
//       />
//     </ViroARScene>
//   );
// };

// export default () => {
//   return (
//     <ViroARSceneNavigator
//       autofocus={true}
//       initialScene={{
//         scene: HelloWorldSceneAR,
//       }}
//       style={styles.f1}
//     />
//   );
// };

// var styles = StyleSheet.create({
//   f1: { flex: 1 },
//   helloWorldTextStyle: {
//     fontFamily: "Arial",
//     fontSize: 30,
//     color: "#ffffff",
//     textAlignVertical: "center",
//     textAlign: "center",
//   },
// });

/////Demo case

// import React from "react";

// 33.54338093070244, 73.11459667876713;
import { ViroARScene, ViroText, Viro3DObject } from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import Geolocation from "@react-native-community/geolocation"; // or Expo's
import { PermissionsAndroid, Platform } from "react-native";
const EARTH_RADIUS = 6378137; // meters

function getMetersFromLatLon(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const x = dLon * EARTH_RADIUS * Math.cos(((lat1 + lat2) * Math.PI) / 360);
  const z = dLat * EARTH_RADIUS;

  return { x, z };
}

const ARScene = ({ markerPosition }) => {
  return (
    <ViroARScene>
      {/* Marker Position */}
      <ViroText
        text="Here!"
        position={[markerPosition.x, 0, markerPosition.z]} // y = height
        style={{ fontSize: 20, color: "#fff" }}
      />
    </ViroARScene>
  );
};

export default function ViroARView() {
  const [markerPos, setMarkerPos] = useState({ x: 0, z: 0 });

  const currentLat = 37.7749;
  const currentLon = -122.4194;

  // const targetLat = 37.775;

  const targetLat = 33.542;
  // const targetLon = -122.4195;
  const targetLon = 73.1154;
  async function requestLocationPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This app needs access to your location to show AR markers.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        console.log(granted, "GRANTED", PermissionsAndroid.RESULTS.GRANTED);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const pos = getMetersFromLatLon(
                latitude,
                longitude,
                targetLat,
                targetLon
              );
              setMarkerPos(pos);
              console.log("SUCCESS");
            },
            (error) => console.log("location error,", error),
            { enableHighAccuracy: true }
          );
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }
  useEffect(() => {
    requestLocationPermission();
  }, []);
  console.log(markerPos);

  return (
    <ViroARSceneNavigator
      initialScene={{ scene: () => <ARScene markerPosition={markerPos} /> }}
    />
  );
}
