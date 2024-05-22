import { SafeAreaProvider } from "react-native-safe-area-context";

import { Game } from "@/components/Game";

export default function Index() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#484050" }}>
      <Game />
    </SafeAreaProvider>
  );
}
