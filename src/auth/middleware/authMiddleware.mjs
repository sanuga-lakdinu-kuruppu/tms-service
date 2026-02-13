import { RETURN } from "../../common/error/returnCodes.mjs";
import { getUserById } from "../../user/service/userService.mjs";
import jwt from "jsonwebtoken";

export const protectRoute = (allowedRoles = []) => {
  return async (request, response, next) => {
    try {
      const header = request.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        return response
          .status(401)
          .json({ message: "need the authentication token" });
      }

      const token = header.split(" ")[1];
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
      // const payload = {
      //   userId: "ef4f626b-990f-4635-972a-96c3a5d4cf43",
      // };

      const { res, value } = await getUserById(payload.userId);
      const user = value.user;

      //checking user is there
      if (res != RETURN.SUCCESS) {
        console.log(`user not found`);
        return response.status(401).json({ message: "user not found" });
      }

      //checking user is disabled
      if (user.isDisabled) {
        return response
          .status(401)
          .json({ message: "access temporary disabled" });
      }

      //checking user role has permission
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return response.status(401).json({
          message:
            "access denied: your role does not have permission to do this",
        });
      }

      request.user = user;
      next();
    } catch (error) {
      console.log(`invalid or expired token`);
      return response.status(498).json({ message: "invalid or expired token" });
    }
  };
};
