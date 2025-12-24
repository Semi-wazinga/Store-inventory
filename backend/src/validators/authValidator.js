const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must not exceed 50 characters",
  }),
  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 128 characters",
      "string.pattern.base":
        "Password must include at least one letter and one number",
    }),
  role: Joi.string()
    .lowercase()
    .valid("admin", "storekeeper")
    .default("storekeeper"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = { registerSchema, loginSchema };
