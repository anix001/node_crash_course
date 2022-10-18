const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  //find the user
  const foundUser = usersDB?.users?.find((person) => (person.username === user));
  if (!foundUser) return res.sendStatus(401); //unauthorized
  //evaluate password
  const matchPassword = await bcrypt.compare(pwd, foundUser.password);
  if (matchPassword) {
    //create jwt
    res.json({ sucess: `User ${user} is loggedIn!` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
