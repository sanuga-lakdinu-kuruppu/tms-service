import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateUUID = () => {
  return uuidv4();
};
