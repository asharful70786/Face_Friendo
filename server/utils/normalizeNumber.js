// utils/normalizePhoneNumber.js
export const normalizeNumber = (phone) => {
  const number = phone.toString();
  return number.startsWith('+') ? number : `+91${number}`;
};
