const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch((err) => {
    next(err);
  });

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данныепри создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => Card.findById(req.params.cardId)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError(`Карточка c id ${req.params.cardId} не найдена`);
    }
    if (card.owner.toString() !== req.user._id) { throw new NotFoundError('Нельзя удалять карточку, принадлежащую другому пользователю'); }
    return Card.findByIdAndRemove(req.params.cardId)
      .then((deletedCard) => {
        if (deletedCard === null) {
          next(new NotFoundError(`Карточка c id ${req.params.cardId} не найдена`));
        } else {
          res.status(200).send({ message: 'Карточка успешно удалена' });
        }
      });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
    } else {
      next(err);
    }
  });

const like = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    } else {
      res.status(200).send({ data: card });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные для постановки лайка');
    } else {
      next(err);
    }
  });

const dislike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    } else {
      res.status(200).send({ data: card });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные для снятия лайка');
    } else {
      next(err);
    }
  });

module.exports = {
  getCards, createCard, deleteCard, like, dislike,
};
