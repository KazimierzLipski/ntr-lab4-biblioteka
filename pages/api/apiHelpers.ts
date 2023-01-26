import { decode, passphrase } from "../../../src/AESencode";

export function parsePID(pid: string) {
  const encodedPid = decode(pid, passphrase);
  const [userIDstr, insuranceIDstr] = encodedPid.split("-");
  return [Number(userIDstr), Number(insuranceIDstr)];
}