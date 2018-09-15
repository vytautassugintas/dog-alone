import openSocket from 'socket.io-client';

const SOCKET_HOST = process.env.SOCKET_HOST || 'http://localhost:3000';

const socket = openSocket(SOCKET_HOST);

export const emitDecibelIncrease = ({ decibels }) => {
  socket.emit('decibelIncrease', { dbLevel: decibels });
};

export const subscribeDecibelIncreased = cb => {
  socket.on('decibelIncreased', payload => {
    cb(payload);
  });
};
