const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, like, dislike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=[\]!$'()*,;]*)$/).required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().hex().length(24).required() }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().hex().length(24).required() }),
}), like);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({ cardId: Joi.string().hex().length(24).required() }),
}), dislike);

module.exports = router;
