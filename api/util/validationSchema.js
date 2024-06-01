const yup = require("yup");
const registrationValidation = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Surname is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(3, "Password must be greater than 3 characters."),
});

const loginValidation= yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(3, "Password must be greater than 3 characters."),
});

module.exports = { registrationValidation, loginValidation };
