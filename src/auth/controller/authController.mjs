import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { RETURN } from "../../common/error/returnCodes.mjs";
import { registerSchema } from "../schema/authSchemas.mjs";
import { handleRegister } from "../service/authService.mjs";

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

router.all("/auth", (request, response) => {
  console.log(`method not allowed :)`);
  return response.status(405).send({ error: "method not allowed" });
});

export default router;
