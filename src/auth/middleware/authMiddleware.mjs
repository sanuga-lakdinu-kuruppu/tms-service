import { RETURN } from "../../common/error/returnCodes.mjs";
import { USER_STATUS } from "../../user/enum/userStatus.mjs";
import { getUserById } from "../../user/service/userService.mjs";
import jwt from "jsonwebtoken";

export const protectRoute = (allowedRoles = []) => {
  return async (request, response, next) => {
    try {
      const header = request.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        return response
          .status(401)
          .json({ msg: "Authentication token is required" });
      }

      const token = header.split(" ")[1];
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
      // const payload = {
      //   userId: "3a5989bc-a250-46c8-8f19-8a9f8b7a5884",
      // };

      const { res, value } = await getUserById(payload.userId);
      const user = value.user;

      //checking user is there
      if (res != RETURN.SUCCESS) {
        console.log(`user not found`);
        return response
          .status(401)
          .json({ msg: "User not found, please login again" });
      }

      //checking user is disabled
      if (user.status === USER_STATUS.INACTIVE) {
        return response
          .status(401)
          .json({ msg: "User is inactive, please contact admin" });
      }

      //checking user role has permission
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return response.status(401).json({
          msg: "Access denied: Your role does not have permission to do this action",
        });
      }

      request.user = user;
      next();
    } catch (error) {
      console.log(`invalid or expired token`);
      return response.status(498).json({ msg: "Token is invalid or expired" });
    }
  };
};
