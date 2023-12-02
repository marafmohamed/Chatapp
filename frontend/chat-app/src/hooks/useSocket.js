import io from "socket.io-client";

export default function useSocket() {
  const ENDPOINT = "http://localhost:3000";
  var socket = null;
  const Setup = (setUserConnectedToSocket, userInfo) => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => {
      setUserConnectedToSocket(true);
    });
  };

  return { Setup, socket };
}
