import { Colors } from "@/constants/Colors";
import { Fontisto } from "@expo/vector-icons";
import { createRef, forwardRef, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView, { WebViewProps } from "react-native-webview";

export const SafeAreaWebView = forwardRef<
  WebView,
  WebViewProps & { safe: boolean }
>(({ safe, ...props }: WebViewProps & { safe: boolean }, ref) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {}, []);

  console.log(insets);

  return (
    <View style={safe ? { paddingTop: insets.top, flex: 1 } : { flex: 1 }}>
      <WebView
        style={{ flex: 1, paddingBottom: insets.bottom }}
        ref={ref}
        renderError={() => (
          <View style={{ backgroundColor: Colors.background, flex: 1 }}>
            <Text style={{ color: "white", fontSize: 20, alignSelf: "center" }}>
              An Error Occured Loading the Website, check your internet
              connection and try again
            </Text>
          </View>
        )}
        {...props}
      />
    </View>
  );
});
