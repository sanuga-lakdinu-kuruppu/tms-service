import csurf from "csurf";

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "PROD",
    sameSite: process.env.ENVIRONMENT === "PROD" ? "none" : "lax",
    domain:
      process.env.ENVIRONMENT === "PROD" ? ".halfliferoi.online" : undefined,
    path: "/",
  },
});
