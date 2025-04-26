const yup = require("yup");
const registrationValidation = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  username: yup.string(),
  auth0Id: yup.string()
});

const loginValidation = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(3, "Password must be greater than 3 characters."),
});

const questionValidation = yup.object({
  label: yup.string().required("Question is required"),
  componentType: yup.string(),
  selectOptions: yup.array().of(yup.string()).default([]),
  radioOptions: yup.array().of(yup.string()).default([]),
  isRequired: yup.boolean().default(false),
});
const checkInValidation = yup.object({
  checkInId: yup.string().required("CheckIn id is required"),
  createdBy: yup.string().required("Publisher Name is Required"),
  published: yup.boolean().default(false),
  anonymous: yup.boolean().default(false),
  questions: yup.array().of(questionValidation).default([]),
});

module.exports = {
  registrationValidation,
  loginValidation,
  questionValidation,
  checkInValidation,
};
