export const getTimeDiff = ({ eventTime }) => {
  const currentTime = new Date();
  const diff = currentTime - eventTime;
  return Math.round(diff / 1000);
};
