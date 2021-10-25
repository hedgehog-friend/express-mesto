const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка:${err}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: `Пользователь ${userId} не найден` });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка:${err}` }));
};

const editUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: `Произошла ошибка: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const editAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.ValidationError) {
        res.status(400).send({ message: `Произошла ошибка:${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка:${err}` });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUser,
  editAvatar,
};
