import { SafeAreaWebView } from "@/components/SafeAreaWebView";
import { useEffect, useRef, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type WebViewEvent = "touch-loaded" | "touch-failed";

export const Game = () => {
  const [landscape, setLandscape] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const webview = useRef<WebView>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Hide status bar and Nav bar when screen is rotated to allow better fullscreen
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

  useEffect(() => {
    if (!canRotate) {
      ScreenOrientation.supportsOrientationLockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).then((canLock) => {
        if (canLock)
          ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
      });
      return;
    }
    ScreenOrientation.unlockAsync();
  }, [canRotate]);

  useEffect(() => {
    if (landscape) {
      NavigationBar.setVisibilityAsync("hidden");
    } else {
      NavigationBar.setVisibilityAsync("visible");
    }
  }, [landscape]);

  const reloadHandle = () => {
    webview.current?.reload();
    // document.querySelector<HTMLDivElement>("#dpad")?.addEventListener('change', )
  };

  const messageHandle = ({
    nativeEvent: { data: _data },
  }: WebViewMessageEvent) => {
    console.log(_data);
    try {
      const data: { status: "success" | "error"; content: WebViewEvent } =
        JSON.parse(_data);
      if (data.status === "success") {
        switch (data.content) {
          case "touch-loaded":
            // Prevent rotate until touch controls have loaded, this prevents weird bugs
            setCanRotate(true);
            break;
          case "touch-failed":
            // If can't detect touch controls, give time for page to load then allow rotate
            setTimeout(() => setCanRotate(true), 5000);
            break;
        }
      }
    } catch {
      console.error("Malformed WebViewMessage:", _data);
      return;
    }
  };

  const injectedJS = `
    const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
    ready(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === 'attributes' && m.attributeName === "class") {
            m.target.className.includes('visible') && window.ReactNativeWebView.postMessage(JSON.stringify({content: 'touch-loaded', status: 'success'}));
          }
        });
      });
      const touchControls = document.getElementById("touchControls")
      if (!touchControls) {
        window.ReactNativeWebView.postMessage(JSON.stringify({content: "touch-failed", status: "error"}));
        return
      }
      observer.observe(touchControls, { attributes: true })
    })
`;

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
        style={{ backgroundColor: Colors.background }}
        renderLoading={() => {
          return (
            <View style={{ flex: 1, backgroundColor: Colors.background }} />
          );
        }}
        onMessage={messageHandle}
        javaScriptEnabled
        injectedJavaScript={injectedJS}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
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
};
