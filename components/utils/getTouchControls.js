const getTouchControls = () => {
  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);
  ready(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "attributes" && m.attributeName === "class") {
          m.target.className.includes("visible") &&
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: "touch-loaded", status: "success" })
            );
        }
      });
    });
    const touchControls = document.getElementById("touchControls");
    if (!touchControls) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "touch-failed", status: "error" })
      );
      return;
    }
    observer.observe(touchControls, { attributes: true });
  });
};

export const getTouchControlsString = `
const getTouchControls = () => {
  const ready = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);
  ready(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "attributes" && m.attributeName === "class") {
          m.target.className.includes("visible") &&
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: "touch-loaded", status: "success" })
            );
        }
      });
    });
    const touchControls = document.getElementById("touchControls");
    if (!touchControls) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "touch-failed", status: "error" })
      );
      return;
    }
    observer.observe(touchControls, { attributes: true });
  });
};
getTouchControls();
`;
