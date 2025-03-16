const loginUser = async (req, res) => {
  try {
    const payload = await validationSchema.loginValidation.validate(req.body);
    const response = await User.findOne({ email: payload.email }).exec();
    const user = JSON.parse(JSON.stringify(response));

    if (!user)
      return res.status(422).send({ message: "Invalid email provided." });

    const isValidPass = await bcrypt.compare(payload.password, user.password);

    if (!isValidPass)
      return res.status(422).send({ message: "Invalid password entered." });

    const token = tokenService.createToken(user);

    const refreshToken = tokenService.createRefreshToken(user);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, path: "/" });

    res.status(200).send({ token, message: "Login Successful" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to Login User", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, path: "/" });

  res.status(200).send({ message: "Logout successful" });
};

const whoAmI = async (req, res) => {
  try {
    res.status(200).send({ message: "authenticated" });
  } catch (error) {
    res.status(401).send({ message: "unauthenticated" });
  }
};

const refreshUserToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken)
      return res.status(403).send({ message: "Unauthorised!" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, user) => {
        if (err) {
          return res.status(400).send({ message: "Refresh Token Expired" });
        }

        const userObj = JSON.parse(JSON.stringify(user));

        const token = tokenService.createToken(userObj);
        res
          .status(200)
          .send({ token, message: "Token Refreshed Successfully" });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to Refresh Token", error: error.message });
  }
};

module.exports = {
  refreshUserToken,
  whoAmI,
  logoutUser,
  loginUser
};