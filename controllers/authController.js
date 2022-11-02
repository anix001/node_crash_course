const User = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  //find the user
  const foundUser = await User.findOne({username: user}).exec();
  if (!foundUser) return res.sendStatus(401); //unauthorized
  //evaluate password
  const matchPassword = await bcrypt.compare(pwd, foundUser.password);
  if (matchPassword) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    //create jwt
    const accessToken = jwt.sign(
      //payload -> in our case username
      {
        userInfo: {
          username: foundUser?.username,
          roles: roles,
        },
      },
      //access secret key
      "" + process.env.ACCESS_TOKEN_SECRET,
      //access token expire time
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      //payload -> in our case username
      { username: foundUser?.username },
      //access secret key
      "" + process.env.REFRESH_TOKEN_SECRET,
      //access token expire time
      { expiresIn: "1d" }
    );
    //saved login user with refresh token
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    //setting cookie as http so it will not be vulnerable
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, roles });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
