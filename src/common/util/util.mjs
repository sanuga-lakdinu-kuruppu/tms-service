import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { TOKEN_TYPE } from "../../auth/enum/tokenType.mjs";
import jwt from "jsonwebtoken";

export const generateToken = (userId, role, type) => {
  const payload = {
    userId: userId,
    role: role,
  };
  if (type === TOKEN_TYPE.REFRESH) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_JWT_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
  } else if (type === TOKEN_TYPE.ACCESS) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
  }
};

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
