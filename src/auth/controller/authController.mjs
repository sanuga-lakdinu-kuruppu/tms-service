import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { loginSchema, registerSchema } from "../schema/authSchemas.mjs";
import {
  handleLogin,
  handleRefreshToken,
  handleRegister,
} from "../service/authService.mjs";

const router = Router();

router.post(
  "/v1/auth/register",
  checkSchema(registerSchema),
  async (request, response) => {
    try {
      //request validation
      const result = validationResult(request);
      if (!result.isEmpty()) {
        console.log(`error occured during validation: ${result.errors[0].msg}`);
        return response.status(400).send({ msg: result.errors[0].msg });
      }
      const data = matchedData(request);

      //request processing
      const { res } = await handleRegister(data);
      if (res === RETURN.SUCCESS) {
        console.log(`register successful`);
        return response.status(200).send({
          msg: "You have successfully registered.",
        });
      } else if (res === RETURN.EMAIL_EXISTS) {
        console.log(`email ${data.email} already exists`);
        return response.status(400).send({
          msg: "Email already exists. Please try with a different email.",
        });
      } else {
        console.log(`register failed`);
        return response.status(500).send({
          msg: "Oops! Something went wrong on our end. Please try again later.",
        });
      }
    } catch (error) {
      console.log(`error during register processing: ${error}`);
      return response.status(500).send({
        msg: "Oops! Something went wrong on our end. Please try again later.",
      });
    }
  }
);

router.post(
  "/v1/auth/login",
  checkSchema(loginSchema),
  async (request, response) => {
    try {
      //request validation
      const result = validationResult(request);
      if (!result.isEmpty()) {
        console.log(`error occured during validation: ${result.errors[0].msg}`);
        return response.status(400).send({ msg: result.errors[0].msg });
      }
      const data = matchedData(request);

      //request processing
      const { res, value } = await handleLogin(data);
      if (res === RETURN.SUCCESS) {
        console.log(`login successful`);
        response.cookie("accessToken", value.accessToken, {
          httpOnly: true,
          secure: process.env.ENVIRONMENT === "PROD",
          sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
          domain:
            process.env.ENVIRONMENT === "PROD"
              ? ".halfliferoi.online"
              : undefined,
          maxAge: 30 * 60 * 1000,
          path: "/",
        });

        response.cookie("refreshToken", value.refreshToken, {
          httpOnly: true,
          secure: process.env.ENVIRONMENT === "PROD",
          sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
          domain:
            process.env.ENVIRONMENT === "PROD"
              ? ".halfliferoi.online"
              : undefined,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        return response.status(200).json({ msg: "Login successful" });
      } else if (res === RETURN.INVALID_CREDENTIALS) {
        console.log(`invalid credentials`);
        return response.status(400).send({
          msg: "Invalid credentials. Please try again.",
        });
      } else if (res === RETURN.USER_NOT_ACTIVE) {
        console.log(`user ${data.email} is not active`);
        return response.status(400).send({
          msg: "Your account is inactive. Please contact the administrator.",
        });
      } else {
        console.log(`login failed`);
        return response.status(500).send({
          msg: "Oops! Something went wrong on our end. Please try again later.",
        });
      }
    } catch (error) {
      console.log(`error during login processing: ${error}`);
      return response.status(500).send({
        msg: "Oops! Something went wrong on our end. Please try again later.",
      });
    }
  }
);

router.post("/v1/auth/refresh", async (request, response) => {
  try {
    const { refreshToken } = request.cookies;
    if (!refreshToken)
      return response.status(400).json({ msg: "Refresh token required" });

    const { res, value } = await handleRefreshToken({ refreshToken });
    if (res === RETURN.SUCCESS) {
      console.log(`refresh successful`);
      response.cookie("accessToken", value.accessToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "PROD",
        sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
        domain:
          process.env.ENVIRONMENT === "PROD"
            ? ".halfliferoi.online"
            : undefined,
        maxAge: 30 * 60 * 1000,
        path: "/",
      });

      response.cookie("refreshToken", value.refreshToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "PROD",
        sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
        domain:
          process.env.ENVIRONMENT === "PROD"
            ? ".halfliferoi.online"
            : undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return response.status(200).json({ msg: "Refresh successful" });
    } else if (res === RETURN.MALFORMED_TOKEN) {
      console.log(`malformed token`);
      return response.status(400).send({
        msg: "Your token is invalid. Please login again.",
      });
    } else {
      console.log(`refresh failed`);
      return response.status(500).send({
        msg: "Oops! Something went wrong on our end. Please try again later.",
      });
    }
  } catch (error) {
    console.log(`error during refresh processing: ${error}`);
    return response.status(500).send({
      msg: "Oops! Something went wrong on our end. Please try again later.",
    });
  }
});

router.post("/v1/auth/logout", async (request, response) => {
  try {
    console.log(`logout successful`);
    response.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "PROD",
      sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
      maxAge: 0,
      path: "/",
    });

    response.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "PROD",
      sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
      maxAge: 0,
      path: "/",
    });

    return response.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.log(`error during logout processing: ${error}`);
    return response.status(500).send({
      msg: "Oops! Something went wrong on our end. Please try again later.",
    });
  }
});

router.all("/v1/auth", (request, response) => {
  console.log(`method not allowed :)`);
  return response.status(405).send({ msg: "method not allowed" });
});

export default router;
