const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка:${err}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(
      // { data: card }
    ))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

const like = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.send())
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

const dislike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.send())
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

module.exports = { getCards, createCard, deleteCard, like, dislike };
