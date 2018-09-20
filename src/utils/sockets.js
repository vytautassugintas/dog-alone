import openSocket from 'socket.io-client';

const SOCKET_HOST = process.env.SOCKET_HOST || 'http://ramplis.sytes.net:3000';

const socket = openSocket(SOCKET_HOST);

export const emitDecibelIncrease = ({ decibels }) => {
  socket.emit('decibelIncrease', { dbLevel: decibels });
};

export const subscribeToDecibelRecords = cb => {
  socket.on('decibelIncreased', payload => {
    cb(payload);
  });
};

export const subscribeToDecibelHistory = cb => {
  socket.on('decibelsLog', payload => {
    cb(payload);
  });
};
