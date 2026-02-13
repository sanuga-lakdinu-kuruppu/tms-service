import { RETURN } from "../../common/error/returnCodes.mjs";
import { getUserByEmail, createUser } from "../../user/service/userService.mjs";
import { hashPassword } from "../../common/util/util.mjs";

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
