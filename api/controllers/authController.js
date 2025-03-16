const validationSchema = require("../util/validationSchema");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const user = await validationSchema.registrationValidation.validate(
      req.body
    );
    const userExists = await User.findOne({ email: user.email }).exec();

    if (userExists) return res.status(409).send("Email is already registered!");

    const saveNewUser = new User({
      email: user.email,
      username: user.username,
      auth0Id: user.auth0Id,
      roles: user.roles,
    });

    // save user to db
    const savedUser = await saveNewUser.save();
    return res
      .status(201)
      .send({ message: "User registered successfully!", user: savedUser });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to Register User", error: error.message });
  }
};

const fetchUser = async (req, res) => {
  try {
    const { auth0Id, roles } = req.body;
    if (!auth0Id) {
      return res
        .status(400)
        .json({ message: "Auth0 ID is required to Find User" });
    }

    const user = await User.findOne({ auth0Id }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    // Compare the roles arrays using JSON.stringify
    if (JSON.stringify(user.roles) !== JSON.stringify(roles)) {
      const updateUserDetails = await User.findOneAndUpdate(
        { auth0Id: auth0Id },
        { roles: roles },
        { new: true }
      );

      return res.status(200).json(updateUserDetails);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  registerUser,
  fetchUser,
};
