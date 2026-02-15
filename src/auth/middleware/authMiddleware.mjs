import { RETURN } from "../../common/error/returnCodes.mjs";
import { USER_STATUS } from "../../user/enum/userStatus.mjs";
import { getUserById } from "../../user/service/userService.mjs";
import jwt from "jsonwebtoken";

export const protectRoute = (allowedRoles = []) => {
  return async (request, response, next) => {
    try {
      const token = request.cookies.accessToken;
      if (!token) {
        console.log(`error occured during validation: Authentication token is required`);
        return response.status(401).json({
          msg: "Authentication token is required",
        });
      }

      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
      const { res: userRes, value } = await getUserById(payload.userId);
      const user = value.user;

      if (userRes !== RETURN.SUCCESS || user.status === USER_STATUS.INACTIVE) {
        console.log(`error occured during validation: User not found, please login again`);
        return response.status(401).json({
          msg: "User not found, please login again",
        });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log(`error occured during validation: Your role does not have permission to do this action`);
        return response.status(403).json({
          msg: "Access denied: Your role does not have permission to do this action",
        });
      }

      request.user = user;
      next();
    } catch (error) {
      console.log(`error occured during validation: ${error}`);
      return response.status(498).json({ msg: "Token invalid or expired" });
    }
  };
};
