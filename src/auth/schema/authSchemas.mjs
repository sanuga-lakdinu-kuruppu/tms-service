export const registerSchema = {
  email: {
    notEmpty: {
      errorMessage: "Oops! Please enter your email address.",
    },
    isEmail: {
      errorMessage:
        "Hmm… that doesn’t look like a valid email. Please check and try again.",
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: "Oops! Please enter your first name.",
    },
    isString: {
      errorMessage: "Oops! Please enter a valid first name.",
    },
    isLength: {
      options: {
        min: 1,
        max: 30,
      },
      errorMessage: "Oops! Please enter a valid first name.",
    },
    trim: true,
  },
  lastName: {
    notEmpty: {
      errorMessage: "Oops! Please enter your last name.",
    },
    isString: {
      errorMessage: "Oops! Please enter a valid last name.",
    },
    isLength: {
      options: {
        min: 1,
        max: 30,
      },
      errorMessage: "Oops! Please enter a valid last name.",
    },
    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Oops! Please enter your password!",
    },
    isLength: {
      options: { min: 8 },
      errorMessage:
        "Oops! Your password needs to be at least 8 characters long",
    },
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: "Oops! Please confirm your password!",
    },
    isLength: {
      options: { min: 8 },
      errorMessage:
        "Oops! Your password needs to be at least 8 characters long",
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Oops! Passwords do not match!");
        }
        return true;
      },
    },
  },
};

export const loginSchema = {
  email: {
    notEmpty: {
      errorMessage: "Oops! Please enter your email address.",
    },
    isEmail: {
      errorMessage:
        "Hmm… that doesn’t look like a valid email. Please check and try again.",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Oops! Please enter your password!",
    },
  },
};
