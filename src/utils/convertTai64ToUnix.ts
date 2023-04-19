const convertTai64ToUnix = (tai64Time: number): number => {
  const time = BigInt(tai64Time) - BigInt(Math.pow(2, 62)) - BigInt(10);
  return Number(time);
};
export default convertTai64ToUnix;
