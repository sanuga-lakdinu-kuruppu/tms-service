import { Router } from "express";
import { protectRoute } from "../../auth/middleware/authMiddleware.mjs";
import { USER_TYPES } from "../enum/userType.mjs";

const router = Router();

router.get(
  "/v1/users/profile",
  protectRoute([USER_TYPES.MEMBER]),
  async (request, response) => {
    try {
      const { user } = request;

      if (user) {
        console.log("user profile retrieved successfully.");
        return response.status(200).send({
          msg: "Your profile has been successfully retrieved.",
          data: {
            profile: {
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              role: user.role,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          },
        });
      } else {
        console.log("failed to retrieve user profile.");
        return response.status(404).send({
          msg: "We could not find your profile. Please try again.",
        });
      }
    } catch (error) {
      console.log(`error retrieving user profile: ${error}`);
      return response.status(500).send({
        msg: "Oops! Something went wrong while retrieving your profile. Please try again later.",
      });
    }
  }
);

router.all("/v1/users", (request, response) => {
  console.log(`method not allowed :)`);
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
