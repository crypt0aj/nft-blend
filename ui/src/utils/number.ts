export const toHex = (v: string | number) => {
  const n = Number(v);
  return "0x" + n.toString(16);
};
