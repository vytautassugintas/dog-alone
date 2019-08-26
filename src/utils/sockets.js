import io from "socket.io-client";

const SOCKET_HOST = process.env.SOCKET_HOST || "localhost:3000";

let socket;

export function initSocket() {
  socket = io(SOCKET_HOST);
}

export const emitDecibelIncrease = ({ decibels }) => {
  socket.emit("decibelIncrease", { dbLevel: decibels });
};

export const subscribeToDecibelRecords = cb => {
  socket.on("decibelIncreased", payload => {
    cb(payload);
  });
};

export const subscribeToDecibelHistory = cb => {
  socket.on("decibelsLog", payload => {
    cb(payload);
  });
};
