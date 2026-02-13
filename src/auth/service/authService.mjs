import { RETURN } from "../../common/error/returnCodes.mjs";
import {
  getUserByEmail,
  createUser,
  updateUserAfterLogin,
} from "../../user/service/userService.mjs";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../../common/util/util.mjs";
import { USER_STATUS } from "../../user/enum/userStatus.mjs";
import { TOKEN_TYPE } from "../enum/tokenType.mjs";

export const handleLogin = async (data) => {
  // check if user exists
  const {
    res,
    value: { user },
  } = await getUserByEmail(data.email);
  if (res !== RETURN.SUCCESS) {
    console.log(`user ${data.email} does not exist`);
    return { res: RETURN.INVALID_CREDENTIALS, value: null };
  }

  // verify password
  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    console.log(`password verification failed for user ${data.email}`);
    return { res: RETURN.INVALID_CREDENTIALS, value: null };
  }

  // check if user is active
  if (user.status !== USER_STATUS.ACTIVE) {
    console.log(`user ${data.email} is not active`);
    return { res: RETURN.USER_NOT_ACTIVE, value: null };
  }

  // generate token
  const accessToken = generateToken(user.userId, user.role, TOKEN_TYPE.ACCESS);
  const refreshToken = generateToken(
    user.userId,
    user.role,
    TOKEN_TYPE.REFRESH
  );

  // update user after login
  const { res: updateRes } = await updateUserAfterLogin(user);
  if (updateRes !== RETURN.SUCCESS) {
    console.log(`user ${data.email} update failed`);
    return { res: RETURN.FAILED, value: null };
  }
  return { res: RETURN.SUCCESS, value: { accessToken, refreshToken } };
};

export const handleRegister = async (data) => {
  // check if user exists
  const { res } = await getUserByEmail(data.email);
  if (res === RETURN.SUCCESS) {
    console.log(`user ${data.email} already exists`);
    return { res: RETURN.EMAIL_EXISTS, value: null };
  }

  // hash password
  const hashedPassword = await hashPassword(data.password);

  // create user
  const { res: userRes } = await createUser({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    hashedPassword,
  });
  if (userRes !== RETURN.SUCCESS) {
    console.log(`user ${data.email} creation failed`);
    return { res: RETURN.FAILED, value: null };
  }
  return { res: RETURN.SUCCESS, value: null };
};
