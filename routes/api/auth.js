const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route GET api/auth
// @desc
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth
// @desc authenticate user
// @access Public
router.post(
  '/',
  [
    body('email', 'Please enter valid email').isEmail(),
    body('password', 'Please is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // if user exist?
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .send({ errors: [{ message: 'Invalid credentials' }] });
      }
      //match given pass with encrypted db pass
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ errors: [{ message: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      // return jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
