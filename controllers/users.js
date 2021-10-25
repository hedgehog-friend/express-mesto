const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: `Пользователь c id ${userId} не найден` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const editUser = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  },
)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: `Произошла ошибка: ${err}` });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const editAvatar = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { avatar: req.body.avatar },
  {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  },
)
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err instanceof mongoose.ValidationError) {
      res.status(400).send({ message: `Произошла ошибка:${err}` });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUser,
  editAvatar,
};
