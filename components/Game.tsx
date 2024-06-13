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
import { getGameInfoString } from "./utils/getGameInfo";
import { getTouchControlsString } from "./utils/getTouchControls";
import { useIsLandscape } from "@/hooks/useIsLandscape";
import { router } from "expo-router";
import { GameInfo } from "./types";
import { usePokedex } from "@/hooks/usePokedex";
import { PokedexActionMenu } from "./PokedexActionMenu";

type WebViewEvent = "touch-loaded" | "touch-failed" | "gameinfo";

export const Game = () => {
  const landscape = useIsLandscape();
  const [canRotate, setCanRotate] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [showPokedexMenu, setShowPokedexMenu] = useState(false);
  const webview = useRef<WebView>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { navigateToPokemonPokedexPage } = usePokedex();
  const pokedexButtonRef = useRef<TouchableOpacity>(null);

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

  const messageHandle = ({
    nativeEvent: { data: _data },
  }: WebViewMessageEvent) => {
    console.log("_data", _data);
    try {
      const data: {
        status: "success" | "error";
        type: WebViewEvent;
        content: any;
      } = JSON.parse(_data);
      if (data.status === "success") {
        switch (data.type) {
          case "touch-loaded":
            // Prevent rotate until touch controls have loaded, this prevents weird bugs
            setCanRotate(true);
            break;
          case "touch-failed":
            // If can't detect touch controls, give time for page to load then allow rotate
            setTimeout(() => setCanRotate(true), 5000);
            break;
          case "gameinfo":
            setGameInfo(data.content);
            break;
        }
      }
    } catch {
      console.error("Malformed WebViewMessage:", _data);
      return;
    }
  };

  const injectedJS = `${getTouchControlsString} ${getGameInfoString}`;

  const reloadHandle = () => {
    webview.current?.reload();
    // document.querySelector<HTMLDivElement>("#dpad")?.addEventListener('change', )
  };

  const pokedexHandle = () => {
    if (gameInfo) {
      setShowPokedexMenu(!showPokedexMenu);
      // navigateToPokemonPokedexPage(gameInfo.party[0].name);
    } else if (showPokedexMenu) {
      setShowPokedexMenu(false);
    }
  };

  return (
    <>
      <PokedexActionMenu
        gameInfo={gameInfo}
        show={showPokedexMenu}
        landscape={landscape}
        onClose={() => setShowPokedexMenu(false)}
        buttonRef={pokedexButtonRef}
      />
      <StatusBar
        hidden={landscape}
        translucent
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
      />
      {landscape ? (
        <>
          <View style={{ position: "absolute", top: 0, left: 0 }}>
            <TouchableOpacity style={{ padding: 2 }} onPress={reloadHandle}>
              <Ionicons name="refresh-circle-outline" size={36} color="white" />
            </TouchableOpacity>
          </View>
          {gameInfo && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 11,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}
              ref={pokedexButtonRef}
              onPress={pokedexHandle}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Pokedex</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View
          style={{
            position: "absolute",
            width: dimensions.width - 20,
            top: (dimensions.width * 9) / 16 + insets.top,
            marginHorizontal: 10,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Text style={{color: 'white', fontSize: 16}}>Refresh Page</Text> */}
          <TouchableOpacity style={{ padding: 2 }} onPress={reloadHandle}>
            <Ionicons name="refresh-circle-outline" size={36} color="white" />
          </TouchableOpacity>
          {gameInfo && (
            <TouchableOpacity
              style={{
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
                zIndex: 11,
              }}
              onPress={pokedexHandle}
              ref={pokedexButtonRef}
            >
              <Text style={{ color: "white", fontSize: 16 }}>Pokedex</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};
