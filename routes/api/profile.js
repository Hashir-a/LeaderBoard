const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { body, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

// @route GET api/profile/me
// @desc get current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is nor profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/profile/
// @desc create/ update user profile
// @access Private

router.post(
  '/',
  [
    auth,
    [
      body('status', 'status is required').not().isEmpty(),
      body('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim);
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
    res.send('validations passed');
  }
);

// @route GET api/profile/
// @desc get all profiles
// @access Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }
});

// @route GET api/profile/user/:user_id
// @desc get single profile
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) res.status(400).json({ error: 'Profile not found' });

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId')
      return res.status(400).json({ error: 'Profile not found' });
    res.status(500).send('server error');
  }
});

// @route DELETE api/profile/
// @desc delete profile and user
// @access Private

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'user and profile deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }
});

// @route PUT api/profile/experience
// @desc add profile experience
// @access Private

router.put(
  '/experience',
  [
    auth,
    [
      body('title', 'title is required').not().isEmpty(),
      body('company', 'Company is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;
    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExperience);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('server error');
    }
  }
);

// @route DELETE api/profile/experience/:experience_id
// @desc delete profile experience
// @access Private

router.delete('/experience/:experience_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter(
      (exp) => exp._id != req.params.experience_id
    );
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }
});

// @route PUT api/profile/education
// @desc add profile education
// @access Private

router.put(
  '/education',
  [
    auth,
    [
      body('school', 'school is required').not().isEmpty(),
      body('degree', 'degree is required').not().isEmpty(),
      body('fieldofstudy', 'fieldofstudy date is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEducation);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('server error');
    }
  }
);

// @route DELETE api/profile/education/:education_id
// @desc delete profile education
// @access Private

router.delete('/education/:education_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    let removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.education_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }
});

// @route GET api/profile/github/:username
// @desc get user repo from github
// @access Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?
      per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}
      &client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res.status(400).json({ msg: 'No github profile found' });
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
