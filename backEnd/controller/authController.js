const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validationRegUser, validationLoginUser } = require("../model/user");

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // 1
  const { error } = validationRegUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2
  let user = await User.findOne({ email: req.body.email });
  console.log(user)
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 3
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  // 4
  user = new User({
    email: req.body.email,
    userName:req.body.userName,
    password: hashedPass,
  });
  await user.save();
  res.status(201).json({ message: "User is created" });
});

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  // 1
  const { error } = validationLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2
  let user = await User.findOne({ email: req.body.email });
  console.log(user)
  if (!user) {

    return res.status(400).json({ message: "Email or password is not valid" });
   
  }

  // 3
  const isPasswordMatch = await bcrypt.compare(req.body.password,user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Email or password is not valid" });
  }

  // 4
  const token = user.generateAuthToken();
  
  //5
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    userName:user.userName,
    token,
  });
});
