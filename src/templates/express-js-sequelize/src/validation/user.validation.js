const Joi = require("joi");

module.exports.registerBodyValidation = Joi.object({
  userName: Joi.string()
    .min(3)
    .replace(/\s+/g, " ")
    .required()
    .trim()
    .messages({
      "string.empty": "{{#label}} is not allowed to be empty.. !!",
    }),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).trim().required(),
  phone: Joi.string()
    .trim()
    .regex(/^[0-9]{10}$/)
    .messages({
      "any.required": "{{#label}} is required!!",
      "string.length": "{{#label}} length must be 10 characters long",
      "string.pattern.base":
        "Invalid {{#label}} number. Only numbers are allowed.",
    }),
});

module.exports.verifyUserBodyValidation = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  verifyOtp: Joi.string().trim().required(),
});

module.exports.loginUserBodyValidation = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  verifyOtp: Joi.string().trim().required(),
});
