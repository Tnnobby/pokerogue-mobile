// This is built to be injected into browser, do not have all context necessary for ts

export const getGameInfo = () => {
  // Send response message through webview api
  const sendResponse = (message) =>
    window.ReactNativeWebView.postMessage(JSON.stringify(message));

  let response = {
    status: "error",
    type: "gameinfo",
    content: {},
  };
  const info = gameInfo;

  if (!info) {
    sendResponse(response);
    return;
  }
  response.status = "success";
  response.content = info;
  sendResponse(response);
};

export const getGameInfoString = `
const getGameInfo = () => {
  // Send response message through webview api
  const sendResponse = (message) =>
    window.ReactNativeWebView.postMessage(JSON.stringify(message));

  let response = {
    status: "error",
    type: "gameinfo",
    content: {},
  };
  const info = gameInfo;

  if (!info) {
    sendResponse(response);
    return;
  }
  response.status = "success";
  response.content = info;
  sendResponse(response);
};
setInterval(getGameInfo, 5000)
`;
