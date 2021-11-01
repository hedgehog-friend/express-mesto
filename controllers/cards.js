const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch((err) => {
    res.status(500).send({ message: `Внутренняя ошибка сервера:${err}` });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => Card.findById(req.params.cardId)
  .then((card) => {
    if (card === null) {
      return res.status(404).send({ message: `Карточка c id ${req.params.cardId} не найдена` });
    }
    if (card.owner.toString() !== req.user._id) { return res.status(403).send({ message: 'Нельзя удалять карточку, принадлежащую другому пользователю' }); }
    return Card.findByIdAndRemove(req.params.cardId)
      .then((deletedCard) => {
        if (deletedCard === null) {
          res.status(404).send({ message: `Карточка c id ${req.params.cardId} не найдена` });
        } else {
          res.status(200).send({ message: 'Карточка успешно удалена' });
        }
      });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: ' Переданы некорректные данные для удаления карточки.' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const like = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
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
      res.status(400).send({ message: ' Переданы некорректные данные для постановки лайка.' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const dislike = (req, res) => Card.findByIdAndUpdate(
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
      res.status(400).send({ message: ' Переданы некорректные данные для снятия лайка.' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

module.exports = {
  getCards, createCard, deleteCard, like, dislike,
};
