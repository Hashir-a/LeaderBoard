const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route POST api/posts
// @desc create post
// @access private
router.post(
  '/',
  [auth, [body('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('server error');
    }
  }
);

// @route GET api/posts
// @desc get all post
// @access private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});

// @route Delete api/posts/:post_id
// @desc delete a post
// @access private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: 'post not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'user not authorized' });

    await post.deleteOne();
    res.json({ msg: 'post deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'post not found' });
    console.error(error.message);
    res.status(500).send('server error');
  }
});

// @route Get api/posts/:post_id
// @desc get single post by id
// @access private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(404).json({ msg: 'post not found' });
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'post not found' });
    console.error(error.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
