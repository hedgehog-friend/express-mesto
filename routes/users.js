const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, editUser, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({ _id: Joi.string().alphanum().length(24).required() }),
}),
getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=[\]!$'()*,;]*)$/),

  }),
}), editAvatar);

module.exports = router;
