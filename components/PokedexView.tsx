import { useIsLandscape } from "@/hooks/useIsLandscape";
import { SafeAreaWebView } from "./SafeAreaWebView";
import { Colors } from "@/constants/Colors";
import { Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PokedexView = () => {
  const landscape = useIsLandscape();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  console.log(params);
  const url = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach((entry) => {
      if (typeof entry[1] === "string") url.append(entry[0], entry[1]);
    });
  }
  const uri = `https://ydarissep.github.io/PokeRogue-Pokedex/?${url.toString()}`;
  console.log(uri);

  return (
    <>
      <TouchableOpacity
        style={{
          borderRadius: 100,
          height: 50,
          width: 50,
          position: "absolute",
          bottom: 10,
          left: 10,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          backgroundColor: "red",
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" color={"white"} size={16} />
      </TouchableOpacity>
      <SafeAreaWebView
        safe={!landscape}
        source={{
          uri,
        }}
        style={{ backgroundColor: Colors.background }}
        renderLoading={() => {
          return (
            <View style={{ flex: 1, backgroundColor: Colors.background }} />
          );
        }}
      />
    </>
  );
};
