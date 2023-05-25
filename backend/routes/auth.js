const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = 'fuck off';

// ROUTE 1 : create user using: POST "/api/auth/createuser". no login required
router.post( "/createuser",[
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid email").isEmail(),
    body("password", "Password must be 5 characters minimum").isLength({ min: 5,}),
  ], async (req, res) => {
    let success = false;
    // if error then return bad request with error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check whether email already exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success, error: "Sorry, an user already exist with this email" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
    const data = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
      //res.json(user);
      res.json({success, authtoken})

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2 : authenticate user using: POST "/api/auth/login". no login required
router.post( "/login",[
    body("email", "Enter a Valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ], async (req, res) => {
    let success = false;
    // if error then return bad request with error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
          return res.status(400).json({success, error: "Your email-id or password is incorrect"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
          return res.status(400).json({success, error: "Your email-id or password is incorrect"});
        }

        const data = {
          user:{
              id: user.id
          }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        //res.json(user);
        res.json({success, authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

  }
);

// ROUTE 3 : get user details using: POST "/api/auth/getuser". login required
router.post( "/getuser", fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}
);

module.exports = router;
