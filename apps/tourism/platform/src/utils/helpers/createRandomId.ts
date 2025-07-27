export const createRandomID = () => {
  const currentTime = new Date().getTime();
  const multiplier = parseInt(currentTime.toString().slice(-3));
  const randomNumber = `${
    (Math.random() * multiplier).toString().split('.')[1]
  }-${(Math.random() * multiplier).toString().split('.')[1]}-${
    (Math.random() * multiplier).toString().split('.')[1]
  }`;
  return randomNumber;
};
