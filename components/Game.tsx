import { SafeAreaWebView } from "@/components/SafeAreaWebView";
import { useEffect, useRef, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import WebView from "react-native-webview";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Game = () => {
  const [landscape, setLandscape] = useState(false);
  const webview = useRef<WebView>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Hide status bar and Nav bar when screen is rotated to allow better fullscreen
  useEffect(() => {
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

  useEffect(() => {
    if (landscape) {
      NavigationBar.setVisibilityAsync("hidden");
    } else {
      NavigationBar.setVisibilityAsync("visible");
    }
  }, [landscape]);

  const reloadHandle = () => {
    webview.current?.reload();
  };

  return (
    <>
      <StatusBar
        hidden={landscape}
        translucent
        style="dark"
        hideTransitionAnimation="slide"
      />

      <SafeAreaWebView
        ref={webview}
        safe={!landscape}
        source={{ uri: "https://pokerogue.net" }}
        style={{backgroundColor: '#484050'}}
        renderLoading={() => {
          return <View style={{flex: 1, backgroundColor: '#484050'}}/>
        }}
      />
      {landscape ? (
        <View style={{ position: "absolute", top: 0, left: 0 }}>
          <TouchableOpacity style={{ padding: 2 }} onPress={reloadHandle}>
            <Ionicons name="refresh-circle-outline" size={36} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            width: "100%",
            top: (dimensions.width * 9) / 16 + insets.top,
            marginHorizontal: 10,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <Text style={{color: 'white', fontSize: 16}}>Refresh Page</Text> */}
          <TouchableOpacity style={{ padding: 2 }} onPress={reloadHandle}>
            <Ionicons name="refresh-circle-outline" size={36} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
