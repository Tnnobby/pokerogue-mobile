import { useIsLandscape } from "@/hooks/useIsLandscape";
import { SafeAreaWebView } from "./SafeAreaWebView";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export const PokedexView = () => {
  const landscape = useIsLandscape();
  const params = useLocalSearchParams();
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
    <SafeAreaWebView
      safe={!landscape}
      source={{
        uri,
      }}
      style={{ backgroundColor: Colors.background }}
      renderLoading={() => {
        return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
      }}
    />
  );
};
