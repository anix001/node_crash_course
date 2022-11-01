const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  //check for duplicates usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res?.sendStatus(409); //conflict occur status

  try {
    //encrypt the password
    const hashedpwd = await bcrypt.hash(pwd, 10);
    //create and store the new user
    const result = await User.create({
      username: user,
      password: hashedpwd,
    });

    //another way to create user
    // const newUser = User();
    // newUser.userName = user;
    // newUser.password = hashedpwd;
    // const save = await newUser.save()

    //another way
    // const newUser = User({
    //   username: user,
    //   password: hashedpwd
    // });

    console.log(result);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
