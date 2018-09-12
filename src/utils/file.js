export const getFileNameAppendix = () => {
  const date = new Date();
  return `${date.getMonth() + 1}-${date.getDate()}`;
};

export const saveBlob = (blob, fileName) => {
  // something hacky to save blob to file
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
