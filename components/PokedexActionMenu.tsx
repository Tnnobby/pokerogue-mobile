import {
  ListRenderItem,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameInfo, PokemonInfo } from "./types";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePokedex } from "@/hooks/usePokedex";

export const PokedexActionMenu = ({
  gameInfo,
  show,
  landscape,
  buttonRef,
  onClose,
}: {
  gameInfo?: GameInfo;
  show: boolean;
  landscape: boolean;
  buttonRef: React.RefObject<TouchableOpacity>;
  onClose: () => void;
}) => {
  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const { navigateToPokemonPokedexPage, navigateToBiomePokedexPage } =
    usePokedex();
  const [buttonRect, setButtonRect] =
    useState<
      [
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ]
    >();
  const renderPokemon: ListRenderItem<PokemonInfo> = ({ item }) => {
    return (
      <Animated.View entering={SlideInLeft} exiting={SlideOutLeft}>
        <TouchableOpacity
          style={{
            marginLeft: 5,
            paddingVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
          onPress={() => navigateToPokemonPokedexPage(item.name)}
        >
          <Text style={{ color: "white", fontSize: 16 }}>{item.name}</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  useEffect(() => {
    buttonRef?.current?.measure((...vals) => {
      console.log(vals);
      setButtonRect(vals);
    });
  }, [show, landscape]);

  return (
    <>
      {show && (
        <Animated.View
          style={{
            position: "absolute",
            zIndex: 10,
            ...frame,
          }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Pressable
            style={{
              ...insets,

              backgroundColor: "rgba(0, 0, 0, 0.75)",
              flex: 1,
            }}
            onPress={onClose}
          >
            {gameInfo && buttonRect && (
              <View
                style={{
                  left: 0,
                  top: landscape ? buttonRect[3] : buttonRect[5],
                }}
              >
                <Animated.FlatList
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                  }}
                  data={gameInfo.party}
                  renderItem={renderPokemon}
                />
                <Animated.View
                  entering={SlideInLeft}
                  exiting={SlideOutLeft}
                  style={{ alignSelf: "flex-start" }}
                >
                  <TouchableOpacity
                    style={{
                      right: 0,
                      marginLeft: 5,
                      marginTop: 10,
                      paddingVertical: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                    onPress={() => navigateToBiomePokedexPage(gameInfo.biome)}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {gameInfo.biome || "Biomes"}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};
