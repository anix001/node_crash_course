const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  //find the user
  const foundUser = usersDB?.users?.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); //unauthorized
  //evaluate password
  const matchPassword = await bcrypt.compare(pwd, foundUser.password);
  if (matchPassword) {
    //create jwt
    const accessToken = jwt.sign(
      //payload -> in our case username
      { username: foundUser?.username },
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
    const otherUsers = usersDB?.users.filter(
      (person) => person.username !== foundUser?.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB?.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      //path direction
      path.join(__dirname, "..", "model", "users.json"),
      //what to write in file
      JSON.stringify(usersDB?.users)
    );
    //setting cookie as http so it will not be vulnerable
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite:'None',
      secure:true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
