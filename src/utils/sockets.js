import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3000');

export const emitDecibelIncrease = ({ decibels }) => {
  socket.emit('decibelIncrease', { dbLevel: decibels });
}

export const subscribeDecibelIncreased = cb => {
  socket.on('decibelIncreased', payload => {
    cb(payload);
  });
}