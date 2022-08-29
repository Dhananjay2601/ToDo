const User = require("../model/userModel");

exports.signup = (req, res) => {
  let user = User(req.body);
  user.save().then((newuser, err) => {
    if (err) {
      return res.status(400).json("Unauhtorised");
    }
    return res.status(200).json(`${newuser}`);
  });
};

exports.signin = (req, res) => {
  let user = User.findOne({
    username: req.body.username,
  });
  if (user.password !== req.body.password) {
    return res.status(404).json("Username and passwords do not match!");
  } else {
    return res.status(200).json("Sign in successfull!");
  }
};
