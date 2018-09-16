import openSocket from 'socket.io-client';

const SOCKET_HOST = process.env.SOCKET_HOST || 'https://dog-alone.herokuapp.com/';

const socket = openSocket(SOCKET_HOST);

export const emitDecibelIncrease = ({ decibels }) => {
  socket.emit('decibelIncrease', { dbLevel: decibels });
};

export const subscribeDecibelIncreased = cb => {
  socket.on('decibelIncreased', payload => {
    cb(payload);
  });
};

export const subscribeToHistory = cb => {
  socket.on('decibelsLog', payload => {
    cb(payload);
  });
};
