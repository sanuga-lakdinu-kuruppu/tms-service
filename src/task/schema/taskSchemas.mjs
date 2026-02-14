import { TASK_STATUS } from "../enum/taskStatus.mjs";

export const createTaskSchema = {
  name: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task name.",
    },
    isString: {
      errorMessage: "Oops! Please enter a valid task name.",
    },
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Oops! Please enter a valid task name.",
    },
    trim: true,
  },
  description: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task description.",
    },
    isString: {
      errorMessage: "Oops! Please enter a valid task description.",
    },
    isLength: {
      options: {
        min: 1,
        max: 1000,
      },
      errorMessage: "Oops! Please enter a valid task description.",
    },
    trim: true,
  },
  priority: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task priority.",
    },
    isInt: {
      options: { min: 1, max: 10 },
      errorMessage: "Oops! Task priority must be a number between 1 and 10.",
    },
    toInt: true,
  },
};

export const updateTaskSchema = {
  name: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task name.",
    },
    isString: {
      errorMessage: "Oops! Please enter a valid task name.",
    },
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Oops! Please enter a valid task name.",
    },
    trim: true,
  },
  description: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task description.",
    },
    isString: {
      errorMessage: "Oops! Please enter a valid task description.",
    },
    isLength: {
      options: {
        min: 1,
        max: 1000,
      },
      errorMessage: "Oops! Please enter a valid task description.",
    },
    trim: true,
  },
  priority: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task priority.",
    },
    isInt: {
      options: { min: 1, max: 10 },
      errorMessage: "Oops! Task priority must be a number between 1 and 10.",
    },
    toInt: true,
  },
  status: {
    notEmpty: {
      errorMessage: "Oops! Please enter the task status.",
    },
    isIn: {
      options: [Object.values(TASK_STATUS)],
      errorMessage: "Oops! Please enter a valid task status.",
    },
  },
};
