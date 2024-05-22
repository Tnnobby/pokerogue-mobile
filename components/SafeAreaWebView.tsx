import { createRef, forwardRef, useEffect, useRef } from "react";
import { View } from "react-native";
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
        {...props}
      />
    </View>
  );
});
